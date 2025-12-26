<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Item;
use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;

class DeactivateUsersWithInactiveApplications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $currentDate = Carbon::now();
        $statusIds = Item::whereIn('item_code', ['APP_APR', 'APP_REJ'])->pluck('id')->toArray();
        $applications = Application::whereIn('status', $statusIds)->get();
        $maxInactiveDays = config('constants.MAX_INACTIVE_DAYS_AFTER_APPLICATION_DISPOSED');

        foreach ($applications as $application) {
            $daysSinceUpdate = $application->updated_at->diffInDays($currentDate);
            if ($daysSinceUpdate > $maxInactiveDays) {
                $user = User::find($application->created_by);

                if ($user) {
                    $hasActiveApplications = Application::where('created_by', $user->id)
                        ->whereNotIn('status', $statusIds)
                        ->exists();

                    // if (!$hasActiveApplications) {
                    //     DB::beginTransaction();
                    //     try {
                    //         $user->status = 0;
                    //         $user->save();
                    //         $user->userProperties()->delete();

                    //         if ($user->delete()) {
                    //             Log::info("User ({$user->id}) deactivated (application inactive 15+ days).");
                    //             DB::commit();
                    //         } else {
                    //             Log::warning("User ({$user->id}) soft deletion failed.");
                    //             DB::rollBack();
                    //         }
                    //     } catch (\Exception $e) {
                    //         DB::rollBack();
                    //         Log::error("Failed deactivating user ({$user->id}): " . $e->getMessage());
                    //     }
                    // }

                    if (!$hasActiveApplications) {
                        // Get user's properties
                        $userProperties = $user->userProperties;

                        // Get the 'DEM_PENDING' item ID
                        $pendingDemandStatusIds = Item::whereIn('item_code', ['DEM_PENDING', 'DEM_DRAFT'])->pluck('id')->toArray();

                        // Check if any property has a pending demand
                        $hasPendingDemand = false;

                        foreach ($userProperties as $property) {
                            $demandExists = \App\Models\Demand::where('property_master_id', $property->new_property_id)
                                ->where('status', $pendingDemandStatusIds)
                                ->exists();

                            if ($demandExists) {
                                $hasPendingDemand = true;
                                break;
                            }
                        }

                        // Skip user deactivation if pending demand exists
                        if ($hasPendingDemand) {
                            continue;
                        }

                        // Proceed with deactivation
                        DB::beginTransaction();
                        try {
                            $user->status = 0;
                            $user->save();
                            $user->userProperties()->delete();

                            if ($user->delete()) {
                                Log::info("User ({$user->id}) deactivated (application inactive 15+ days, no pending demands).");
                                DB::commit();
                            } else {
                                Log::warning("User ({$user->id}) soft deletion failed.");
                                DB::rollBack();
                            }
                        } catch (\Exception $e) {
                            DB::rollBack();
                            Log::error("Failed deactivating user ({$user->id}): " . $e->getMessage());
                        }
                    }
                }
            }
        }
    }
}
