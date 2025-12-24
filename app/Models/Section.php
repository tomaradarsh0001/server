<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;
    protected $guarded = [];

    //User have many sections
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function propertySectionMappings(): HasMany
    {
        return $this->hasMany(PropertySectionMapping::class);
    }

    public function publicgrievances()
    {
        return $this->hasMany(AdminPublicGrievance::class, 'section_ids', 'section_code');
    }

    /**
     * Returns a map of section_code => [colony_ids...] added by swati mishra on 03-04-2025
     */
    // public static function colonySectionMap(array $desiredSectionCodes): array
    // {
    //     return self::whereIn('section_code', $desiredSectionCodes)
    //         ->with('propertySectionMappings')
    //         ->get()
    //         ->mapWithKeys(function ($section) {
    //             $colonyIds = $section->propertySectionMappings->pluck('colony_id')->unique()->values()->toArray();
    //             return [$section->section_code => $colonyIds];
    //         })
    //         ->toArray();
    // }

    /**
     * Returns a collection of full mappings (section_code + colony_id + type/subtype) added by swati mishra on 03-04-2025
     */
    public static function fullMappings(array $desiredSectionCodes)
    {
        return PropertySectionMapping::whereHas('section', function ($q) use ($desiredSectionCodes) {
                $q->whereIn('section_code', $desiredSectionCodes);
            })
            ->with('section')
            ->get()
            ->map(function ($mapping) {
                return (object)[
                    'section_code' => $mapping->section->section_code,
                    'colony_id' => $mapping->colony_id,
                    'property_type' => $mapping->property_type,
                    'property_subtype' => $mapping->property_subtype,
                ];
            });
    }
    
}
