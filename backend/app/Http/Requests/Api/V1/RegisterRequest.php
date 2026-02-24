<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\BusinessType;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'role' => ['required', Rule::in([UserRole::User->value, UserRole::Vendor->value])],
        ];

        // Vendor-specific fields
        if ($this->input('role') === UserRole::Vendor->value) {
            $rules['businessName'] = ['required', 'string', 'max:255'];
            $rules['businessType'] = ['required', Rule::enum(BusinessType::class)];
            $rules['registrationNumber'] = ['nullable', 'string', 'max:255'];
            $rules['businessAddress'] = ['nullable', 'string', 'max:500'];
        }

        return $rules;
    }
}
