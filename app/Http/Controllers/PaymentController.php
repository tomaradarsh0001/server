<?php

namespace App\Http\Controllers;

use App\Helpers\GeneralFunctions;
use App\Models\ApplicationCharge;
use App\Models\Country;
use App\Models\Demand;
use App\Models\Payment;
use App\Models\PropertyMaster;
use App\Models\User;
use App\Services\PaymentService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function paymentResponse(Request $request)
    {
        // $returned = $request->BharatkoshResponse;
        $returned = 'PD94bWwgdmVyc2lvbj0iMS4wIj8+PHBheW1lbnRTZXJ2aWNlIHZlcnNpb249IjEuMCIgbWVyY2hhbnRDb2RlPSJNRVJDSEFOVCI+PHJlcGx5PjxvcmRlclN0YXR1cyBvcmRlckNvZGU9IlBBQzIwMjUwNzMxMTcxMDE1IiBzdGF0dXM9IlBFTkRJTkciPjxyZWZlcmVuY2UgaWQ9IjMxMDcyNTAwNDU2MTYiIEJhbmtUcmFuc2Fjc3Rpb25EYXRlPSIwNy8zMS8yMDI1IDE3OjExOjA1IiBUb3RhbEFtb3VudD0iMSI+PC9yZWZlcmVuY2U+PC9vcmRlclN0YXR1cz48L3JlcGx5PjxTaWduYXR1cmUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxTaWduZWRJbmZvPjxDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMteG1sLWMxNG4tMjAwMTAzMTUiIC8+PFNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIgLz48UmVmZXJlbmNlIFVSST0iIj48VHJhbnNmb3Jtcz48VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiIC8+PC9UcmFuc2Zvcm1zPjxEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIgLz48RGlnZXN0VmFsdWU+cGtGSDBYM1ZrQ1ZWZnpDUHNBK0I3VFZOTWQ4PTwvRGlnZXN0VmFsdWU+PC9SZWZlcmVuY2U+PC9TaWduZWRJbmZvPjxTaWduYXR1cmVWYWx1ZT5EeXVzdzhuL3JKU1M0ZzZjSVNGN3dQZTZEWlNMcmtzOVNERkF4OU1TemFXVXVuNmx0VGl4RzFBQUlRalZETTJaUS92R083cmtOSk43Vm13TG1tNVpHUGZyRmVKYzBwWkdaS3VQQ2VVeDRYTWRuc0FBTUtxTTdYUXR2UWZGaWZDQW5QZld2SXk0NjZTRGt1S1lNVUdXRDFPcmw2ajhlSEg1NmFwTVdEdE50RTFHaDFjd3hMTWJNZ2o4ODNyZ0daYVdZQTdMTldqOFJtemkzVUZhU2NqWkxQc1BRMi9GR2FmZUNDYzJGTUwxRTA4allvUGw0L0x4MnEreUVvT2t3V2hjQkhPaXN5NWE0UFVZcWlCVjNmR3NyNmZVT2FraWZYcjA0cXNnRGFzbjY1N0NtM0R2VHFmTFZrQUhiVzgvMmFHTGZjSFY3OE5ZR0lRaEpsRFIvVG8xQ2c9PTwvU2lnbmF0dXJlVmFsdWU+PEtleUluZm8+PFg1MDlEYXRhPjxYNTA5SXNzdWVyU2VyaWFsPjxYNTA5SXNzdWVyTmFtZT5DTj1HZW9UcnVzdCBUTFMgUlNBIENBIEcxLCBPVT13d3cuZGlnaWNlcnQuY29tLCBPPURpZ2lDZXJ0IEluYywgQz1VUzwvWDUwOUlzc3Vlck5hbWU+PFg1MDlTZXJpYWxOdW1iZXI+MTk3NjE1NjQwMDQ1MDUyNjMxMDg3MTA0NjI5MTIzOTc4MDM3NzA8L1g1MDlTZXJpYWxOdW1iZXI+PC9YNTA5SXNzdWVyU2VyaWFsPjxYNTA5Q2VydGlmaWNhdGU+TUlJR2hqQ0NCVzZnQXdJQkFnSVFEdDN3VkU2TWhxM0FENFVJdlIrQStqQU5CZ2txaGtpRzl3MEJBUXNGQURCZ01Rc3dDUVlEVlFRR0V3SlZVekVWTUJNR0ExVUVDaE1NUkdsbmFVTmxjblFnU1c1ak1Sa3dGd1lEVlFRTEV4QjNkM2N1WkdsbmFXTmxjblF1WTI5dE1SOHdIUVlEVlFRREV4WkhaVzlVY25WemRDQlVURk1nVWxOQklFTkJJRWN4TUI0WERUSTFNRFl3TkRBd01EQXdNRm9YRFRJMk1EWXpNREl6TlRrMU9Wb3dkREVMTUFrR0ExVUVCaE1DU1U0eERqQU1CZ05WQkFnVEJVUmxiR2hwTVJJd0VBWURWUVFIRXdsT1pYY2dSR1ZzYUdreEt6QXBCZ05WQkFvVElsQjFZbXhwWXlCR2FXNWhibU5wWVd3Z1RXRnVZV2RsYldWdWRDQlRlWE4wWlcweEZEQVNCZ05WQkFNVEMzQm1iWE11Ym1sakxtbHVNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTRPamFnWjRCc1ZjejdKTGxLd1poc2cwSE9aTVdZVk56R0pFRmQ1ZUdlU3lKVzQ0L0NYbU13TkUrWjJvbXlYc0RvYlVkeS9KZWZCQVFFLzhqQWFSQVBuL3BlMjBOTHZHemNkNWFodUQzaVlZVjc2OGZHQmk5Z21MY09vQmxGZGNSSk1qUlM5RTYxQUx1MzliUGJZdDh4WVdyc2JqNGJnVTVPWTlHdzRxR25jams3TGxKWGF5bEpsK2ZJMnFtMWJ0dFg0VzZYTTA5b3d6RFM5ZVNnQlh3YXlQL2ZLY1djMEJhR3ZoR2IxRVpVajRieWJGcWZmWWEyM0hQR2VWNnNYNnRjMzNyQnUxY1lxZVRnQTgyYWU3WUNKMzlYWW9FSldwendZLzBVQzZmajF5TVhuUXBnc2J3UFZrR2N6R1g1Y0hMcTNyVGFJTlVEZnBud0RWSk9BdnBlUUlEQVFBQm80SURKakNDQXlJd0h3WURWUjBqQkJnd0ZvQVVsRS9VWFl2a3BPS21nUDc5MlBrQTc2TytBbGN3SFFZRFZSME9CQllFRkRuYUh4RFpPVHlGSlpxV2FGQ1BzYkV2VG80Yk1DY0dBMVVkRVFRZ01CNkNDM0JtYlhNdWJtbGpMbWx1Z2c5M2QzY3VjR1p0Y3k1dWFXTXVhVzR3UGdZRFZSMGdCRGN3TlRBekJnWm5nUXdCQWdJd0tUQW5CZ2dyQmdFRkJRY0NBUlliYUhSMGNEb3ZMM2QzZHk1a2FXZHBZMlZ5ZEM1amIyMHZRMUJUTUE0R0ExVWREd0VCL3dRRUF3SUZvREFkQmdOVkhTVUVGakFVQmdnckJnRUZCUWNEQVFZSUt3WUJCUVVIQXdJd1B3WURWUjBmQkRnd05qQTBvREtnTUlZdWFIUjBjRG92TDJOa2NDNW5aVzkwY25WemRDNWpiMjB2UjJWdlZISjFjM1JVVEZOU1UwRkRRVWN4TG1OeWJEQjJCZ2dyQmdFRkJRY0JBUVJxTUdnd0pnWUlLd1lCQlFVSE1BR0dHbWgwZEhBNkx5OXpkR0YwZFhNdVoyVnZkSEoxYzNRdVkyOXRNRDRHQ0NzR0FRVUZCekFDaGpKb2RIUndPaTh2WTJGalpYSjBjeTVuWlc5MGNuVnpkQzVqYjIwdlIyVnZWSEoxYzNSVVRGTlNVMEZEUVVjeExtTnlkREFNQmdOVkhSTUJBZjhFQWpBQU1JSUJmd1lLS3dZQkJBSFdlUUlFQWdTQ0FXOEVnZ0ZyQVdrQWR3QU9WNVM4ODY2cFBqTWJMSmtIcy9lUTM1dkNQWEV5SmQwaHFTV3NZY1ZPSVFBQUFaYzZxUTBMQUFBRUF3QklNRVlDSVFDaUdRVHZoWjNWQnI4dVU3NjlLS1lsNzFFV0pwcDRVRWJYRFFqYlhsSytNUUloQU1NMWxTM0VrbWM5eUZJOFI5MTE3RlVGVlkxNUJ0VjJWa3hUb0VWRlBlSXpBSFlBWkJIRWJLUVM3S2VKSEtJQ0xnQzhxMDhvQjlRZU5TZXI2djdWQThsOXpmQUFBQUdYT3FrTlNBQUFCQU1BUnpCRkFpRUF5MzlnMm1tdCszbW9kd3NqZm5tQm5Vc1VaM0cvdDFreG95QW1seFIxZEhFQ0lBcnNuL1cyVGVLem5MVlVyc244dlBoNFR4MjFoMXkyOS83Q2Q0aTdKZlFCQUhZQVNaeWJhZDRkZk96OE50N05oMlNtdUZ1dkNvZUFHZEZWVXZ2cDZ5bmQrTU1BQUFHWE9xa05Zd0FBQkFNQVJ6QkZBaUJKVURtemFUN1VqWHZNRHRzV0VyaTJnelVjNmRmRTl2Qks3TnNLWS8zcU5nSWhBTDRnRk9sRU5kRGZ3MWczTWZiSmxCajFQanBIM0UwblBJOHdVYytZbzhNcU1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQWZCY1krSXJiSjhmdC9MMkF5VE1na21ETFRKa0RYYis3WTFIMU56N0NnQmhQbVo4cXFDVTg3aExvTURFbTJiUWtpY2E2L3N1bTdkOGVDQTJWaWd3U05TZ29zcVcwRzJ4ZDVtYXVFMzYvMGx4UjV3THNxOWRCbGE5NFlPYlZTK29CaXlKMlhOQzZWcFN4OVI1UzNHWktMZFplOFZHWCtDcnZZdk1oRTd6YlhyTlFpeVZNNnpLaksxMlQ1MWFhejZLbEc3anBaT2hDaHFPWnd0S1V0MEVHc1VQQ3BGN0hKMzZqdHd4OVZKNGI1T3hHd1Rlc3Q4SnNZRWZsZWVWN3FmYitzUHdQSDBjbmNBNjYyVEJrMXUwWExwL0kxem5uWDlIWjFtQ2c4bGEzdjFGWlJWeW9XWDBTd0QxYXlrLzA1L3M1bTJoanNKeXBRQmFQWlpBMktLR0wzPC9YNTA5Q2VydGlmaWNhdGU+PC9YNTA5RGF0YT48L0tleUluZm8+PC9TaWduYXR1cmU+PC9wYXltZW50U2VydmljZT4=';
        $decoded = base64_decode($returned); //urldecode($returned)
        $xml = simplexml_load_string($decoded);
        // dd($xml);
        if ($xml === false) {
            //return redirect()->route('paymentStatusDisplay', 'Something went wrong. Invalid response from payment gateway');
            return view('payment.payment-response', ['status' => 'FAILURE', 'orderCode' => 'Something went wrong. Invalid response from payment gateway']);
        }
        $orderStatusData = $xml->reply->orderStatus;
        $orderCode = $orderStatusData['orderCode'];
        $orderStatus = $orderStatusData['status'];
        $orderRefId = $orderStatusData->reference['id'];

        $paymentRecord = Payment::where('unique_payment_id', $orderCode)->whereNull('response')->first();
        if (!empty($paymentRecord)) {
            if (!is_null($paymentRecord->created_by)) {
                $authUser = User::find($paymentRecord->created_by);
                if (!empty($authUser)) {
                    Auth::login($authUser);
                }
            }

            $paymentRecord->update([
                'status' => getServiceType('PAY_' . $orderStatus),
                'response' => $request->BharatkoshResponse,
                'transaction_id' => $orderRefId,
            ]);
        } else {

            return view('payment.payment-response', ['status' => 'FAILURE', 'orderCode' => 'Something went wrong. Payment data is not found']);
        }


        if ($orderStatus == "SUCCESS") {
            $payemntService = new PaymentService();
            $payemntService->processSuccessfulPayment($paymentRecord);
        }

        return view('payment.payment-response', ['status' => $orderStatus, 'orderCode' => $orderCode]);
        //return redirect()->route('paymentStatusDisplay', $data);
    }

    public function paymentInputForm()
    {
        $data['paymentTypes'] = getItemsByGroupId(17011);
        $data['guestUser'] = !(Auth::check()); // flag to indicate this page is for guest user
        return view('payment.input-form', $data);
    }

    public function getPaymentDetails(Request $request)
    {
        $paymentType = $request->paymentType;
        $inputName = $request->inputName;
        $inputValue = $request->inputValue;
        switch ($paymentType) {
            case 'PAY_DEMAND':
                if ($inputName != "demand_id") {
                    return response()->json(['status' => false, 'details' => 'Data not available for this input']);
                }
                $demandId = $inputValue;
                $demand = Demand::where('unique_id', $demandId)->whereIn('status', [getServiceType('DEM_PENDING'), getServiceType('DEM_PART_PAID')])->first();
                if (empty($demand)) {
                    return response()->json(['status' => false, 'details' => 'Demand ID does not exist']);
                }
                $countries = Country::all();
                $states = DB::table('states')->where('country_id', 101)->get();
                $view =  view('include.parts.demand-details', ['demand' => $demand, 'countries' => $countries, 'states' => $states])->render();
                return response()->json(['status' => true, 'html' => $view]);
                break;

            default:
                return response()->json(['status' => false, 'details' => 'Invalid payment type']);
                break;
        }
    }

    public function paymentStatusDisplay($data)
    {
        if (is_string($data)) {
            return view('payment.payment-response', ['status' => 'FAILURE', 'orderCode' => $data]);
        }
        $status = $data['orderStatus'];
        $orderCode = $data['orderCode'];
        return view('payment.payment-response', ['status' => "SUCCESS", 'orderCode' => $orderCode]);
    }

    public function checkUpdatedPaymentStatus($paymentId)
    {
        $payment = Payment::find($paymentId);
        $orderId = $payment->unique_payment_id;
        $purposeId = '23092';
        // $url = "http://164.100.129.32/bharatkosh/getstatus";
        $url = config('constants.paymentStatusURL');
        $data = array("OrderId" => $orderId, "PurposeId" => $purposeId);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if (curl_errno($ch)) {
            echo 'Curl error: ' . curl_error($ch);
        } else {
            $curl_output = trim(curl_exec($ch), '"');
            $apiResponse = explode('|', $curl_output);
            curl_close($ch);
            if (count($apiResponse) > 1) {
                list($orderId, $orderStatus, $transactionId) = $apiResponse;
                if (strtoupper($orderStatus) == "SUCCESS") {
                    $paymentData = Payment::where('unique_payment_id', $orderId)->first();
                    if (!empty($paymentData)) {
                        $paymentService = new PaymentService();
                        $paymentService->processSuccessfulPayment($paymentData);
                    }
                } else {
                }
            } else {
                dd($curl_output, $apiResponse);
                /* print_r($response_api);
                echo "</pre>"; */
            }
        }
    }

    public function applicationPayment($modelName, $modelId)
    {
        $modelClassName = base64_decode($modelName);
        $data['model'] = $modelClassName;
        $id = base64_decode($modelId);
        $data['id'] = $id;
        if ($modelClassName && $id) {
            $model = '\\App\\Models\\' . $modelClassName;
            $row = $model::find($id);
            if ($row) {
                $serviceType = $row->service_type->id;
                $applicationChargesData = ApplicationCharge::where('service_type', $serviceType)->where(function ($query) {
                    return $query->whereNull('effective_date_from')->orWhereDate('effective_date_from', '<=', date('Y-m-d'));
                })->where(function ($query) {
                    return $query->whereNull('effective_date_to')->orWhereDate('effective_date_to', '>=', date('Y-m-d'));
                })->first();
                $data['applicationCharges'] = $applicationChargesData->amount;
                $addressDropdownData = getAddressDropdownData();
                $data = $data + $addressDropdownData;
                return view('payment.application-input', $data);
            }
        } else {
            return back()->with(' failure', "Something went worong!!");
        }
    }

    public function applicationPaymentSubmit(Request $request, PaymentService $paymentService)
    {
        $model = $request->model_name;
        $modelId = $request->id;
        $amount = $request->applicationCharges;
        if ($model && $modelId && $amount > 0) {
            $modelClass = '\\App\\Models\\' . $model;
            $application = $modelClass::find($modelId);
            if (!empty($application)) {
                $propertyMasterId = $application->property_master_id;
                if (is_null($application->splited_property_detail_id)) {
                    $master_old_property_id = $application->old_property_id;
                    $splited_old_property_id = null;
                } else {
                    $masterProperty = PropertyMaster::find($propertyMasterId);
                    $master_old_property_id = $masterProperty->old_propert_id;
                    $splited_old_property_id = $application->old_property_id;
                }
            } else {
                return redirect()->back()->with('failue', 'Something went wrong. Application data not found');
            }
            $uniquePayemntId = 'PAC' . date('YmdHis');
            $payment = Payment::create([
                'property_master_id' => $propertyMasterId,
                'type' => getServiceType('PAY_APP_CHG'),
                'application_no' => $application->application_no,
                'model' => $model,
                'model_id' => $modelId,
                'payment_mode' => getServiceType($request->payment_mode),
                'unique_payment_id' => $uniquePayemntId,
                'splited_property_detail_id' => $application->splited_property_detail_id,
                'master_old_property_id' => $master_old_property_id,
                'splited_old_property_id' => $splited_old_property_id,
                'amount' => $amount,
                'status' => getServiceType('PAY_PENDING'),
                'created_by' => Auth::id()
            ]);
            // function to be used only on production server
            // if ($payment) {

            //     //save payer details
            //     GeneralFunctions::savePayerDetails($request->all(), $payment->id);

            //     // Payment 
            //     list($countryName, $stateName, $cityName) =  GeneralFunctions::getAddressNames($request->only('country', 'state', 'city'));

            //     $orderCode = $uniquePayemntId;
            //     // $orderCode = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);
            //     $paymentData = [
            //         'order_code' => $orderCode,
            //         'merchant_batch_code' => $orderCode,
            //         'installation_id' => '11136',
            //         'amount' => $amount,
            //         'currency_code' => "INR",
            //         'order_content' => '23092',
            //         'payemnt_type_id' => config('constants.payment_type_id'),
            //         'email' => $request->payer_email,
            //         'first_name' => $request->payer_first_name,
            //         'last_name' => $request->payer_last_name,
            //         'mobile' => $request->payer_mobile,
            //         'address_1' => $request->address_1,
            //         'address_2' => $request->address_2,
            //         'postal_code' => $request->postal_code,
            //         'region' => $request->region,
            //         'city' => $cityName,
            //         'state' => $stateName,
            //         'country' => $countryName,
            //     ];
            //     // dd($paymentData);
            //     $transaction = $paymentService->makePayemnt($paymentData);
            //     // return redirect()->back()->with('success', 'Data saved successfully');
            // }

            if ($payment) {
                GeneralFunctions::convertTempAppToFinal($modelId, $model, $payment);
            }
        }
    }

    public function paymentSummary(Request $request)
    {
        $startDate = isset($request->start_date) && !empty($request->start_date) ? $request->start_date : null;
        $endDate = isset($request->end_date) && !empty($request->end_date) ? $request->end_date : null;
        $paymentQuery = Payment::when(!is_null($startDate), function ($q) use ($startDate) {
            return $q->where('created_at', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'));
        })->when(!is_null($endDate), function ($q) use ($endDate) {
            return $q->where('created_at', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'));
        });
        $payments = $paymentQuery->whereIn('status', [getServiceType('PAY_PENDING'), getServiceType('PAY_SUCCESS')])->get();

        $data['total_transactinos'] = $payments->count();
        $data['total_amount'] = $payments->sum('amount');

        // Use the helper for pending and success
        $data['statuswise'] = [
            'PAY_PENDING' => $this->getPaymentSummaryByStatus($payments, 'PAY_PENDING'),
            'PAY_SUCCESS' => $this->getPaymentSummaryByStatus($payments, 'PAY_SUCCESS'),
        ];

        $data['typewiseCount'] = $payments->groupBy('type')->map(fn($group) => $group->count());
        $data['typewiseAmount'] = $payments->groupBy('type')->map(fn($group) => $group->sum('amount'));
        $applicationPayments = $payments->where('type', getServiceType('PAY_APP_CHG'));
        // dd($applicationPayments);
        $data['applicationwiseBreakup'] = [
            'mutation' => $this->getBreakup($applicationPayments, 'mutation'),
            'conversion' => $this->getBreakup($applicationPayments, 'conversion'),
            'LUC' => $this->getBreakup($applicationPayments, 'landUseChange'),
            'NOC' => $this->getBreakup($applicationPayments, 'NOC'),
        ];
        $demandQuery  = Demand::when(!is_null($startDate), function ($q) use ($startDate) {
            return $q->where('created_at', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'));
        })->when(!is_null($endDate), function ($q) use ($endDate) {
            return $q->where('created_at', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'));
        });
        $demandTotal = $demandQuery->whereIn('status', [getServiceType('DEM_PENDING'), getServiceType('DEM_PAID'), getServiceType('DEM_PART_PAID')])->sum('net_total');
        $demandPayment = $demandQuery->whereIn('status', [getServiceType('DEM_PAID'), getServiceType('DEM_PART_PAID')])->sum('paid_amount');
        $data['demandData'] = ['total' => $demandTotal, 'paid' => $demandPayment];
        $data['request'] = $request;
        // dd($data);
        return view('payment.summary', $data);
    }

    protected function getPaymentSummaryByStatus($payments, string $status): array
    {
        $filtered = $payments->where('status', getServiceType($status));

        return [
            'count' => $filtered->count(),
            'amount' => $filtered->sum('amount'),
        ];
    }

    protected function getBreakup($collection, string $needle): array
    {
        $filtered = $collection->filter(fn($item) => stripos($item->model, $needle) !== false);

        return [
            'count' => $filtered->count(),
            'amount' => $filtered->sum('amount'),
        ];
    }



    public function applicantPayment(Request $request, PaymentService $paymentService)
    {
        // dd($request->all());
        if ($request->property_id) {
            $propertyId = $request->property_id;
            $isSplitedproperty = SplitedPropertyDetail::where('old_property_id', $propertyId)->first();
            if ($isSplitedproperty) {
                $propertyMasterId = $isSplitedproperty->property_master_id;
                $propertyMaster = PropertyMaster::find($propertyMasterId);
                $master_old_property_id = $propertyMaster->old_propert_id;
                $splited_old_property_id = $isSplitedproperty->old_property_id;
            } else {
                $propertyMaster = PropertyMaster::where('old_propert_id', $propertyId)->first();
                if (empty($propertyMaster)) {
                    return redirect()->back()->with('failure', 'Property ID does not exist');
                }
                $propertyMasterId = $propertyMaster->id;
                $master_old_property_id = $propertyMaster->old_propert_id;
                $splited_old_property_id = null;
            }
        }
        // dd($propertyMasterId,$master_old_property_id,$splited_old_property_id);
        $paymentIdPrefix = '';
        if ($request->payment_type == 'GROUND_RENT') {
            $paymentIdPrefix = 'GR';
        } elseif ($request->payment_type == 'PAY_RTI') {
            $paymentIdPrefix = 'RTI';
        }
        $paidAmount = $request->paid_amount;
        $uniquePayemntId = $paymentIdPrefix . date('YmdHis');
        $payment = Payment::create([
            'property_master_id' => $propertyMasterId,
            'type' => getServiceType($request->payment_type),
            'payment_mode' => getServiceType($request->payment_mode),
            'unique_payment_id' => $uniquePayemntId,
            'splited_property_detail_id' => $isSplitedproperty ? $isSplitedproperty->id : null,
            'master_old_property_id' => $master_old_property_id,
            'splited_old_property_id' => $splited_old_property_id,
            'amount' => $paidAmount,
            'status' => 1,
            'created_by' => Auth::check() ? Auth::id() : null
        ]);

        if ($payment) {

            //save payer details
            GeneralFunctions::savePayerDetails($request->all(), $payment->id);

            // Payment 
            list($countryName, $stateName, $cityName) =  GeneralFunctions::getAddressNames($request->only('country', 'state', 'city'));

            $orderCode = $uniquePayemntId;
            // $orderCode = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);
            $payementData = [
                'order_code' => $orderCode,
                'merchant_batch_code' => $orderCode,
                'installation_id' => '11136',
                'amount' => $paidAmount,
                'currency_code' => "INR",
                'order_content' => '23092',
                'payemnt_type_id' => config('constants.payment_type_id'),
                'code' => getServiceNameByCode($request->payment_mode),
                'email' => $request->payer_email,
                'first_name' => $request->payer_first_name,
                'last_name' => $request->payer_last_name,
                'mobile' => $request->payer_mobile,
                'address_1' => $request->address_1,
                'address_2' => $request->address_2,
                'postal_code' => $request->postal_code,
                'region' => $request->region,
                'city' => $cityName,
                'state' => $stateName,
                'country' => $countryName,
            ];

            $transaction = $paymentService->makePayemnt($payementData);
            // return redirect()->back()->with('success', 'Data saved successfully');
        }
    }
}
