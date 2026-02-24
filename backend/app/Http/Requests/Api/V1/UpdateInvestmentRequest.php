<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\InvestmentCategory;
use App\Enums\InvestmentRiskLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvestmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'category' => ['sometimes', Rule::enum(InvestmentCategory::class)],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['string', 'max:500'],
            'location' => ['sometimes', 'string', 'max:255'],
            'targetAmount' => ['sometimes', 'numeric', 'min:100000', 'max:999999999'],
            'minimumInvestment' => ['sometimes', 'numeric', 'min:1000', 'max:999999999'],
            'expectedRoiPercent' => ['sometimes', 'numeric', 'min:1', 'max:100'],
            'durationDays' => ['sometimes', 'integer', 'min:30', 'max:1825'],
            'startDate' => ['sometimes', 'date'],
            'endDate' => ['sometimes', 'date', 'after:startDate'],
            'riskLevel' => ['sometimes', Rule::enum(InvestmentRiskLevel::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'targetAmount.min' => 'Target amount must be at least 100,000 Naira.',
            'minimumInvestment.min' => 'Minimum investment must be at least 1,000 Naira.',
            'expectedRoiPercent.max' => 'Expected return cannot exceed 100%.',
        ];
    }
}
