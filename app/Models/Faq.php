<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faq extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'faq';

    // Fillable fields
    protected $fillable = [
        'related_to_eng',
        'related_to_hin',
        'question_eng',
        'question_hin',
        'answer_eng',
        'answer_hin',
        'link_eng',
        'link_hin',
        'sort_order',
        'is_active', // fixed from 'status'
        'created_by',
        'updated_by'
    ];

    // Automatically append custom attributes to model's array and JSON form
    protected $appends = [
        'related_to_eng_value',
        'related_to_eng_description',
        'related_to_hin_value',
        'related_to_hin_description',
    ];

    /**
     * Relationship: FAQ belongs to a creator (User)
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relationship: FAQ belongs to an updater (User)
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Accessors to split value --> description from related_to_eng
     */
    public function getRelatedToEngValueAttribute()
    {
        return explode('-->', $this->related_to_eng)[0] ?? '';
    }

    public function getRelatedToEngDescriptionAttribute()
    {
        return explode('-->', $this->related_to_eng)[1] ?? '';
    }

    /**
     * Accessors to split value --> description from related_to_hin
     */
    public function getRelatedToHinValueAttribute()
    {
        return explode('-->', $this->related_to_hin)[0] ?? '';
    }

    public function getRelatedToHinDescriptionAttribute()
    {
        return explode('-->', $this->related_to_hin)[1] ?? '';
    }
}
