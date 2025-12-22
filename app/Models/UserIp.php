<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserIp extends Model
{
    use HasFactory;

    protected $table = 'user_ips';

    protected $fillable = [
        'ip_address',
        'created_at',
        'updated_at',
    ];
}
