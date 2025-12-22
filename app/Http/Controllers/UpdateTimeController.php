<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;


class UpdateTimeController extends Controller
{
    public function latestUpdate()
    {
        $latestTimestamp = TimestampService::getLatestTimestamp();
    
        return response()->json([
            'latest_update' => $latestTimestamp
        ]);
    }
}
class TimestampService
{
    public static function getLatestTimestamp()
{
    $tables = [
        'categories', 'components', 'component_sections', 'directories', 'eso_courts', 
        'menus', 'news', 'office_docs', 'page', 'pages', 'page_section', 'roles', 'sections'
    ];

    $latestTimestamp = null;

    foreach ($tables as $table) {
        $timestamp = DB::table($table)
            ->selectRaw("GREATEST(
                COALESCE(MAX(created_at), '0000-00-00 00:00:00'),
                COALESCE(MAX(updated_at), '0000-00-00 00:00:00')
            ) as latest_timestamp")
            ->value('latest_timestamp');

        if ($timestamp && ($latestTimestamp === null || $timestamp > $latestTimestamp)) {
            $latestTimestamp = $timestamp;
        }
    }

    if ($latestTimestamp) {
        return Carbon::parse($latestTimestamp)
            ->setTimezone('Asia/Kolkata') 
            ->format('h:i A l d M, Y'); 
    }

    return "No records found";
}

}
