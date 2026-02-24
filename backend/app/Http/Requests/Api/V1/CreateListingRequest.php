<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\ListingCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', Rule::enum(ListingCategory::class)],
            'price' => ['required', 'numeric', 'min:1000', 'max:999999999'],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['string', 'max:500'],
            'location' => ['required', 'string', 'max:255'],
            'metadata' => ['sometimes', 'nullable', 'array'],
            'stockQuantity' => ['sometimes', 'integer', 'min:1', 'max:10000'],
            'allowInstallment' => ['sometimes', 'boolean'],
            'minUpfrontPercent' => ['sometimes', 'numeric', 'min:20', 'max:60'],
            'installmentMarkup6m' => ['sometimes', 'numeric', 'min:0', 'max:50'],
            'installmentMarkup12m' => ['sometimes', 'numeric', 'min:0', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.min' => 'Price must be at least 1,000 Naira.',
            'price.max' => 'Price cannot exceed 999,999,999 Naira.',
            'images.max' => 'Maximum of 10 images allowed.',
        ];
    }
}
