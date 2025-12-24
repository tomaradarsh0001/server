<?php

namespace App\Console\Commands;

use App\Models\Flat;
use App\Models\PropertyMaster;
use App\Models\PropertyScannedFile;
use App\Models\SplitedPropertyDetail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportPropertyDocuments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-property-documents';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';


    private function handlePropertyDocs($masterProperty, $propertyId, $splitedPropertyDetailId = null, $flatId = null)
    {
        // $colonyName = Str::slug($masterProperty->newColony->name);
        $colonyName = $masterProperty->newColony->name;
        $url = config('constants.propertyDocList') . $propertyId;
        Log::info($url);
        $docResponse = Http::timeout(20)->get($url);

        if ($docResponse->successful()) {
            $resp = $docResponse->json();
            if (count($resp) > 0) {
                $data = $resp[0];
                $fileUrlPath = $data['Path'] ?? '';
                $ListFileNames = $data['ListFileName'] ?? [];
                Log::info('ListFileNames', $ListFileNames);

                // ---- NEW: prepare naming pieces and find current max VOL for this property ----
                $cleanColony = Str::of($colonyName)->upper()->replace(' ', '_')->__toString();
                $existingDocs = PropertyScannedFile::where('old_property_id', $propertyId)->pluck('document_name')->all();
                $maxVol = 0;
                foreach ($existingDocs as $dn) {
                    if (preg_match('/_VOL_(\d+)/i', (string) $dn, $m)) {
                        $vol = (int) ($m[1] ?? 0);
                        if ($vol > $maxVol) $maxVol = $vol;
                    }
                }
                // -----------------------------------------------------------------------------

                foreach ($ListFileNames as $file) {
                    $fileName = $file['PropertyFileName'] ?? null;
                    if (!$fileName) {
                        Log::warning('filename not found');
                        continue;
                    };

                    if (PropertyScannedFile::where([
                        'property_master_id' => $masterProperty->id,
                        'splited_property_detail_id' => $splitedPropertyDetailId,
                        'flat_id' => $flatId,
                        'old_property_id' => $propertyId,
                        'colony_name' => $colonyName,
                        // use NEW document_name (no extension)
                        'old_property_file_name' => $fileName,
                    ])->whereNotNull('document_path')->exists()) {
                        $this->info('Document already exist new_document_name =>'. $fileName,
                           
                        );
                        continue;
                    }
                    


                    // ---- NEW: compute new document_name and file path (keep original extension) ----
                    $maxVol++; // next volume number
                    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION)) ?: 'pdf';
                    // controller/UI convention: document_name WITHOUT extension
                    $newDocName = "{$propertyId}_{$cleanColony}_VOL_{$maxVol}";
                    // stored file should include extension
                    $safeBaseName = $newDocName . '.' . $ext;

                    // log mapping old->new for debugging
                    Log::info('Renaming imported file', [
                        'old_name' => $fileName,
                        'new_document_name' => $newDocName,
                        'saved_filename' => $safeBaseName,
                    ]);
                    // ------------------------------------------------------------------------------

                    $matchArray = [
                        'property_master_id' => $masterProperty->id,
                        'splited_property_detail_id' => $splitedPropertyDetailId,
                        'flat_id' => $flatId,
                        'old_property_id' => $propertyId,
                        'colony_name' => $colonyName,
                        // use NEW document_name (no extension)
                        'document_name' => $newDocName,
                        'old_property_file_name' => $fileName,
                    ];
                    $updateArray = [
                        'document_path' => null,
                        'status' => 0,  
                    ];

                    

                    // $fileUrl = $fileUrlPath . $fileName;
                    $encodedFileName = rawurlencode($fileName);
                    $fileUrl = rtrim($fileUrlPath, '/') . '/' . $encodedFileName; // safe concatenation

                    Log::warning('fileUrl' . $fileUrl);
                    $fileResponse = Http::get($fileUrl);

                    if ($fileResponse->successful()) {
                        $fileContents = $fileResponse->body();
                        if (strlen($fileContents) < 25000) {
                            $this->warn('invalid file. skipping ' . $fileName);
                        } else {
                            // use NEW filename in the saved path
                            $newFilePath = "documents/{$colonyName}/{$propertyId}/scannedFiles/{$safeBaseName}";
                            Storage::disk('public')->put($newFilePath, $fileResponse->body());
                            $updateArray = [
                                // keep new document_name (no extension)
                                'document_name' => $newDocName,
                                'document_path' => $newFilePath,
                                // 'old_property_file_name' => $fileName,
                                // 'status' => 1
                            ];
                            $this->info("property - $propertyId document {$safeBaseName} imported (from {$fileName}).");
                        }
                    } else {
                        $this->warn("Failed to download file: $fileUrl");
                    }
                    PropertyScannedFile::updateOrCreate($matchArray, $updateArray);
                }
                $downloadedCount = PropertyScannedFile::where([
                    'property_master_id' => $masterProperty->id,
                    'splited_property_detail_id' => $splitedPropertyDetailId,
                    'flat_id' => $flatId,
                    'old_property_id' => $propertyId,
                    'colony_name' => $colonyName
                ])->whereNotNull('document_path')->count();
                //$this->info($downloadedCount->toSql() . '------' . implode(', ', $downloadedCount->getBindings()));
                $this->info('property Id = ' . $propertyId . 'downloadedCount = ' . $downloadedCount . ", total-count = " . count($ListFileNames));

                if ($downloadedCount >= count($ListFileNames)) {
                    PropertyScannedFile::where([
                        'property_master_id' => $masterProperty->id,
                        'splited_property_detail_id' => $splitedPropertyDetailId,
                        'flat_id' => $flatId,
                        'old_property_id' => $propertyId,
                        'colony_name' => $colonyName,
                    ])->whereNotNull('document_path')->update(['status' => 1]);
                }
            } else {
                Log::warning('no data for this property');
            }
        } else {
            Log::warning("API returned error for property {$propertyId}: " . $docResponse->status());
        }
    }


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $importedList = PropertyScannedFile::where('status', 1)->pluck('old_property_id')->toArray();
        $masterProperties = PropertyMaster::whereNull('is_joint_property')
            ->whereNotIn('old_propert_id', $importedList)
            ->get();
        Log::info('totalProps = ' . $masterProperties->count());
        $splitedProerties = SplitedPropertyDetail::whereNotIn('old_property_id', $importedList)->get();
        //$flats = Flat::whereNotIn('old_property_id', $importedList)->get();
        $this->info("masterProperties = ".$masterProperties->count(). " splitedProerties ".$splitedProerties->count());
        if (!$masterProperties->isEmpty()) {


            try {
                foreach ($masterProperties as $masterProperty) {
                    if (!$masterProperty->newColony) {
                        Log::warning("Skipping property ID {$masterProperty->id} due to missing colony.");
                        continue;
                    }
                    $propertyId = $masterProperty->old_propert_id;

                    $this->handlePropertyDocs($masterProperty, $propertyId);
                }
            } catch (\Exception $e) {
                Log::warning("Failed for property {$propertyId}: " . $e->getMessage());
            }
        } 
        if (!$splitedProerties->isEmpty()) {


            try {
                foreach ($splitedProerties as $sp) {

                    $propertyId = $sp->old_property_id;

                    $this->handlePropertyDocs($sp->master, $propertyId, $sp->id);
                }
            } catch (\Exception $e) {
                Log::warning("Failed for property {$propertyId}: " . $e->getMessage());
            }
        }
        /* if (!$flats->isEmpty()) {


            try {
                foreach ($flats as $flat) {

                    $propertyId = $flat->old_property_id;

                    $this->handlePropertyDocs($flat->master, $propertyId, null, $flat->id);
                }
            } catch (\Exception $e) {
                Log::error("Failed for property {$propertyId}: " . $e->getMessage());
            }
        } */
        $this->info('All available documents inported');
    }
}
