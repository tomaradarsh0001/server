<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScreenReader extends Model
{
    use HasFactory;

    protected $fillable = ['screen_reader_eng', 'screen_reader_hin', 'website', 'type'];
}
