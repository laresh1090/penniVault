<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AccountStatus;
use App\Enums\OtpType;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Notifications\EmailOtpNotification;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'first_name' => $request->input('firstName'),
            'last_name' => $request->input('lastName'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'password' => $request->input('password'),
            'role' => $request->input('role'),
            'status' => AccountStatus::Pending,
        ]);

        // Create vendor profile if vendor
        if ($user->role === UserRole::Vendor) {
            $user->vendorProfile()->create([
                'business_name' => $request->input('businessName'),
                'business_type' => $request->input('businessType'),
                'registration_number' => $request->input('registrationNumber'),
                'business_address' => $request->input('businessAddress'),
            ]);
        }

        // Generate and send email OTP for verification
        $otp = $this->otpService->generate($user, OtpType::EmailVerification);
        $user->notify(new EmailOtpNotification($otp->code));

        return response()->json([
            'message' => 'Registration successful. Please check your email for the verification code.',
            'user' => new UserResource($user->load('vendorProfile')),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status === AccountStatus::Suspended) {
            return response()->json([
                'message' => 'Your account has been suspended. Please contact support.',
            ], 403);
        }

        if (! $user->email_verified_at) {
            // Send a new OTP for verification
            $otp = $this->otpService->generate($user, OtpType::EmailVerification);
            $user->notify(new EmailOtpNotification($otp->code));

            return response()->json([
                'message' => 'Email not verified. A new verification code has been sent to your email.',
                'requiresVerification' => true,
                'email' => $user->email,
            ], 403);
        }

        Auth::login($user, $request->boolean('remember', false));
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'user' => new UserResource($user->load('vendorProfile')),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('vendorProfile')),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => ['sometimes', 'string', 'max:255'],
            'lastName' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'dateOfBirth' => ['sometimes', 'nullable', 'date'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        $mapping = [
            'firstName' => 'first_name',
            'lastName' => 'last_name',
            'phone' => 'phone',
            'dateOfBirth' => 'date_of_birth',
            'address' => 'address',
            'city' => 'city',
            'state' => 'state',
            'bio' => 'bio',
        ];

        $data = [];
        foreach ($mapping as $camel => $snake) {
            if (array_key_exists($camel, $validated)) {
                $data[$snake] = $validated[$camel];
            }
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => new UserResource($user->fresh()->load('vendorProfile')),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'currentPassword' => ['required', 'string', 'current_password'],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()->numbers()],
        ]);

        $request->user()->update([
            'password' => $request->input('password'),
        ]);

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }
}
