<?php

namespace App\Services;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\PaymentMethod;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WalletService
{
    /**
     * Get or create a wallet for a user.
     * Every user gets exactly one wallet, created lazily on first access.
     */
    public function getOrCreateWallet(User $user): Wallet
    {
        return Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['real_balance' => 0, 'virtual_balance' => 0, 'currency' => 'NGN']
        );
    }

    /**
     * Credit the user's real wallet balance (e.g., after deposit from payment gateway).
     */
    public function creditWallet(
        User $user,
        float $amount,
        string $description,
        array $metadata = []
    ): Transaction {
        return DB::transaction(function () use ($user, $amount, $description, $metadata) {
            $wallet = $this->getOrCreateWallet($user);

            $wallet->increment('real_balance', $amount);
            $wallet->refresh();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::Deposit,
                'category' => 'Wallet Funding',
                'amount' => $amount,
                'balance_after' => $wallet->real_balance,
                'description' => $description,
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('DEP'),
                'metadata' => $metadata,
            ]);
        });
    }

    /**
     * Debit the user's real wallet balance (e.g., withdrawal to bank).
     *
     * @throws \InvalidArgumentException if insufficient balance
     */
    public function debitWallet(
        User $user,
        float $amount,
        string $description,
        array $metadata = []
    ): Transaction {
        return DB::transaction(function () use ($user, $amount, $description, $metadata) {
            $wallet = $this->getOrCreateWallet($user);

            if ((float) $wallet->real_balance < $amount) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance. Available: ₦' . number_format($wallet->real_balance, 2)
                );
            }

            $wallet->decrement('real_balance', $amount);
            $wallet->refresh();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::Withdrawal,
                'category' => 'Bank Withdrawal',
                'amount' => -$amount,
                'balance_after' => $wallet->real_balance,
                'description' => $description,
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('WDR'),
                'metadata' => $metadata,
            ]);
        });
    }

    /**
     * Get paginated transaction history for a user.
     */
    public function getTransactions(User $user, array $filters = [], int $perPage = 15)
    {
        $query = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['dateFrom'])) {
            $query->where('created_at', '>=', $filters['dateFrom']);
        }

        if (! empty($filters['dateTo'])) {
            $query->where('created_at', '<=', $filters['dateTo'] . ' 23:59:59');
        }

        return $query->paginate($perPage);
    }

    private function generateReference(string $typePrefix): string
    {
        return 'PV-' . $typePrefix . '-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }
}
