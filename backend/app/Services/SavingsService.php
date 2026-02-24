<?php

namespace App\Services;

use App\Enums\SavingsFrequency;
use App\Enums\SavingsProductType;
use App\Enums\SavingsStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\InterestAccrual;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SavingsService
{
    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // CREATE PLAN
    // ────────────────────────────────────────────────

    public function createPlan(User $user, array $data): SavingsPlan
    {
        $productType = SavingsProductType::from($data['productType']);
        $hasInterest = $data['hasInterest'] ?? true;

        $config = $this->getProductConfig($productType, $data, $hasInterest);

        return SavingsPlan::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'product_type' => $productType,
            'target_amount' => $data['targetAmount'],
            'current_amount' => 0,
            'start_date' => $data['startDate'],
            'end_date' => $data['endDate'] ?? null,
            'frequency' => SavingsFrequency::from($data['frequency']),
            'contribution_amount' => $data['contributionAmount'],
            'status' => SavingsStatus::Active,
            'linked_asset_id' => $data['linkedAssetId'] ?? null,
            'has_interest' => $hasInterest,
            'interest_rate' => $config['interestRate'],
            'accrued_interest' => 0,
            'is_fixed_term' => $config['isFixedTerm'],
            'early_withdrawal_penalty_percent' => $config['penaltyPercent'],
            'last_interest_accrual_date' => null,
        ]);
    }

    private function getProductConfig(
        SavingsProductType $type,
        array $data,
        bool $hasInterest
    ): array {
        return match ($type) {
            SavingsProductType::PenniSave => [
                'interestRate' => $hasInterest ? 5.00 : null,
                'isFixedTerm' => false,
                'penaltyPercent' => $hasInterest ? 2.00 : 0.00,
            ],
            SavingsProductType::PenniLock => [
                'interestRate' => $hasInterest
                    ? $this->calculatePenniLockRate($data['startDate'], $data['endDate'])
                    : null,
                'isFixedTerm' => true,
                'penaltyPercent' => $this->calculatePenniLockPenalty($data['startDate'], $data['endDate']),
            ],
            SavingsProductType::TargetSave => [
                'interestRate' => null,
                'isFixedTerm' => false,
                'penaltyPercent' => 0.00,
            ],
            SavingsProductType::PenniAjo => [
                'interestRate' => null,
                'isFixedTerm' => false,
                'penaltyPercent' => 0.00,
            ],
        };
    }

    private function calculatePenniLockRate(string $startDate, string $endDate): float
    {
        $days = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate));

        return match (true) {
            $days >= 365 => 15.00,
            $days >= 180 => 14.00,
            $days >= 90  => 12.00,
            $days >= 60  => 10.00,
            $days >= 30  => 8.00,
            default      => 8.00,
        };
    }

    private function calculatePenniLockPenalty(string $startDate, string $endDate): float
    {
        $days = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate));

        return match (true) {
            $days >= 180 => 10.00,
            $days >= 90  => 7.00,
            default      => 5.00,
        };
    }

    // ────────────────────────────────────────────────
    // DEPOSIT INTO PLAN (CONTRIBUTION)
    // ────────────────────────────────────────────────

    public function deposit(SavingsPlan $plan, float $amount, string $source = 'wallet'): Transaction
    {
        if ($plan->status !== SavingsStatus::Active) {
            throw new \InvalidArgumentException('Cannot deposit into a non-active savings plan.');
        }

        if ($plan->isPenniLock() && $plan->isMatured()) {
            throw new \InvalidArgumentException('This PenniLock plan has matured. Withdraw your funds instead.');
        }

        return DB::transaction(function () use ($plan, $amount, $source) {
            $wallet = $this->walletService->getOrCreateWallet($plan->user);

            if ($source === 'wallet') {
                if ((float) $wallet->real_balance < $amount) {
                    throw new \InvalidArgumentException(
                        'Insufficient wallet balance. Available: ' . number_format($wallet->real_balance, 2)
                    );
                }

                $wallet->decrement('real_balance', $amount);
                $wallet->refresh();
            }

            $plan->increment('current_amount', $amount);
            $plan->refresh();

            if ($plan->last_interest_accrual_date === null && $plan->has_interest) {
                $plan->update(['last_interest_accrual_date' => now()->toDateString()]);
            }

            if ((float) $plan->current_amount >= (float) $plan->target_amount) {
                $plan->update(['status' => SavingsStatus::Completed]);
            }

            $transaction = Transaction::create([
                'user_id' => $plan->user_id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::SavingsContribution,
                'category' => 'Personal Savings',
                'amount' => -$amount,
                'balance_after' => $wallet->real_balance,
                'description' => "{$plan->name} — {$plan->product_type->value} contribution",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('SAV'),
                'transactionable_type' => SavingsPlan::class,
                'transactionable_id' => $plan->id,
                'metadata' => ['source' => $source],
            ]);

            return $transaction;
        });
    }

    // ────────────────────────────────────────────────
    // WITHDRAW FROM PLAN
    // ────────────────────────────────────────────────

    public function withdraw(SavingsPlan $plan, float $amount, bool $confirmPenalty = false): array
    {
        if ($plan->status !== SavingsStatus::Active && $plan->status !== SavingsStatus::Completed) {
            throw new \InvalidArgumentException('Cannot withdraw from this plan in its current status.');
        }

        if ($amount > (float) $plan->current_amount) {
            throw new \InvalidArgumentException(
                'Withdrawal amount exceeds plan balance. Available: '
                . number_format($plan->current_amount, 2)
            );
        }

        $penaltyPercent = $this->getEffectivePenaltyPercent($plan);
        $penaltyAmount = 0.00;

        if ($penaltyPercent > 0) {
            $penaltyAmount = round($amount * ($penaltyPercent / 100), 2);

            if (! $confirmPenalty) {
                throw new \InvalidArgumentException(
                    "Early withdrawal penalty of {$penaltyPercent}% applies. "
                    . "Penalty amount: " . number_format($penaltyAmount, 2) . " Naira. "
                    . "Net amount you will receive: " . number_format($amount - $penaltyAmount, 2) . " Naira. "
                    . "Set confirmPenalty to true to proceed."
                );
            }
        }

        $netAmount = $amount - $penaltyAmount;

        return DB::transaction(function () use ($plan, $amount, $penaltyAmount, $netAmount, $penaltyPercent) {
            $wallet = $this->walletService->getOrCreateWallet($plan->user);

            $plan->decrement('current_amount', $amount);

            $wallet->increment('real_balance', $netAmount);
            $wallet->refresh();

            if ($plan->isPenniLock() && ! $plan->isMatured()) {
                $plan->update([
                    'broken_at' => now(),
                    'status' => SavingsStatus::Cancelled,
                ]);
            }

            if ((float) $plan->fresh()->current_amount <= 0 && ! $plan->isPenniLock()) {
                $plan->update(['status' => SavingsStatus::Completed]);
            }

            $transaction = Transaction::create([
                'user_id' => $plan->user_id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::SavingsPayout,
                'category' => 'Savings Withdrawal',
                'amount' => $netAmount,
                'balance_after' => $wallet->real_balance,
                'description' => "{$plan->name} — withdrawal"
                    . ($penaltyAmount > 0 ? " (penalty: ₦" . number_format($penaltyAmount, 2) . ")" : ''),
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('SPO'),
                'transactionable_type' => SavingsPlan::class,
                'transactionable_id' => $plan->id,
                'metadata' => [
                    'gross_amount' => $amount,
                    'penalty_percent' => $penaltyPercent,
                    'penalty_amount' => $penaltyAmount,
                    'net_amount' => $netAmount,
                ],
            ]);

            if ($penaltyAmount > 0) {
                Transaction::create([
                    'user_id' => $plan->user_id,
                    'wallet_id' => $wallet->id,
                    'type' => TransactionType::Penalty,
                    'category' => 'Early Withdrawal Penalty',
                    'amount' => -$penaltyAmount,
                    'balance_after' => $wallet->real_balance,
                    'description' => "{$plan->name} — {$penaltyPercent}% early withdrawal penalty",
                    'status' => TransactionStatus::Completed,
                    'reference' => $this->generateReference('PEN'),
                    'transactionable_type' => SavingsPlan::class,
                    'transactionable_id' => $plan->id,
                ]);
            }

            return [
                'transaction' => $transaction,
                'penaltyAmount' => $penaltyAmount,
                'netAmount' => $netAmount,
            ];
        });
    }

    private function getEffectivePenaltyPercent(SavingsPlan $plan): float
    {
        if ($plan->status === SavingsStatus::Completed) {
            return 0.00;
        }

        if ($plan->isPenniLock() && $plan->isMatured()) {
            return 0.00;
        }

        if ($plan->isPenniSave() && ! $plan->has_interest) {
            return 0.00;
        }

        return (float) $plan->early_withdrawal_penalty_percent;
    }

    // ────────────────────────────────────────────────
    // PAUSE / RESUME / CANCEL
    // ────────────────────────────────────────────────

    public function pause(SavingsPlan $plan): SavingsPlan
    {
        if ($plan->status !== SavingsStatus::Active) {
            throw new \InvalidArgumentException('Only active plans can be paused.');
        }

        if ($plan->isPenniLock()) {
            throw new \InvalidArgumentException('PenniLock plans cannot be paused. Withdraw to break the lock.');
        }

        $plan->update(['status' => SavingsStatus::Paused]);

        return $plan->fresh();
    }

    public function resume(SavingsPlan $plan): SavingsPlan
    {
        if ($plan->status !== SavingsStatus::Paused) {
            throw new \InvalidArgumentException('Only paused plans can be resumed.');
        }

        $plan->update([
            'status' => SavingsStatus::Active,
            'last_interest_accrual_date' => now()->toDateString(),
        ]);

        return $plan->fresh();
    }

    public function cancel(SavingsPlan $plan): ?array
    {
        if ($plan->status === SavingsStatus::Cancelled) {
            throw new \InvalidArgumentException('Plan is already cancelled.');
        }

        $result = null;

        if ((float) $plan->current_amount > 0) {
            $result = $this->withdraw($plan, (float) $plan->current_amount, confirmPenalty: true);
        }

        $plan->update(['status' => SavingsStatus::Cancelled]);

        return $result;
    }

    // ────────────────────────────────────────────────
    // INTEREST CALCULATION (DAILY ACCRUAL)
    // ────────────────────────────────────────────────

    public function accrueInterest(SavingsPlan $plan, Carbon $forDate): ?InterestAccrual
    {
        if ($plan->status !== SavingsStatus::Active) {
            return null;
        }
        if (! $plan->has_interest || $plan->interest_rate === null) {
            return null;
        }
        if ((float) $plan->current_amount <= 0) {
            return null;
        }

        $alreadyAccrued = InterestAccrual::where('savings_plan_id', $plan->id)
            ->where('accrual_date', $forDate->toDateString())
            ->exists();

        if ($alreadyAccrued) {
            return null;
        }

        $principal = (float) $plan->current_amount;
        $annualRate = (float) $plan->interest_rate;
        $dailyAmount = round($principal * ($annualRate / 100) / 365, 2);

        if ($dailyAmount <= 0) {
            return null;
        }

        return DB::transaction(function () use ($plan, $forDate, $principal, $annualRate, $dailyAmount) {
            $newAccruedInterest = (float) $plan->accrued_interest + $dailyAmount;

            $plan->update([
                'accrued_interest' => $newAccruedInterest,
                'last_interest_accrual_date' => $forDate->toDateString(),
            ]);

            $accrual = InterestAccrual::create([
                'savings_plan_id' => $plan->id,
                'accrual_date' => $forDate->toDateString(),
                'principal' => $principal,
                'annual_rate' => $annualRate,
                'daily_amount' => $dailyAmount,
                'cumulative_interest' => $newAccruedInterest,
            ]);

            return $accrual;
        });
    }

    public function accrueInterestForAllPlans(?Carbon $forDate = null): array
    {
        $forDate = $forDate ?? Carbon::today();

        $plans = SavingsPlan::active()
            ->withInterest()
            ->where('current_amount', '>', 0)
            ->cursor();

        $processed = 0;
        $accrued = 0;
        $totalInterest = 0.00;

        foreach ($plans as $plan) {
            $processed++;
            $accrual = $this->accrueInterest($plan, $forDate);

            if ($accrual) {
                $accrued++;
                $totalInterest += (float) $accrual->daily_amount;
            }
        }

        return [
            'processed' => $processed,
            'accrued' => $accrued,
            'total_interest' => round($totalInterest, 2),
        ];
    }

    public function matureEligiblePlans(): int
    {
        $plans = SavingsPlan::active()
            ->where('is_fixed_term', true)
            ->whereNotNull('end_date')
            ->where('end_date', '<=', Carbon::today())
            ->whereNull('matured_at')
            ->get();

        $count = 0;

        foreach ($plans as $plan) {
            $plan->update([
                'matured_at' => now(),
                'status' => SavingsStatus::Completed,
            ]);

            if ((float) $plan->accrued_interest > 0) {
                DB::transaction(function () use ($plan) {
                    $plan->increment('current_amount', (float) $plan->accrued_interest);

                    $wallet = $this->walletService->getOrCreateWallet($plan->user);

                    Transaction::create([
                        'user_id' => $plan->user_id,
                        'wallet_id' => $wallet->id,
                        'type' => TransactionType::SavingsInterest,
                        'category' => 'Interest Payout',
                        'amount' => (float) $plan->accrued_interest,
                        'balance_after' => $wallet->real_balance,
                        'description' => "{$plan->name} — maturity interest payout",
                        'status' => TransactionStatus::Completed,
                        'reference' => $this->generateReference('INT'),
                        'transactionable_type' => SavingsPlan::class,
                        'transactionable_id' => $plan->id,
                    ]);
                });
            }

            $count++;
        }

        return $count;
    }

    // ────────────────────────────────────────────────
    // HELPERS
    // ────────────────────────────────────────────────

    private function generateReference(string $typePrefix): string
    {
        return 'PV-' . $typePrefix . '-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }

    public function getUserSavingsSummary(User $user): array
    {
        $plans = SavingsPlan::where('user_id', $user->id)->get();

        return [
            'totalSavings' => $plans->where('status', SavingsStatus::Active)->sum('current_amount'),
            'totalAccruedInterest' => $plans->sum('accrued_interest'),
            'activePlans' => $plans->where('status', SavingsStatus::Active)->count(),
            'completedPlans' => $plans->where('status', SavingsStatus::Completed)->count(),
            'savingsBreakdown' => [
                'pennisave' => $plans
                    ->where('product_type', SavingsProductType::PenniSave)
                    ->where('status', SavingsStatus::Active)
                    ->sum('current_amount'),
                'pennilock' => $plans
                    ->where('product_type', SavingsProductType::PenniLock)
                    ->where('status', SavingsStatus::Active)
                    ->sum('current_amount'),
                'targetsave' => $plans
                    ->where('product_type', SavingsProductType::TargetSave)
                    ->where('status', SavingsStatus::Active)
                    ->sum('current_amount'),
                'penniajo' => $plans
                    ->where('product_type', SavingsProductType::PenniAjo)
                    ->where('status', SavingsStatus::Active)
                    ->sum('current_amount'),
            ],
        ];
    }
}
