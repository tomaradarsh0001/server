<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;

class DeactivateInactiveRegisteredApplicants implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $users = User::where('user_type', 'applicant')->get();
        $currentDate = Carbon::now();
        $maxInactiveDays = config('constants.MAX_INACTIVE_DAYS_FOR_REGISTERED_USER');

        foreach ($users as $user) {
            $daysSinceCreation = $user->created_at->diffInDays($currentDate);

            if (!$user->applications()->exists() && $daysSinceCreation > $maxInactiveDays) {
                DB::beginTransaction();
                try {
                    $user->status = 0;
                    $user->save();
                    $user->userProperties()->delete();

                    if ($user->delete()) {
                        Log::info("User ({$user->id}) deactivated (no applications & inactive).");
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