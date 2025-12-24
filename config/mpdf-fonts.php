<?php

use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;

$defaultConfig = (new ConfigVariables())->getDefaults();
$fontDirs = $defaultConfig['fontDir'];

$defaultFontConfig = (new FontVariables())->getDefaults();
$fontData = $defaultFontConfig['fontdata'];

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'fontDir' => array_merge($fontDirs, [
        resource_path('fonts'),
    ]),
    'fontdata' => $fontData + [
        'noto' => [
            'R' => 'NotoSansDevanagari-Regular.ttf',
            // 'useOTL' => 0xFF,
            'useKashida' => 75,
        ],
    ],
    'default_font' => 'noto',
];
