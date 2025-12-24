<!DOCTYPE html>
<html lang="en">

    <head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!-- External CSS libraries -->
        <!-- Favicon icon -->
        <link rel="shortcut icon" href="{{ asset('assets/frontend/assets/img/favicon.ico') }}" type="image/x-icon" />

        <!-- Custom Stylesheet -->
        <!-- Custom Stylesheet -->
    </head>
    <style>
        body {
            /* font-family: 'DejaVu Sans', sans-serif; */
            font-family: sans-serif !important;
            margin: 0;
            padding: 0;
            position: relative;
        }

        /* body::before {
            content: "";
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            z-index: -99;
            background: url(assets/images/water-mark-emblem.png) center center no-repeat;
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

        body::after {
            content: "";
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            z-index: -9;
            background: url(assets/images/water-mark.png) 0 0 repeat;
            transform: rotate(-30deg);
            opacity: 0.3;
        }

        .emblem-div {
            width: 100%;
            text-align: center;
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
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            margin: 0;
        }

        .part-title {
            background-color: #1fa1a2;
            color: white;
            font-size: 14px;
            padding: 8px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }

        th {
            background-color: #f4f4f4;
            font-weight: bold;
        }

        .content-wrap {
            margin-right: 30px;
            margin-left: 30px;
        }
        .name-sign{
            font-size: 25px;
            text-align: right;
        }
          .content-wrap p{
            font-size: 14px;
        }
        .qr-img{
            text-align: center;
        }
        .bold{
            font-weight: bold;
        }
        .hidden-table,
        .hidden-table th,
        .hidden-table td{
            border:0;
            font-size:12px;
            vertical-align: top;
            margin:0 0 10px;
        }
        .hidden-table th p,
        .hidden-table td p{
            margin: 0;
        }
        p{
            text-align: justify;
        }
        img {
            image-rendering: optimizeQuality;
            -dompdf-image-resolution: 72dpi;
        }
    </style>

<body>
    <div class="watermark"></div>

    <div class="content-wrap">
        <table class="hidden-table">
            <tr>
                <td style="width: 100px;"></td>
                <td>
                    <div class="emblem-div">
                        <img src="assets/images/emblem.jpg" width="60" alt="Emblem" class="emblem">
                    </div>

                    <!-- Main Title -->
                     <h1 class="title-main">Government of India</h1>
                     <h1 class="title-main">Ministry of Housing and Urban Affairs</h1>                    
                     <h1 class="title-main">Land And Development Office</h1>
                </td>
                <!-- <td style="text-align: right;width: 100px;"><img src="assets/images/ldo_mohua_qr.png" width="100" alt="Emblem" class="emblem"></td> -->
                <td><img src="qrcode/{{$filename}}" alt="QR Code" width="100" height="100"></td>
            </tr>
        </table>
         <div class="part-title">
            NOC
        </div>

        <!-- Membership Details Table -->
        <table>
            <tr>
                <td style="width:50%"><b>L&DO/{{$noticeData['sectionName']}}</b></td>
                <td style="width:50%"><b>Dated: {{$noticeData['date']}}</b></td>
            </tr>
            <tr>
                <td style="width:50%"><b>Property ID:  {{$noticeData['propertyId']}}</b></td>
                <td style="width:50%"><b>Application ID: {{$noticeData['applicationNo']}}</b></td>
            </tr>
        </table>
        <!-- Declaration -->
         <h4 style="text-align: center;">TO WHOM SO EVER IT MAY CONCERN</h4>
         <p>
            Certified that property No. {{$noticeData['plotNo']}} , block-{{$noticeData['blockNo']}} admeasuring {{$noticeData['plotArea']}} {{$noticeData['unit']}} situated at {{$noticeData['colonyName']}},
            Delhi is a {{$noticeData['propertyStatus']}} Property and as per L&DO record standing in the name of {{$noticeData['lesseeNames']}}.
        </p>
        <p>
            This is also certified that at the time of execution of conveyance deed from lease hold into freehold
            on {{$noticeData['transferDate']}}, the property was free from all kinds of encumbrances, sale mortgage, legal flaws, court
            injunctions etc. Hence, L&DO has no objection for further transaction of the above said property subject
            to verification of documents executed after conversion of the property by Land & Development Office
            from lease hold to freehold.
        </p>
        <!-- <div class="declaration">
            <div><strong>Declaration:</strong></div>
            <div>I hereby declare that the information provided above is true, correct, and complete to the best of my
                knowledge and belief. The details have been duly verified and are submitted for official processing.
            </div>
        </div> -->

        <div class="letter-footer" style="margin-top: 200px;">
            <!-- <div class="ldo-sign" style="text-align: end;display: flex;justify-self: end;width: 200px;">
                <div class="name-sign">RAJEEV KUMAR DAS</div>
                <div class="">
                    Digitally signed by RAJEEV KUMAR DAS
                    <br/>
                    <span>Date: 2025.07.16</span><br/>
                    <span>16:48:11 +05'30'</span>
                </div>
            </div> -->
            <p class="uppercase fs18 bold" style="margin: 0px; text-align:right">({{$noticeData['deputyUserName']}})</p>
            <p style="margin: 0px;text-align:right" class="bold fs16">Deputy Land & Development Office</p>            
        </div>
        <!-- for signature of admin by swati on 29052025 -->
        <!-- Undersignee Section -->
        <!-- <div class="signature-box">
            <div class="signature-inner">
                <div class="signature-line"></div>
                <div class="signature-label">Signature of Admin Incharge</div>
            </div>
        </div> -->

    </div>
</body>

</html>