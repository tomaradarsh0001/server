<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyScannedRequest;
use Illuminate\Support\Facades\DB;

class PropertyScannedRequestController extends Controller
{
    public function index()
    {
        return view('property_scanning.request-index');
    }

    public function getScannedRequests(Request $request)
    {
        $columns = [
                    'unique_id', 'old_property_id', 'plot_or_flat', 'colony_name', 'file_no',
                    'property_status', 'status', 'reason', 'section'
                    ];


        $user = auth()->user();
        $userRole = $user->getRoleNames()->first();
        $sendToScanItemId = DB::table('items')->where('item_code', 'SEND_TO_SCAN')->value('id');

        $query = PropertyScannedRequest::with([
                        'flat',
                        'splitProperty',
                        'propertyMaster.propertyLeaseDetail',
                        'colony'
                    ])
                    ->join('property_masters', 'property_masters.id', '=', 'property_scanned_requests.property_master_id')
                    ->leftJoin('items as status_items', 'status_items.id', '=', 'property_scanned_requests.status')
                    ->leftJoin('applications', 'applications.id', '=', 'property_scanned_requests.application_id')
                    ->leftJoin('items as reason_items', 'reason_items.id', '=', 'applications.service_type')
                    ->select('property_scanned_requests.*',
                            'property_masters.section_code as section',
                            'property_masters.file_no',
                            'status_items.item_name as request_status_name',
                            'status_items.item_code as request_status_code',
                            'reason_items.item_name as reason'
                        );
         // Show only SEND_TO_SCAN for scan-admin
    if ($userRole === 'scan-admin' && $sendToScanItemId) {
        $query->where('property_scanned_requests.status', $sendToScanItemId);
    }

        // if (in_array($userRole, ['section-officer', 'deputy-lndo'])) {
        //     $sectionCodes = $user->sections->pluck('section_code');
        //     $query->whereIn('property_masters.section_code', $sectionCodes);
        // }

        if (!empty($request->input('search.value'))) {
            $search = $request->input('search.value');

            $query->leftJoin('property_lease_details', 'property_lease_details.property_master_id', '=', 'property_masters.id');

            $query->where(function ($q) use ($search) {
                $q->where('property_scanned_requests.unique_id', 'like', "%{$search}%")
                  ->orWhere('property_scanned_requests.old_property_id', 'like', "%{$search}%")
                  ->orWhere('property_scanned_requests.colony_id', 'like', "%{$search}%")
                  ->orWhere('property_masters.file_no', 'like', "%{$search}%")
                  ->orWhere('status_items.item_name', 'like', "%{$search}%")
                  ->orWhere('reason_items.item_name', 'like', "%{$search}%")
                  ->orWhere('property_masters.section_code', 'like', "%{$search}%");
            });
        }

        $totalQuery = clone $query;
        $totalData = DB::table(DB::raw("({$totalQuery->toSql()}) as sub"))
            ->mergeBindings($totalQuery->getQuery())
            ->count();

        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')] ?? 'property_scanned_requests.id';
        $dir = $request->input('order.0.dir', 'desc');

        $records = $query->offset($start)->limit($limit)->orderBy($order, $dir)->get();

        $data = [];

        foreach ($records as $latest) {
            $block = $plotOrFlat = $fileNo = $propertyStatus = $status = $reason = '-';

            if ($latest->flat) {
                $block = $latest->flat->block ?? '-';
                $plotOrFlat = $latest->flat->flat_number ?? $latest->flat->plot ?? '-';
                $fileNo = $latest->propertyMaster->file_no ?? '-';
                $propertyStatus = $latest->propertyMaster->status_name ?? '-';
            } elseif ($latest->splitProperty) {
                $master = $latest->propertyMaster;
                $block = $master?->block_no ?? '-';
                $plotOrFlat = $master?->plot_or_property_no ?? '-';
                $fileNo = $master?->file_no ?? '-';
                $propertyStatus = $master?->status_name ?? '-';
            } elseif ($latest->propertyMaster) {
                $master = $latest->propertyMaster;
                $block = $master->block_no ?? '-';
                $plotOrFlat = $master->plot_or_property_no ?? '-';
                $fileNo = $master->file_no ?? '-';
                $propertyStatus = $master->status_name ?? '-';
            }

            $status = $latest->request_status_name ?? '-';
            $reason = $latest->reason ?? '-';

            $blockPlotMerged = ($block !== '-' && $plotOrFlat !== '-') ? "{$block}/{$plotOrFlat}" : ($plotOrFlat !== '-' ? $plotOrFlat : '-');
            $section = $latest->propertyMaster?->section_code ?? '-';
            $colonyName = $latest->colony->name ?? '-';
            
            $hasScannedFiles = DB::table('property_scanned_files')
                                ->where('old_property_id', $latest->old_property_id)
                                ->exists();

            $data[] = [
                        'id' => $latest->id,
                        'unique_id' => $latest->unique_id,
                        'old_property_id' => $latest->old_property_id,
                        'plot_or_flat' => $blockPlotMerged,
                        'colony_name' => $colonyName,
                        'file_no' => $fileNo,
                        'property_status' => $propertyStatus,
                        'status' => $status, // item_name
                        'status_code' => $latest->request_status_code ?? null, // item_code
                        'reason' => $reason,
                        'section' => $section,
                        'has_scanned_files' => $hasScannedFiles,
                    ];

        }

        return response()->json([
            "draw" => intval($request->input('draw')),
            "recordsTotal" => $totalData,
            "recordsFiltered" => $totalData,
            "data" => $data,
        ]);
    }

    public function sendToScan(Request $request)
    {
        $request->validate(['id' => 'required|exists:property_scanned_requests,id']);

        // Fetch the item ID for 'SENT_TO_SCAN'
        $sentToScanItemId = DB::table('items')->where('item_code', 'SEND_TO_SCAN')->value('id');

        if (!$sentToScanItemId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Status missing in items table',
            ],404);

        }

        $record = PropertyScannedRequest::findOrFail($request->id);
        $record->status = $sentToScanItemId;
        $record->save();

        return response()->json([
            'status' => 'success',
            'message' => 'File sent to scan.',
        ]);

    }

    public function closeScan(Request $request)
    {
        $request->validate(['id' => 'required|exists:property_scanned_requests,id']);

        $closedItemId = DB::table('items')->where('item_code', 'SCAN_CLOSED')->value('id');

        if (!$closedItemId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Status missing in items table',
            ], 404);
        }

        $record = PropertyScannedRequest::findOrFail($request->id);
        $record->status = $closedItemId;
        $record->save();

        return response()->json([
            'status' => 'success',
            'message' => 'File status set to closed.',
        ]);
    }

    public function returnToRecord(Request $request)
    {
        $request->validate(['id' => 'required|exists:property_scanned_requests,id']);

        $returnToRecordId = DB::table('items')->where('item_code', 'RETURNED_TO_RECORD')->value('id');

        if (!$returnToRecordId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Status RETURNED_TO_RECORD missing in items table',
            ], 404);
        }

        $record = PropertyScannedRequest::findOrFail($request->id);

        $record->status = $returnToRecordId;
        $record->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Request returned to record successfully.',
        ]);
    }

    public function deleteRequest(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:property_scanned_requests,id',
        ]);

        // If you didn't protect the route with middleware, keep this guard:
        if (auth()->user()->getRoleNames()->first() !== 'super-admin') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        $record = PropertyScannedRequest::findOrFail($request->id);
        $record->delete(); // soft delete -> sets deleted_at, your model flips is_active=0

        return response()->json([
            'status'  => 'success',
            'message' => 'Request deleted successfully.',
        ]);
    }


}
