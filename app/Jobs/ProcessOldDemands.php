<?php

namespace App\Jobs;

use App\Models\PropertyMaster;
use App\Models\SplitedPropertyDetail;
use App\Models\OldDemand;
use App\Models\OldDemandSubhead;
use App\Services\PropertyMasterService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Exception;

class ProcessOldDemands implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $oldPropertyId;
    protected $propertyStatus;
    protected $propertyType;
    protected $propertyId;

    public function __construct($oldPropertyId,$propertyStatus,$propertyType,$propertyId)
    {
        $this->oldPropertyId = $oldPropertyId;
        $this->propertyStatus = $propertyStatus;
        $this->propertyType = $propertyType;
        $this->propertyId = $propertyId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
        $storeDemand = true;
        //delete old demand if available
        $previousSavedDemands = OldDemand::where('property_id',  $this->oldPropertyId)->get();
        if ($previousSavedDemands->isNotEmpty()) {
            foreach ($previousSavedDemands as $psd) {
                $isNewDemandAvailabe = $psd->new_demand_id;
                if($isNewDemandAvailabe == null){
                    OldDemandSubhead::where('DemandID', $psd->demand_id)->delete();
                } else {
                    $storeDemand = false;
                }
            }
            OldDemand::where('property_id',  $this->oldPropertyId)->whereNull('new_demand_id')->delete();
        }


        if($storeDemand){
            $pms = new PropertyMasterService();
            $oldDemandData = $pms->getPreviousDemands( $this->oldPropertyId);
            if($oldDemandData){
                $demands = $oldDemandData->LatestDemanddetails;
                foreach ($demands as $demand) {
                    $paidAmount = $demand->Amount - $demand->Outstanding;
                    $demandData = collect($demand)->merge([
                        'PaidAmount' => $paidAmount,
                        'PropertyStatus' =>  $this->propertyStatus
                        ])->only([
                        'PropertyID',
                        'DemandID',
                        'Amount',
                        'PaidAmount',
                        'Outstanding',
                        'DemandDate',
                        'PropertyStatus',
                    ])->mapWithKeys(function ($value, $key) {
                        return [
                            match ($key) {
                                'DemandID' => 'demand_id',
                                'PropertyID' => 'property_id',
                                'Amount' => 'amount',
                                'PaidAmount' => 'paid_amount',
                                'Outstanding' => 'outstanding',
                                'DemandDate' => 'demand_date',
                                'PropertyStatus' => 'property_status',
                                default => $key
                            } => $value
                        ];
                    })->toArray();
                    OldDemand::create($demandData);
                }
                $demandSubheads = $oldDemandData->SubHeadwiseBreakup;
                foreach ($demandSubheads as $oldSubhead) {
                    $oldSubheadData = collect($oldSubhead)->all();
                    OldDemandSubhead::create($oldSubheadData);
                }
                Log::info($this->propertyType ." ID:- " .  $this->propertyId. " Updated");
            }   
        } else {
            Log::Info($this->propertyType ." ID:- " .  $this->propertyId. " Not Updated as New Demand Available.");
        }
    } catch (Exception $e) {
        Log::error($this->propertyType ." ID:- ".  $this->propertyId." Not updated" , [
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ]);
        throw $e;
    }
        
    }
}
