<?php
return [
    'rgr_factor' => [
        'lndo' => [
            'residential' => 2.5,
            'commercial' => 5,
            'institutional' => 5,
            'industrial' => 5
        ],
        'circle' => [
            'residential' => 1,
            'commercial' => 2,
            'institutional' => 2,
            'industrial' => 2
        ]
    ],
    'ldo_logo_path' => 'https://upload.wikimedia.org/wikipedia/commons/8/84/Government_of_India_logo.svg',

    'conversion_calculation_rate' => 'circle', //lndo, circle
    'OTP_EXPIRY_TIME' => 2, // in minutes added by lalit (25/Oct/2024)
    'unearned_increase_factor' => 0.25, //by Nitin 20/Nov/24
    'payment_type_id' => 0, //added by Nitin 10/Jan/2024 , to be used in payment data xml
    'paymentURL' => "https://training.pfms.gov.in/bharatkosh/bkepay",
    'paymentStatusURL' => "https://training.pfms.gov.in/bharatkosh/NTRPHome/GetStatusBK",
    'oldDemandByPropertyId' => 'https://ldo.gov.in/eDhartiAPI/Api/GetLatestDemand/ByPropertyID',
    // 'propertyDocList' => 'https://ldo.gov.in/eDhartiAPI/Api/GetValues/PropertyDocList?PropertyID=',
    'propertyDocList' => 'https://ldo.gov.in/edhartiapi/Api/PropDocs/bypropertyID?PropertyID=',
    'ldoOldNocListByColony' => 'https://ldo.gov.in/edhartiapi/Api/NOCList/ListbyColony',
    // https://ldo.gov.in/eDhartiAPI/Api/GetLatestDemand/ByPropertyID

    'MAX_INACTIVE_DAYS_FOR_REGISTERED_USER' => 30, // Maximum inactive days before deactivating a registered user added by Swati 20-03-2025
    'MAX_INACTIVE_DAYS_AFTER_APPLICATION_DISPOSED' => 30, // Maximum inactive days after an application is disposed added by Swati 20-03-2025

    //demand penalty

    'DEMAND_PENALTIES' => [
        ['days' => 30, 'factor' => 0.1],
        ['days' => 60, 'factor' => 0.5],
        ['days' => 90, 'factor' => 1],
    ],

];
