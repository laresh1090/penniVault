<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\InvestmentCategory;
use App\Enums\InvestmentRiskLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateInvestmentRequest extends FormRequest
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
            'category' => ['required', Rule::enum(InvestmentCategory::class)],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['string', 'max:500'],
            'location' => ['required', 'string', 'max:255'],
            'targetAmount' => ['required', 'numeric', 'min:100000', 'max:999999999'],
            'minimumInvestment' => ['required', 'numeric', 'min:1000', 'max:999999999'],
            'expectedRoiPercent' => ['required', 'numeric', 'min:1', 'max:100'],
            'durationDays' => ['required', 'integer', 'min:30', 'max:1825'],
            'startDate' => ['required', 'date', 'after_or_equal:today'],
            'endDate' => ['required', 'date', 'after:startDate'],
            'riskLevel' => ['sometimes', Rule::enum(InvestmentRiskLevel::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'targetAmount.min' => 'Target amount must be at least 100,000 Naira.',
            'minimumInvestment.min' => 'Minimum investment must be at least 1,000 Naira.',
            'expectedRoiPercent.min' => 'Expected return must be at least 1%.',
            'expectedRoiPercent.max' => 'Expected return cannot exceed 100%.',
            'durationDays.min' => 'Duration must be at least 30 days.',
            'durationDays.max' => 'Duration cannot exceed 5 years (1,825 days).',
            'endDate.after' => 'End date must be after start date.',
        ];
    }
}
