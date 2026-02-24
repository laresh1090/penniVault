<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmailVerificationController;
use App\Http\Controllers\Api\V1\InvestmentController;
use App\Http\Controllers\Api\V1\ListingController;
use App\Http\Controllers\Api\V1\PasswordResetController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\SavingsPlanController;
use App\Http\Controllers\Api\V1\InstallmentController;
use App\Http\Controllers\Api\V1\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Public routes ──
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
    Route::post('/email/verify', [EmailVerificationController::class, 'verify']);
    Route::post('/email/resend', [EmailVerificationController::class, 'resend']);

    // ── Public Marketplace Browsing ──
    Route::get('/listings', [ListingController::class, 'index']);
    Route::get('/listings/{listing}', [ListingController::class, 'show']);

    // ── Public Investment Browsing ──
    Route::get('/investments', [InvestmentController::class, 'index']);
    Route::get('/investments/{investment}', [InvestmentController::class, 'show']);

    // ── Protected routes ──
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);

        // ── Wallet ──
        Route::get('/wallet', [WalletController::class, 'show']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
        Route::get('/wallet/payment-methods', [WalletController::class, 'paymentMethods']);
        Route::post('/wallet/payment-methods', [WalletController::class, 'storePaymentMethod']);
        Route::delete('/wallet/payment-methods/{paymentMethod}', [WalletController::class, 'destroyPaymentMethod']);
        Route::put('/wallet/payment-methods/{paymentMethod}/default', [WalletController::class, 'setDefaultPaymentMethod']);

        // ── Payments (Dummy Gateway) ──
        Route::post('/payments/deposit', [PaymentController::class, 'deposit']);
        Route::post('/payments/withdraw', [PaymentController::class, 'withdraw']);
        Route::get('/payments/verify/{gatewayReference}', [PaymentController::class, 'verify']);

        // ── Savings Plans ──
        Route::get('/savings-plans/summary', [SavingsPlanController::class, 'summary']);
        Route::get('/savings-plans', [SavingsPlanController::class, 'index']);
        Route::post('/savings-plans', [SavingsPlanController::class, 'store']);
        Route::get('/savings-plans/{savingsPlan}', [SavingsPlanController::class, 'show']);
        Route::put('/savings-plans/{savingsPlan}', [SavingsPlanController::class, 'update']);
        Route::post('/savings-plans/{savingsPlan}/deposit', [SavingsPlanController::class, 'deposit']);
        Route::post('/savings-plans/{savingsPlan}/withdraw', [SavingsPlanController::class, 'withdraw']);
        Route::post('/savings-plans/{savingsPlan}/pause', [SavingsPlanController::class, 'pause']);
        Route::post('/savings-plans/{savingsPlan}/resume', [SavingsPlanController::class, 'resume']);
        Route::post('/savings-plans/{savingsPlan}/cancel', [SavingsPlanController::class, 'cancel']);

        // ── Marketplace — Vendor CRUD ──
        Route::post('/listings', [ListingController::class, 'store']);
        Route::put('/listings/{listing}', [ListingController::class, 'update']);
        Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

        // ── Marketplace — Vendor Dashboard ──
        Route::get('/vendor/listings', [ListingController::class, 'vendorListings']);
        Route::get('/vendor/sales', [ListingController::class, 'vendorSales']);

        // ── Marketplace — User Actions ──
        Route::post('/listings/{listing}/purchase', [ListingController::class, 'purchase']);
        Route::get('/orders', [ListingController::class, 'orders']);
        Route::get('/orders/{order}', [ListingController::class, 'orderShow']);

        // ── Installments ──
        Route::get('/listings/{listing}/installment-preview', [InstallmentController::class, 'preview']);
        Route::post('/listings/{listing}/installment-purchase', [InstallmentController::class, 'purchase']);
        Route::get('/installments', [InstallmentController::class, 'index']);
        Route::get('/installments/{installmentPlan}', [InstallmentController::class, 'show']);
        Route::post('/installments/{installmentPlan}/pay', [InstallmentController::class, 'pay']);
        Route::get('/vendor/installments', [InstallmentController::class, 'vendorIndex']);

        // ── Investments — Vendor CRUD ──
        Route::post('/investments', [InvestmentController::class, 'store']);
        Route::put('/investments/{investment}', [InvestmentController::class, 'update']);
        Route::delete('/investments/{investment}', [InvestmentController::class, 'destroy']);

        // ── Investments — Vendor Dashboard ──
        Route::get('/vendor/investments', [InvestmentController::class, 'vendorInvestments']);

        // ── Investments — User Actions ──
        Route::post('/investments/{investment}/invest', [InvestmentController::class, 'invest']);
        Route::get('/my-investments/summary', [InvestmentController::class, 'myInvestmentsSummary']);
        Route::get('/my-investments', [InvestmentController::class, 'myInvestments']);
        Route::get('/my-investments/{userInvestment}', [InvestmentController::class, 'myInvestmentShow']);

        // ── Admin — Investment Maturation ──
        Route::post('/admin/investments/{investment}/mature', [InvestmentController::class, 'mature']);
    });
});
