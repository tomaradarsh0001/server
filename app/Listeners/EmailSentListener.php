<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
// use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use App\Events\MailSentSuccess;
use App\Models\CommunicationTracking;

class EmailSentListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MailSentSuccess $event): void
    {
        $communicationTrackingId = $event->communicationTrackingId;
        $status = $event->status;
        $message = $event->message;
        if(!is_null($communicationTrackingId)){
            $CommunicationTracking = CommunicationTracking::find($communicationTrackingId);
            if($status){
                $CommunicationTracking->status = 1;
            } else {
                $CommunicationTracking->status = 0;
                Log::info(("inside Listner................."));
                Log::info(json_encode($event));
            }
            $CommunicationTracking->save();
        }
    }
}
