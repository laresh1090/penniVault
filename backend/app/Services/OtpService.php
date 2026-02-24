<?php

namespace App\Services;

use App\Enums\OtpType;
use App\Models\OtpCode;
use App\Models\User;

class OtpService
{
    public function generate(User $user, OtpType $type): OtpCode
    {
        // Invalidate any existing unused OTPs of the same type
        OtpCode::where('user_id', $user->id)
            ->where('type', $type)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->update(['used_at' => now()]);

        return OtpCode::create([
            'user_id' => $user->id,
            'code' => str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'type' => $type,
            'expires_at' => now()->addMinutes(10),
        ]);
    }

    public function verify(User $user, string $code, OtpType $type): bool
    {
        $otp = OtpCode::where('user_id', $user->id)
            ->where('code', $code)
            ->where('type', $type)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (! $otp) {
            return false;
        }

        $otp->update(['used_at' => now()]);

        return true;
    }
}
