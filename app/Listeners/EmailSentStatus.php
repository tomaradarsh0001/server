<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Mail\Events\MessageSent;
use App\Events\MailSentSuccess;

class EmailSentStatus
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
    public function handle(object $event): void
    {
        if ($event->message->getStatus() === 'sent') {
            event(new MailSentSuccess($event->message, true, 'Email sent successfully!'));
        } else {
            event(new MailSentSuccess($event->message, false, 'Failed to send email!'));
        }
    }
}
