<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Demand PDF</title>
    <style>
        body {
            /* font-family: 'DejaVu Sans', sans-serif; */
            font-family: sans-serif !important;
            margin: 0;
            padding: 0;
        }
        body::before {
            content: "";
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            z-index: -99;
            background: url({{ public_path('assets/images/water-mark-emblem.png') }}) center center no-repeat;
            opacity: 0.1;
        }

        /* body::after {
            content: "";
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            z-index: -9;
            background: url({{ public_path('assets/images/water-mark.png') }}) 0 0 repeat;
            transform: rotate(-30deg);
            opacity: 0.1;
        } */
        .watermark{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url("{{ public_path('assets/images/water-mark.png') }}") repeat;
            transform: rotate(-30deg);
            opacity: 0.1;
            z-index: -99;
        }
        .emblem-div {
            width: 100%;
            text-align: center;
            margin-top: 20px;
        }
        .emblem {
            display: inline-block;
            margin: auto;
        }
        .title-main {
            color: navy;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin: 0;
        }
        .title-sub {
            color: navy;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin: 0;
        }
        .part-title {
            background-color: #1fa1a2;
            color: white;
            font-size: 16px;
            padding: 5px;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 20px;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        /* .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 50px;
            color: rgba(0, 0, 0, 0.1);
            z-index: -1;
            white-space: nowrap;
            pointer-events: none;
        } */
        .name-to{
            margin-left: 50px;
            margin-bottom: 20px;
        }
        p .lg-hi{
            font-family: 'NotoSansDevanagari';
        }
        .foot-table tr,
        .foot-table td{
            border:0;
        }
        .foot-table tr td:first-child{
            text-align:left;
        }
        .foot-table tr td:last-child{
            text-align:right;
        }
        img {
            image-rendering: optimizeQuality;
            -dompdf-image-resolution: 72dpi;
        }
    </style>
</head>
<body>

    <!-- Optional watermark -->
    <!-- <div class="watermark">Land and Development Office</div> -->

    <div class="watermark"></div>

    <!-- Emblem Header -->
    <div class="emblem-div">
        <img src="{{ public_path('assets/images/emblem.png') }}" width="60" alt="Emblem" class="emblem">
    </div>
    <!-- <h1 class="title-main">Land And Development Office</h1>
    <h2 class="title-sub">Ministry of Housing and Urban Affairs</h2>
    <h2 class="title-sub">Government of India</h2> -->
    <h1 class="title-main">Government of India</h1>
    <h1 class="title-main">Ministry of Housing and Urban Affairs</h1>                    
    <h1 class="title-main">Land And Development Office</h1>

    <!-- Demand Overview Section -->
    <div class="part-title">
        Demand
    </div>

    <table>
        <tbody>
            <tr>
                <td><strong>Demand ID:</strong> {{ $demand->unique_id }}</td>
                <td><strong>Demand Date:</strong> {{ \Carbon\Carbon::parse($demand->approved_at)->format('d-m-Y') }}</td>
            </tr>
            <tr>
                <td><strong>Property ID:</strong>  {{ $demand->splited_property_detail_id !== null ? $demand->splited_property_detail_id : $demand->old_property_id }} ({{$uniquePropertyId}})</td>
                <td><strong>Inspection ID:</strong> N/A </td>
            </tr>
        </tbody>
    </table>

    <!-- <p>इंस्पेक्शन आई.डी. / Inspection ID:</p> -->
    <p>To,</p>
    <div class="name-to">{{ $name }}</div>

    <p> Only Demand / Terms for temporary Regularisation of Breaches / NOC / Extension of time for Completion / Execution of Lease Deed / Withdrawl of Re-Entry in respect of <b>property no. {{ $address }}</b></p>
        <p>
            <!-- Dear Sir/Madam:<br/> -->
            I am to refer to your Application / Letter number {{$applicationNo}} dated {{$applicationDate?->format('d-m-Y')}} on the subject cited above and to inform you that the lessor will be pleased to regularise the breaches in the premises temporarily upto____________ and withdraw the right of Re-Entry of the premises subject to the
            following conditions being fulfilled by you within 30 days from the date of issue of this letter:-
        </p>
        <p>
            2. (A) You are required to furnish to this office an amount of <b>Rs. {{ $demand->net_total }}/- ({{ ucfirst(convertNumberToWords($demand->net_total)) }} only)</b> (details attached) herewith.

        </p>
        <p>
            (B) The present letter offering terms will not act as a waiver for recovery of any other charges which may in the discretion of the Lessor, be found payable by you at a later stage.
        </p>
        <p>
            (C)
            Furnishing an undertaking on non-judicial stamp paper of Rs.10/- duly witnessed by two persons to the effect that you will pay the difference of misuse / damage charges, etc. if the landrates are revised w.e.f 01.04.2016 by the Government of India and will also remove the breaches by ______________ or got them regularised
            beyond the period for which charges have been paid.
        </p>
        <p>
            3.
            If the above terms and conditions are acceptable to you, the acceptance thereof may please be communicated to this office in writing together with the necessary undertaking and make payment through Netbanking / RTGS / NEFT / Credit card / Debit Card using ONLY NTRP (<a href="https://bharatkosh.gov.in" target="_blank">https://bharatkosh.gov.in</a>) or L&DO (<a href="https://ldo.gov.in" target="_blank">https://ldo.gov.in</a>) 
            websites within 30 days from the date of issue of this letter, failing which the above terms and conditions will automatically stand as withdrawn and cancelled and further action under the terms of the lease will be taken against you without any further reference.
        </p>
        <p>
            4.
            Further action to execute the lease deed shall be subject to complete payment and putting to use of the premises as per permissible under the master plan.
        </p>
        <p>
            5.
            It may please be clearly noted that if the amount is not paid within the period stipulated above, you will have to pay 10% interest on the total dues from the date of issue of this letter.
        </p>
        <p>
            6.
            It may be noted that you are also liable to pay Damages / Additional Charges / Additional Ground Rent for the period starting from next date of following the period of 30 days for which the above terms are being offered in respect of the breaches or any other breaches which may come to our notice. These charges will be communicated to you separately.
        </p>
        <p>
            7.
            It may also be made clear that in case you fail to comply with the terms within the stipulated period, the concession of limiting the penalty as mentioned above will also be withdrawn and you will be liable to pay the penalty upto the actual date of payment and shall also be liable for action under the terms of lease without further notice.
        </p>
        <p>
            8.
            In case you have any point to clarify in connection with the above notice you may kindly see the undersigned after prior appointment on telephone number 23063613 between 2.00 PM to 4.00 PM in the afternoon within a week of the date of receipt of this letter. It may, however, be clearly understood that your inability to avail of this opportunity of the personal hearing / discussion will not be accepted as a ground for not taking further action in the matter.
        </p>
        <p>
            9.
            It may please be clearly noted that this regularisation is without prejudice to the rights of DDA under DDA Act, 1957 or the right of local body to take action for misuse / unauthorised construction.
        </p>

        <div class="part-title">DEMAND DETAILS BREAKUP</div>

        <table>
            <thead>
                <tr>
                    <th>Subhead Name</th>
                    <th>Net Total</th>
                    <th>Paid Amount</th>
                    <th>Balance Amount</th>
                    <th>Financial Year</th>
                    <th>Formula</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($demandDetails as $detail)
                    <tr>
                        <td>{{ $items[$detail->subhead_id] ?? 'N/A' }}</td>
                        <td>{{ number_format($detail->net_total, 2) ?? 'N/A' }}</td>
                        <td>{{ number_format($detail->paid_amount, 2) ?? 'N/A' }}</td>
                        <td>{{ number_format($detail->balance_amount, 2) ?? 'N/A' }}</td>
                        <td>{{ $detail->fy ?? 'N/A' }}</td>
                        <td>{{ $formulas[$detail->formula_id] ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table class="foot-table">
            <tr>
                <td></td>
                <td>
                    <strong>Total Amount: Rs. {{ $demand->net_total }}</strong>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    Yours faithfully
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    {{$approvedBy}}<br/>
                    {!! $approvedByDesignation !!}  
                </td>
            </tr>
            <tr>
                <td>
                    Copy to:<br/>
                    Accounts Section
                </td>
                <td></td>
            </tr>
        </table>


</body>
</html>
