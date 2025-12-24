<?php

namespace App\Services;
use Illuminate\Support\Facades\DB;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Http;
use App\Models\Configuration;
use App\Models\Template;
use App\Models\Application;
use Illuminate\Support\Facades\Log;
use App\Mail\CommonMail;
use App\Models\CommunicationTracking;
use App\Events\MailSentSuccess;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CommunicationService
{
    protected $variables = [];

    public function __construct()
    {
    }

    //to send whatsapp message
    public function sendWhatsAppMessage($data,$number,$action,$communicationTrackingId = null, $countryCode = null)
    {
        $sameConfiguration = Configuration::where('type', 'whatsapp')
        ->where('action', $action)
        ->where('status', 1)
        ->first();
        if($sameConfiguration){
            $configuration = $sameConfiguration;
        } else {
            $defaultConfiguration = Configuration::where('type', 'whatsapp')->where('action','DEFAULT' )->where('status', 1)->first();
            $configuration = $defaultConfiguration;
        }
        if ($configuration) {
            $data = $this->getTemplate($data,'whatsapp',$action);
            $message = $data['message'];
            $templateId = $data['template_id'];
            
            //added to store the message for tracking - SOURAV CHAUHAN (27/March/2025)
            if (!is_null($communicationTrackingId)) {
                $communicationTracking = CommunicationTracking::where('id',$communicationTrackingId)->first();
                $communicationTracking->message = $message;
                $communicationTracking->save();
            }

            $key = $configuration->key;
            $token = $configuration->auth_token;
            $whatsAppFrom = $configuration->whatsapp_number;
            $baseUrl = $configuration->api;
            $vendor = $configuration->vendor;
            switch ($vendor) {
                case 'Twilio':
                    $response = Http::withBasicAuth($key, $token)
                    ->asForm()
                    ->post($baseUrl, [
                        'To' => "whatsapp:+91{$number}",
                        // 'To' => "whatsapp:+{$countryCode}{$number}",
                        'From' => $whatsAppFrom,
                        'Body' => $message,
                    ]);
                    break;
                    
                    case 'Nexmo':
                    $response = Http::withBasicAuth($key, $token)
                                ->withHeaders([
                                    'Accept' => 'application/json',
                                ])
                                ->post($baseUrl, [
                                    'from' => $whatsAppFrom,
                                    'to' => "91{$number}",
                                    // 'to' => "{$countryCode}{$number}",
                                    'message_type' => 'text',
                                    'text' => $message,
                                    'channel' => 'whatsapp',
                                ]);
                    break;
            
                default:
                    // Handle unsupported vendor or throw an exception
                    throw new \Exception("Unsupported vendor: {$vendor}");
            }

            if ($response->successful()) {
                return true;
            } elseif ($response->failed()) {
                return false;
            } else {
                return false;
            }
        }
    }

    //to send text sms
    public function sendSmsMessage($data,$number,$action, $communicationTrackingId = null,$countryCode = null)
    {
        $sameConfiguration = Configuration::where('type', 'sms')
        ->where('action', $action)
        ->where('status', 1)
        ->first();
        if($sameConfiguration){
            $configuration = $sameConfiguration;
        } else {
            $defaultConfiguration = Configuration::where('type', 'sms')->where('action','DEFAULT' )->where('status', 1)->first();
            $configuration = $defaultConfiguration;
        }
        if ($configuration) {
            $data = $this->getTemplate($data,'sms',$action);
            $message = $data['message'];
            $templateId = $data['template_id'];

            //added to store the message for tracking - SOURAV CHAUHAN (27/March/2025)
            if (!is_null($communicationTrackingId)) {
                $communicationTracking = CommunicationTracking::where('id',$communicationTrackingId)->first();
                $communicationTracking->message = $message;
                $communicationTracking->save();
            }

            $key = $configuration->key;
            $token = $configuration->auth_token;
            $smsFrom = $configuration->sms_number;
            $baseUrl = $configuration->api;
            $vendor = $configuration->vendor;


            switch ($vendor) {
                case 'Twilio':
                    $response = Http::withBasicAuth($key, $token)
                        ->asForm()
                        ->post($baseUrl, [
                            'To' => "+91{$number}",
                            // 'To'   => "+{$countryCode}{$number}", // Clean string interpolation
                            'From' => $smsFrom,
                            'Body' => $message,
                        ]);
                    break;
            
                case 'Nexmo':
                    $response = Http::post($baseUrl, [
                        'to' => "+91{$number}",
                        // 'to' => "+{$countryCode}{$number}",
                        'from' => 'EDHARTI',
                        'text' => $message,
                        'api_key' => $key,
                        'api_secret' => $token
                    ]);
                    break;

                case 'AirtelDLT':
                    $response = Http::asForm()->post($baseUrl, [
                        'username'         => $key,
                        'pin'              => $token,
                        'message'          => $message,
                        'mnumber'          => $number,
                        'signature'        => 'LDODPT',
                        'dlt_entity_id'    => $smsFrom,
                        'dlt_template_id'  => $templateId,
                    ]);
                    break;
            
                default:
                    // Handle unsupported vendor or throw an exception
                    throw new \Exception("Unsupported vendor: {$vendor}");
                }
                if ($response->successful()) {
                Log::info("sms service response ".$response);
                return true;
            } elseif ($response->failed()) {
                Log::info("sms service response ".$response);
                return false;
            } else {
                Log::info("sms service response ".$response);
                return false;
            }
        }
    }

    public function getTemplate($data,$type,$action)
    {
        $template = Template::where('action', $action)
                        ->where('type', $type)
                        ->where('status', 1)
                        ->first();
        $smsData = [];               

        $smsData['message'] = $this->createTemplate($template['template'],$data);
        $smsData['template_id'] = $template['template_id'];
        return $smsData;
    }


    // public function createTemplate($template,$data)
    // {
    //     foreach ($data as $key => $value) {
    //         $template = str_replace("{{$key}}", $value, $template);
    //     }
    //     return $template;
    // }

    // For replacing the string with @[] in email tempates - SOURAV CHAUHAN (30/Dec/2024)
    public function createTemplate($template, $data)
    {
        foreach ($data as $key => $value) {
            $template = str_replace("@[{$key}]", $value, $template);
        }
        return $template;
    }

    //For sending email with communication tracking
    public function sendMailWithTracking($action,$data,$user,$type){
        $template = Template::where('type', $type)->where('action', $action)->where('status', 1)->first();
        if(isset($data['application_no'])){
            $communicationTracking = CommunicationTracking::updateOrCreate(
                ['application_no' => $data['application_no'], 'email_subject' => $template->subject],
                [
                    'communication_for' => 'application',
                    'communication_type' => $type,
                    'send_by_user' => Auth::id(),
                    'send_to_user' => $user['id'],
                    'sent_at' => Carbon::now(),
                    'message' => '',
                    'email' => $user['email'],
                ]
            );
            $communicationTrackingId = $communicationTracking->id;
        } else {
            $communicationTrackingId = null;
        }

        /** code modified with error handling -  code modified by Nitin 09Dec2924 */
        try {
            if($action == "APP_APR"){
                $application = Application::where('application_no', $data['application_no'])->first();
                $signedLetter = storage_path('app/public/' . $application->Signed_letter);
                $mail = new CommonMail($data, $action,$communicationTrackingId);
                $mail->attach($signedLetter, [
                    'as' => 'SignedLetter.pdf',
                    'mime' => 'application/pdf',
                ]);
                Mail::to($user['email'])->send($mail);
            } else {
                Mail::to($user['email'])->send(new CommonMail($data, $action,$communicationTrackingId));
            }
            event(new MailSentSuccess(
                    $communicationTrackingId,
                    true,                             
                    'Email sent successfully!'
                ));
            $mailSent = true;
        }  catch (\Exception $e) {
            event(new MailSentSuccess(
                $communicationTrackingId,
                false,                             
                'Email sent successfully!'
            ));
            Log::error("Failed to send email to {$user['email']}: " . $e->getMessage());
            $mailSent = false;
        }

        if($action != "OTP_VALID"){
            $mobileNo = $user['mobile_no'];
            $checkSmsTemplateExists = checkTemplateExists('sms', $action);
            // dd($checkSmsTemplateExists);
            $communicationService = new CommunicationService;
            if (!empty($checkSmsTemplateExists)) {
                $communicationTracking = CommunicationTracking::create(
                    [
                        'application_no' => isset($data['application_no'])?$data['application_no']:null,
                        'communication_for' => 'application',
                        'communication_type' => 'sms',
                        'send_by_user' => Auth::id(),
                        'send_to_user' => $user['id'],
                        'sent_at' => Carbon::now(),
                        'mobile' => $user['mobile_no'],
                    ]
                );
                $communicationTrackingId = $communicationTracking->id;
                $response = $communicationService->sendSmsMessage($data, $mobileNo, $action,$communicationTrackingId);
                if($response){
                    $communicationTracking->status = 1;
                    $communicationTracking->save();
                } else {
                    $communicationTracking->status = 0;
                    $communicationTracking->save();
                    Log::info($response);
                }
            }
            $checkWhatsappTemplateExists = checkTemplateExists('whatsapp', $action);
            if (!empty($checkWhatsappTemplateExists)) {
                $communicationTracking = CommunicationTracking::create(
                    [
                        'application_no' => isset($data['application_no'])?$data['application_no']:null,
                        'communication_for' => 'application',
                        'communication_type' => 'whatsapp',
                        'send_by_user' => Auth::id(),
                        'send_to_user' => $user['id'],
                        'sent_at' => Carbon::now(),
                        'mobile' => $user['mobile_no'],
                    ]
                );
                $communicationTrackingId = $communicationTracking->id;
                $response = $communicationService->sendWhatsAppMessage($data, $mobileNo, $action,$communicationTrackingId);
                if($response){
                    $communicationTracking->status = 1;
                    $communicationTracking->save();
                } else {
                    $communicationTracking->status = 0;
                    $communicationTracking->save();
                    Log::info($response);
                }
            }
        }
    }

    /**
     * Multibyte-safe trim for SMS, appends "..." only if needed.
     */
    private function smsTrim(?string $value, int $limit = 30): string
    {
        $value = trim((string) $value);
        if (function_exists('mb_strlen') && function_exists('mb_substr')) {
            return mb_strlen($value) <= $limit
                ? $value
                : rtrim(mb_substr($value, 0, $limit)) . '...';
        }
        return strlen($value) <= $limit
            ? $value
            : rtrim(substr($value, 0, $limit)) . '...';
    }

    /**
     * Only for SMS payloads: trim selected keys (e.g., remarks/reason/links).
     * Extend the list if you need more keys in the future.
     */
    private function shrinkForSms(array $data, array $keys = ['reason','remarks', 'reasons', 'remark']): array
    {
        foreach ($keys as $k) {
            if (array_key_exists($k, $data) && is_string($data[$k])) {
                $data[$k] = $this->smsTrim($data[$k], 30);
            }
        }
        return $data;
    }

}
