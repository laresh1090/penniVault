<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\SavingsFrequency;
use App\Enums\SavingsProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateSavingsPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productType = $this->input('productType');

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'productType' => ['required', Rule::enum(SavingsProductType::class)],
            'targetAmount' => ['required', 'numeric', 'min:1000'],
            'frequency' => ['required', Rule::enum(SavingsFrequency::class)],
            'contributionAmount' => ['required', 'numeric', 'min:100'],
            'startDate' => ['required', 'date', 'after_or_equal:today'],
            'endDate' => [
                Rule::requiredIf(fn () => $productType === 'pennilock'),
                'nullable',
                'date',
                'after:startDate',
            ],
            'linkedAssetId' => ['nullable', 'string', 'max:26'],
            'hasInterest' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'targetAmount.min' => 'Target amount must be at least 1,000 Naira.',
            'contributionAmount.min' => 'Contribution amount must be at least 100 Naira.',
            'endDate.required_if' => 'PenniLock plans require an end date.',
            'endDate.after' => 'End date must be after start date.',
        ];
    }
}
