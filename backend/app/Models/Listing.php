<?php

namespace App\Models;

use App\Enums\ListingCategory;
use App\Enums\ListingStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Listing extends Model
{
    use HasUlids;

    protected $fillable = [
        'vendor_id',
        'title',
        'description',
        'category',
        'price',
        'images',
        'location',
        'status',
        'featured',
        'stock_quantity',
        'metadata',
        'allow_installment',
        'min_upfront_percent',
        'installment_markup_6m',
        'installment_markup_12m',
    ];

    protected function casts(): array
    {
        return [
            'category' => ListingCategory::class,
            'status' => ListingStatus::class,
            'price' => 'decimal:2',
            'images' => 'array',
            'featured' => 'boolean',
            'stock_quantity' => 'integer',
            'metadata' => 'array',
            'allow_installment' => 'boolean',
            'min_upfront_percent' => 'decimal:2',
            'installment_markup_6m' => 'decimal:2',
            'installment_markup_12m' => 'decimal:2',
        ];
    }

    // -- Relationships --

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // -- Scopes --

    public function scopeActive($query)
    {
        return $query->where('status', ListingStatus::Active);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOfCategory($query, ListingCategory $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByVendor($query, string $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    // -- Helpers --

    public function isActive(): bool
    {
        return $this->status === ListingStatus::Active;
    }

    public function isSold(): bool
    {
        return $this->status === ListingStatus::Sold;
    }

    public function isDraft(): bool
    {
        return $this->status === ListingStatus::Draft;
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    public function getPrimaryImageAttribute(): ?string
    {
        $images = $this->images;

        return is_array($images) && count($images) > 0 ? $images[0] : null;
    }

    public function getOrderCountAttribute(): int
    {
        return $this->orders()->count();
    }
}
