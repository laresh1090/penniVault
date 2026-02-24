<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\SavingsFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSavingsPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'contributionAmount' => ['sometimes', 'numeric', 'min:100'],
            'frequency' => ['sometimes', Rule::enum(SavingsFrequency::class)],
        ];
    }
}
