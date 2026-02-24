<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\OtpType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OtpVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6'],
            'type' => ['required', Rule::enum(OtpType::class)],
        ];
    }
}
