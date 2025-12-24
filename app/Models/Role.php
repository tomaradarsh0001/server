<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    public static function roleNameById($id)
    {
        $data =  Self::select('*')->where('id', $id)->first();
        // return $data['name']; // Comment to display title instead of name - Lalit Tiwari (02/May/2025)
        return $data['title'];
    }
}
