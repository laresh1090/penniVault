<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AccountStatus;
use App\Enums\OtpType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\OtpVerifyRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Notifications\EmailOtpNotification;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function verify(OtpVerifyRequest $request): JsonResponse
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified.',
            ]);
        }

        $isValid = $this->otpService->verify(
            $user,
            $request->input('code'),
            OtpType::EmailVerification
        );

        if (! $isValid) {
            return response()->json([
                'message' => 'Invalid or expired verification code.',
            ], 422);
        }

        $user->update([
            'email_verified_at' => now(),
            'status' => AccountStatus::Active,
        ]);

        // Auto-login after verification
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Email verified successfully.',
            'user' => new UserResource($user->load('vendorProfile')),
        ]);
    }

    public function resend(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $user = $email ? User::where('email', $email)->first() : $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified.',
            ]);
        }

        $otp = $this->otpService->generate($user, OtpType::EmailVerification);
        $user->notify(new EmailOtpNotification($otp->code));

        return response()->json([
            'message' => 'Verification code sent to your email.',
        ]);
    }
}
