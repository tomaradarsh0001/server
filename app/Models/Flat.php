<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flat extends Model
{
    use HasFactory;
    protected $guarded = [];

    //Make flat & user properties relationship - Lalit (08/Nov/2024)
    public function userProperties()
    {
        return $this->hasMany(UserProperty::class, 'flat_id', 'id');
    }

    /** relation added by Nitin on 10-06-2025 */
    public function master(): BelongsTo
    {
        return $this->belongsTo(PropertyMaster::class, 'property_master_id', 'id');
    }
}
