<?php

namespace App\Services;

use App\Models\PaymentGatewayLog;
use App\Models\User;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    /**
     * Initiate a dummy payment (deposit to wallet).
     *
     * Simulates a 2-second processing delay.
     * Always succeeds unless amount > 50,000,000 (simulated decline).
     */
    public function initiateDeposit(
        User $user,
        float $amount,
        string $channel,
        array $details = []
    ): array {
        $gatewayReference = 'DGW-' . strtoupper(Str::uuid()->toString());

        // Log the initiation
        $log = PaymentGatewayLog::create([
            'user_id' => $user->id,
            'gateway' => 'dummy',
            'channel' => $channel,
            'gateway_reference' => $gatewayReference,
            'amount' => $amount,
            'currency' => 'NGN',
            'status' => 'initiated',
            'request_payload' => [
                'channel' => $channel,
                'amount' => $amount,
                'card_last4' => $channel === 'card'
                    ? substr($details['number'] ?? '0000', -4)
                    : null,
            ],
        ]);

        // Simulate processing delay (2 seconds)
        usleep(2_000_000);

        // Simulate success/failure — decline amounts over 50M
        $success = $amount <= 50_000_000;

        if ($success) {
            // Credit the wallet
            $transaction = $this->walletService->creditWallet(
                $user,
                $amount,
                $channel === 'card'
                    ? "Card deposit (****" . substr($details['number'] ?? '0000', -4) . ")"
                    : "Bank transfer deposit",
                [
                    'gateway' => 'dummy',
                    'gateway_reference' => $gatewayReference,
                    'channel' => $channel,
                ]
            );

            $log->update([
                'transaction_id' => $transaction->id,
                'status' => 'successful',
                'response_payload' => [
                    'status' => 'successful',
                    'message' => 'Payment processed successfully',
                    'gateway_reference' => $gatewayReference,
                ],
                'completed_at' => now(),
            ]);

            return [
                'success' => true,
                'gatewayReference' => $gatewayReference,
                'transaction' => $transaction,
                'message' => 'Deposit successful.',
            ];
        }

        // Failure case
        $log->update([
            'status' => 'failed',
            'response_payload' => [
                'status' => 'failed',
                'message' => 'Transaction declined: amount exceeds gateway limit.',
                'gateway_reference' => $gatewayReference,
            ],
            'completed_at' => now(),
        ]);

        return [
            'success' => false,
            'gatewayReference' => $gatewayReference,
            'transaction' => null,
            'message' => 'Payment declined: amount exceeds limit.',
        ];
    }

    /**
     * Initiate a dummy withdrawal (wallet to bank account).
     *
     * @throws \InvalidArgumentException if insufficient balance
     */
    public function initiateWithdrawal(
        User $user,
        float $amount,
        \App\Models\PaymentMethod $paymentMethod
    ): array {
        $gatewayReference = 'DGW-' . strtoupper(Str::uuid()->toString());

        $log = PaymentGatewayLog::create([
            'user_id' => $user->id,
            'gateway' => 'dummy',
            'channel' => 'bank_transfer',
            'gateway_reference' => $gatewayReference,
            'amount' => $amount,
            'currency' => 'NGN',
            'status' => 'initiated',
            'request_payload' => [
                'bank_code' => $paymentMethod->bank_code,
                'account_number_masked' => $paymentMethod->masked_account_number,
                'amount' => $amount,
            ],
        ]);

        // Simulate processing delay
        usleep(2_000_000);

        $transaction = $this->walletService->debitWallet(
            $user,
            $amount,
            "Withdrawal to {$paymentMethod->bank_name} {$paymentMethod->masked_account_number}",
            [
                'gateway' => 'dummy',
                'gateway_reference' => $gatewayReference,
                'bank_name' => $paymentMethod->bank_name,
                'account_number_masked' => $paymentMethod->masked_account_number,
            ]
        );

        $log->update([
            'transaction_id' => $transaction->id,
            'status' => 'successful',
            'response_payload' => [
                'status' => 'successful',
                'message' => 'Withdrawal processed. Funds will arrive in 1-24 hours.',
                'gateway_reference' => $gatewayReference,
            ],
            'completed_at' => now(),
        ]);

        return [
            'success' => true,
            'gatewayReference' => $gatewayReference,
            'transaction' => $transaction,
            'message' => 'Withdrawal processed. Funds will arrive in 1-24 hours.',
        ];
    }

    /**
     * Verify a payment by its gateway reference.
     */
    public function verifyPayment(string $gatewayReference): ?PaymentGatewayLog
    {
        return PaymentGatewayLog::where('gateway_reference', $gatewayReference)->first();
    }
}
