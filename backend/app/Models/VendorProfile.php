<?php

namespace App\Models;

use App\Enums\BusinessType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'registration_number',
        'business_address',
        'business_logo_url',
        'is_approved',
    ];

    protected function casts(): array
    {
        return [
            'business_type' => BusinessType::class,
            'is_approved' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
