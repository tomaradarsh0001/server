<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Template;
use App\Models\CommunicationTracking;
use App\Models\Application;
use App\Models\User;
use App\Services\CommunicationService;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RetryUntil;
use Carbon\Carbon;
use Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailables\Attachment;




class CommonMail extends Mailable implements ShouldQueue
{
    public $data;
    public $action;
    public $communicationTrackingId;
    public $communicationService;
    public $mailData;
    public $subject;
    use Queueable, SerializesModels;
    use Dispatchable, InteractsWithQueue;

    /**
     * Create a new message instance.
     */
    public function __construct($data, $action,$communicationTrackingId = null)
    {
        $this->data = $data;
        $this->action = $action;
        $this->communicationTrackingId = $communicationTrackingId;
        $this->communicationService = new CommunicationService();
       
        $template = Template::where('type', 'email')->where('action', $action)->where('status', 1)->first();

        if (!$template) { //when template is not available-  Added by Nitin 09Dec2024
            throw new \Exception("Email template for action '{$action}' not found.");
        }
        $this->mailData = $this->communicationService->createTemplate($template->template, $data);
        $this->subject = $template->subject;

        if(isset($data['application_no'])){
            $userId = Application::where('application_no',$data['application_no'])->first()->created_by;
            $user = User::where('id',$userId)->first();
        }

        if(!is_null($communicationTrackingId)){
            $communicationTracking = CommunicationTracking::where('id',$this->communicationTrackingId)->first();
            $communicationTracking->message = $this->mailData;
            $communicationTracking->save();
        }
    }



    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.common_mail',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    // public function attachments(): array
    // {
    //     return [];
    // }

    //Modified by Swati Mishra on 23-04-2025 for sending attachments as notificationData in emails
    public function attachments(): array
    {
        $attachments = [];

        if (!empty($this->data['attachment']) && file_exists($this->data['attachment'])) {
            $attachments[] = Attachment::fromPath($this->data['attachment']);
        }

        return $attachments;
    }

     // This method can be called upon successful completion
    //  public function markAsSuccessful()
    //  {
    //      Log::info('Mail job succeeded for communication tracking ID: ' . $this->communicationTrackingId);
 
    //      $communicationTracking = CommunicationTracking::where('id', $this->communicationTrackingId)->first();
    //      if ($communicationTracking) {
    //          $communicationTracking->status = 1;
    //          $communicationTracking->save();
    //      }
    //  }


    // This method is called when the job fails
    public function failed(\Exception $exception)
    {
        // Log the error message
        Log::error('Mail job failed: ' . $exception->getMessage());

        // Update the CommunicationTracking record
        if(!is_null($this->communicationTrackingId)){
            $communicationTracking = CommunicationTracking::where('id', $this->communicationTrackingId)->first();
            if ($communicationTracking) {
                $communicationTracking->status = 0; // or any other status you want to set
                $communicationTracking->save();
            }
        }
    }


}
