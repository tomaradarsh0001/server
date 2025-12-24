<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MailSentSuccess
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $communicationTrackingId;
    public $status;
    public $message; 

    /**
     * Create a new event instance.
     */
    public function __construct($communicationTrackingId, $status, $message)
    {
        $this->communicationTrackingId = $communicationTrackingId;
        $this->status = $status;
        $this->message = $message;
        Log::info($this->communicationTrackingId);
        
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
