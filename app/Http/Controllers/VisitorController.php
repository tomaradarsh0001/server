<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserIp;
use Carbon\Carbon;

class VisitorController extends Controller
{
    public function store(Request $request)
    {
        // Retrieve the IP from the header or fallback to the request's client IP
        $ipAddress = $request->header('X-Visitor-IP') ?? $request->ip();
    
        // Log the incoming IP for debugging
        \Log::info("Received IP Address: " . $ipAddress);
    
        // Validate the IP address
        if ($ipAddress && filter_var($ipAddress, FILTER_VALIDATE_IP)) {
            
            UserIp::create([
                'ip_address' => $ipAddress,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    
            return response()->json(['message' => 'Visitor IP logged successfully.'], 200);
        }
    
        return response()->json(['message' => 'Invalid IP address.'], 400);
    }

    // Function to fetch visitor count
    public function getVisitorCount()
    {
        $visitorCount = UserIp::count('ip_address');

        return response()->json([
            'message' => 'Visitor count fetched successfully.',
            'visitor_count' => $visitorCount,
        ], 200);
    }

}

