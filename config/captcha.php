<?php

return [
    'disable' => env('CAPTCHA_DISABLE', false),
    'characters' => ['2', '3', '4', '6', '7', '8', '9', 'a', 'b', 'c','2', '3', '4', '6', '7', '8', '9', 'd', 'e','2', '3', '4', '6', '7', '8', '9', 'f', 'g', 'h', 'j', 'm', '2', '3', '4', '6', '7', '8', '9','n', 'p', 'q', 'r', 't', 'u', '2', '3', '4', '6', '7', '8', '9','x', 'y', 'z', 'A', 'B','2', '3', '4', '6', '7', '8', '9', 'C', 'D', 'E', 'F', 'G', '2', '3', '4', '6', '7', '8', '9','H', 'J', 'M', '2', '3', '4', '6', '7', '8', '9','N', 'P', 'Q', 'R','2', '3', '4', '6', '7', '8', '9', 'T', 'U', 'X', 'Y', 'Z'],
    'default' => [
        'length' => 6,
        'width' => 200,
        'height' => 42,
        'quality' => 90,
        'math' => false,
        'expire' => 120,
        'encrypt' => false,
    ],
    'math' => [
        'length' => 9,
        'width' => 120,
        'height' => 36,
        'quality' => 90,
        'math' => true,
    ],

    'flat' => [
        'length' => 6,
        'width' => 160,
        'height' => 46,
        'quality' => 90,
        'lines' => 6,
        'bgImage' => false,
        'bgColor' => '#ecf2f4',
        'fontColors' => ['#2c3e50', '#c0392b', '#16a085', '#c0392b', '#8e44ad', '#303f9f', '#f57c00', '#795548'],
        'contrast' => -5,
    ],
    'mini' => [
        'length' => 3,
        'width' => 60,
        'height' => 32,
    ],
    'inverse' => [
        'length' => 5,
        'width' => 120,
        'height' => 36,
        'quality' => 90,
        'sensitive' => true,
        'angle' => 12,
        'sharpen' => 10,
        'blur' => 2,
        'invert' => true,
        'contrast' => -5,
    ]
];
