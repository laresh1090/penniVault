<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreatePaymentMethodRequest;
use App\Http\Resources\PaymentMethodResource;
use App\Http\Resources\TransactionCollection;
use App\Http\Resources\WalletResource;
use App\Models\PaymentMethod;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    /**
     * GET /api/v1/wallet
     */
    public function show(Request $request): JsonResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($request->user());

        return response()->json([
            'wallet' => new WalletResource($wallet),
        ]);
    }

    /**
     * GET /api/v1/wallet/transactions
     */
    public function transactions(Request $request): TransactionCollection
    {
        $filters = $request->only(['type', 'status', 'dateFrom', 'dateTo']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        $transactions = $this->walletService->getTransactions(
            $request->user(),
            $filters,
            $perPage
        );

        return new TransactionCollection($transactions);
    }

    /**
     * GET /api/v1/wallet/payment-methods
     */
    public function paymentMethods(Request $request): JsonResponse
    {
        $methods = PaymentMethod::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'paymentMethods' => PaymentMethodResource::collection($methods),
        ]);
    }

    /**
     * POST /api/v1/wallet/payment-methods
     */
    public function storePaymentMethod(CreatePaymentMethodRequest $request): JsonResponse
    {
        $user = $request->user();

        $isFirst = PaymentMethod::where('user_id', $user->id)->count() === 0;
        $isDefault = $request->boolean('isDefault', false) || $isFirst;

        if ($isDefault) {
            PaymentMethod::where('user_id', $user->id)->update(['is_default' => false]);
        }

        $method = PaymentMethod::create([
            'user_id' => $user->id,
            'bank_name' => $request->input('bankName'),
            'bank_code' => $request->input('bankCode'),
            'account_number' => $request->input('accountNumber'),
            'account_name' => $request->input('accountName'),
            'is_default' => $isDefault,
        ]);

        return response()->json([
            'message' => 'Payment method added successfully.',
            'paymentMethod' => new PaymentMethodResource($method),
        ], 201);
    }

    /**
     * DELETE /api/v1/wallet/payment-methods/{paymentMethod}
     */
    public function destroyPaymentMethod(Request $request, PaymentMethod $paymentMethod): JsonResponse
    {
        if ($paymentMethod->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $wasDefault = $paymentMethod->is_default;
        $paymentMethod->delete();

        if ($wasDefault) {
            $next = PaymentMethod::where('user_id', $request->user()->id)->first();
            $next?->update(['is_default' => true]);
        }

        return response()->json(['message' => 'Payment method removed.']);
    }

    /**
     * PUT /api/v1/wallet/payment-methods/{paymentMethod}/default
     */
    public function setDefaultPaymentMethod(Request $request, PaymentMethod $paymentMethod): JsonResponse
    {
        if ($paymentMethod->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        PaymentMethod::where('user_id', $request->user()->id)->update(['is_default' => false]);
        $paymentMethod->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default payment method updated.',
            'paymentMethod' => new PaymentMethodResource($paymentMethod->fresh()),
        ]);
    }
}
