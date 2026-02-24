<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\WalletDepositRequest;
use App\Http\Requests\Api\V1\WalletWithdrawalRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\WalletResource;
use App\Models\PaymentMethod;
use App\Services\PaymentService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
        private readonly WalletService $walletService,
    ) {}

    /**
     * POST /api/v1/payments/deposit
     */
    public function deposit(WalletDepositRequest $request): JsonResponse
    {
        $user = $request->user();
        $amount = (float) $request->input('amount');
        $channel = $request->input('channel');
        $details = $request->input('cardDetails', []);

        $result = $this->paymentService->initiateDeposit($user, $amount, $channel, $details);

        if ($result['success']) {
            $wallet = $this->walletService->getOrCreateWallet($user);

            return response()->json([
                'message' => $result['message'],
                'transaction' => new TransactionResource($result['transaction']),
                'wallet' => new WalletResource($wallet->fresh()),
                'gatewayReference' => $result['gatewayReference'],
            ]);
        }

        return response()->json([
            'message' => $result['message'],
            'gatewayReference' => $result['gatewayReference'],
        ], 422);
    }

    /**
     * POST /api/v1/payments/withdraw
     */
    public function withdraw(WalletWithdrawalRequest $request): JsonResponse
    {
        $user = $request->user();
        $amount = (float) $request->input('amount');
        $paymentMethodId = $request->input('paymentMethodId');

        $paymentMethod = PaymentMethod::where('id', $paymentMethodId)
            ->where('user_id', $user->id)
            ->first();

        if (! $paymentMethod) {
            return response()->json(['message' => 'Payment method not found.'], 404);
        }

        try {
            $result = $this->paymentService->initiateWithdrawal($user, $amount, $paymentMethod);

            $wallet = $this->walletService->getOrCreateWallet($user);

            return response()->json([
                'message' => $result['message'],
                'transaction' => new TransactionResource($result['transaction']),
                'wallet' => new WalletResource($wallet->fresh()),
                'gatewayReference' => $result['gatewayReference'],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/v1/payments/verify/{gatewayReference}
     */
    public function verify(string $gatewayReference): JsonResponse
    {
        $log = $this->paymentService->verifyPayment($gatewayReference);

        if (! $log) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        return response()->json([
            'status' => $log->status,
            'amount' => (float) $log->amount,
            'currency' => $log->currency,
            'channel' => $log->channel,
            'gateway' => $log->gateway,
            'gatewayReference' => $log->gateway_reference,
            'completedAt' => $log->completed_at?->toISOString(),
        ]);
    }
}
