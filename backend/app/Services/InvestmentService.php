<?php

namespace App\Services;

use App\Enums\InvestmentStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserInvestmentStatus;
use App\Models\CrowdInvestment;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserInvestment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvestmentService
{
    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // BROWSE / SEARCH INVESTMENTS
    // ────────────────────────────────────────────────

    public function getInvestments(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CrowdInvestment::with('vendor:id,first_name,last_name');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->whereIn('status', [
                InvestmentStatus::Open,
                InvestmentStatus::InProgress,
            ]);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (! empty($filters['riskLevel'])) {
            $query->where('risk_level', $filters['riskLevel']);
        }

        if (! empty($filters['minReturn'])) {
            $query->where('expected_roi_percent', '>=', (float) $filters['minReturn']);
        }
        if (! empty($filters['maxReturn'])) {
            $query->where('expected_roi_percent', '<=', (float) $filters['maxReturn']);
        }

        if (! empty($filters['minInvestment'])) {
            $query->where('minimum_investment', '<=', (float) $filters['minInvestment']);
        }

        if (! empty($filters['location'])) {
            $query->where('location', 'LIKE', '%' . $filters['location'] . '%');
        }

        if (! empty($filters['vendorId'])) {
            $query->where('vendor_id', $filters['vendorId']);
        }

        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'return_desc' => $query->orderBy('expected_roi_percent', 'desc'),
            'return_asc' => $query->orderBy('expected_roi_percent', 'asc'),
            'target_asc' => $query->orderBy('target_amount', 'asc'),
            'ending_soon' => $query->orderBy('end_date', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        return $query->paginate($perPage);
    }

    public function getInvestmentById(string $id): CrowdInvestment
    {
        return CrowdInvestment::with(['vendor:id,first_name,last_name', 'vendor.vendorProfile'])
            ->withCount('userInvestments')
            ->findOrFail($id);
    }

    // ────────────────────────────────────────────────
    // VENDOR CRUD
    // ────────────────────────────────────────────────

    public function createInvestment(User $vendor, array $data): CrowdInvestment
    {
        $this->assertApprovedVendor($vendor);

        return CrowdInvestment::create([
            'vendor_id' => $vendor->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'images' => $data['images'] ?? [],
            'location' => $data['location'],
            'target_amount' => $data['targetAmount'],
            'current_amount' => 0,
            'minimum_investment' => $data['minimumInvestment'],
            'expected_roi_percent' => $data['expectedRoiPercent'],
            'duration_days' => $data['durationDays'],
            'start_date' => $data['startDate'],
            'end_date' => $data['endDate'],
            'risk_level' => $data['riskLevel'] ?? 'medium',
            'status' => InvestmentStatus::Open,
        ]);
    }

    public function updateInvestment(CrowdInvestment $investment, array $data): CrowdInvestment
    {
        if ($investment->status !== InvestmentStatus::Open) {
            throw new \InvalidArgumentException(
                'Only Open investments can be updated.'
            );
        }

        $hasInvestors = $investment->userInvestments()->count() > 0;

        if ($hasInvestors) {
            $mapping = [
                'title' => 'title',
                'description' => 'description',
                'images' => 'images',
            ];
        } else {
            $mapping = [
                'title' => 'title',
                'description' => 'description',
                'category' => 'category',
                'images' => 'images',
                'location' => 'location',
                'targetAmount' => 'target_amount',
                'minimumInvestment' => 'minimum_investment',
                'expectedRoiPercent' => 'expected_roi_percent',
                'durationDays' => 'duration_days',
                'startDate' => 'start_date',
                'endDate' => 'end_date',
                'riskLevel' => 'risk_level',
            ];
        }

        $updateData = [];
        foreach ($mapping as $camel => $snake) {
            if (array_key_exists($camel, $data)) {
                $updateData[$snake] = $data[$camel];
            }
        }

        $investment->update($updateData);

        return $investment->fresh();
    }

    public function deleteInvestment(CrowdInvestment $investment): CrowdInvestment
    {
        if ($investment->userInvestments()->count() > 0) {
            throw new \InvalidArgumentException(
                'Cannot cancel this investment — investors have already committed funds. '
                . 'Contact support to initiate a refund process.'
            );
        }

        if ($investment->status === InvestmentStatus::Cancelled) {
            throw new \InvalidArgumentException('Investment is already cancelled.');
        }

        $investment->update(['status' => InvestmentStatus::Cancelled]);

        return $investment->fresh();
    }

    // ────────────────────────────────────────────────
    // INVEST FROM WALLET
    // ────────────────────────────────────────────────

    public function investFromWallet(User $user, CrowdInvestment $investment, float $amount): array
    {
        if ($investment->status !== InvestmentStatus::Open) {
            throw new \InvalidArgumentException(
                'This investment is no longer accepting new investors.'
            );
        }

        if ($amount < (float) $investment->minimum_investment) {
            throw new \InvalidArgumentException(
                'Minimum investment is ₦' . number_format($investment->minimum_investment, 2) . '.'
            );
        }

        $remaining = (float) $investment->target_amount - (float) $investment->current_amount;

        if ($amount > $remaining) {
            throw new \InvalidArgumentException(
                'Amount exceeds remaining capacity. Maximum you can invest: ₦'
                . number_format($remaining, 2) . '.'
            );
        }

        if ($investment->vendor_id === $user->id) {
            throw new \InvalidArgumentException('Vendors cannot invest in their own opportunities.');
        }

        return DB::transaction(function () use ($user, $investment, $amount) {
            // 1. Debit user wallet
            $wallet = $this->walletService->getOrCreateWallet($user);

            if ((float) $wallet->real_balance < $amount) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance. Available: ₦' . number_format($wallet->real_balance, 2)
                );
            }

            $wallet->decrement('real_balance', $amount);
            $wallet->refresh();

            // 2. Calculate expected return
            $expectedReturn = round($amount * ((float) $investment->expected_roi_percent / 100), 2);

            // 3. Create UserInvestment
            $userInvestment = UserInvestment::create([
                'user_id' => $user->id,
                'crowd_investment_id' => $investment->id,
                'amount' => $amount,
                'expected_return' => $expectedReturn,
                'actual_return' => null,
                'status' => UserInvestmentStatus::Active,
                'invested_at' => now(),
                'returned_at' => null,
                'reference' => $this->generateReference('INV'),
            ]);

            // 4. Update investment aggregate fields
            $investment->increment('current_amount', $amount);
            $investment->refresh();

            // 5. Check if fully funded
            if ((float) $investment->current_amount >= (float) $investment->target_amount) {
                $investment->update(['status' => InvestmentStatus::Funded]);
            }

            // 6. Create transaction record
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::Investment,
                'category' => 'Crowd Investment',
                'amount' => -$amount,
                'balance_after' => $wallet->real_balance,
                'description' => "Investment: {$investment->title}",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('TXN'),
                'transactionable_type' => UserInvestment::class,
                'transactionable_id' => $userInvestment->id,
                'metadata' => [
                    'crowd_investment_id' => $investment->id,
                    'investment_title' => $investment->title,
                    'expected_roi_percent' => (float) $investment->expected_roi_percent,
                    'expected_return_amount' => $expectedReturn,
                    'end_date' => $investment->end_date->toDateString(),
                ],
            ]);

            $userInvestment->load('crowdInvestment');

            return [
                'userInvestment' => $userInvestment,
                'transaction' => $transaction,
                'investment' => $investment->fresh(),
            ];
        });
    }

    // ────────────────────────────────────────────────
    // USER PORTFOLIO
    // ────────────────────────────────────────────────

    public function getUserInvestments(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = UserInvestment::where('user_id', $user->id)
            ->with('crowdInvestment:id,title,category,images,expected_roi_percent,end_date,status,vendor_id')
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category'])) {
            $query->whereHas('crowdInvestment', function ($q) use ($filters) {
                $q->where('category', $filters['category']);
            });
        }

        return $query->paginate($perPage);
    }

    public function getUserInvestmentSummary(User $user): array
    {
        $investments = UserInvestment::where('user_id', $user->id)
            ->with('crowdInvestment:id,category')
            ->get();

        return [
            'totalInvested' => $investments->where('status', UserInvestmentStatus::Active)->sum('amount'),
            'totalExpectedReturn' => $investments->where('status', UserInvestmentStatus::Active)->sum('expected_return'),
            'totalActualReturn' => $investments->whereNotNull('actual_return')->sum('actual_return'),
            'activeCount' => $investments->where('status', UserInvestmentStatus::Active)->count(),
            'maturedCount' => $investments->where('status', UserInvestmentStatus::Returned)->count(),
            'categoryBreakdown' => [
                'agriculture' => $investments->where('status', UserInvestmentStatus::Active)
                    ->filter(fn ($ui) => $ui->crowdInvestment?->category?->value === 'agriculture')
                    ->sum('amount'),
                'real_estate' => $investments->where('status', UserInvestmentStatus::Active)
                    ->filter(fn ($ui) => $ui->crowdInvestment?->category?->value === 'real_estate')
                    ->sum('amount'),
            ],
        ];
    }

    // ────────────────────────────────────────────────
    // MATURATION (ADMIN / SYSTEM)
    // ────────────────────────────────────────────────

    public function matureInvestment(CrowdInvestment $investment, ?float $actualReturnPercent = null): array
    {
        if (! in_array($investment->status, [InvestmentStatus::Funded, InvestmentStatus::InProgress])) {
            throw new \InvalidArgumentException(
                'Only Funded or In-Progress investments can be matured.'
            );
        }

        $returnPercent = $actualReturnPercent ?? (float) $investment->expected_roi_percent;

        return DB::transaction(function () use ($investment, $returnPercent) {
            $userInvestments = UserInvestment::where('crowd_investment_id', $investment->id)
                ->where('status', UserInvestmentStatus::Active)
                ->get();

            $totalDistributed = 0.00;
            $investorResults = [];

            foreach ($userInvestments as $userInvestment) {
                $principal = (float) $userInvestment->amount;
                $returnAmount = round($principal * ($returnPercent / 100), 2);
                $totalPayout = round($principal + $returnAmount, 2);

                // Credit investor wallet
                $wallet = $this->walletService->getOrCreateWallet($userInvestment->user);
                $wallet->increment('real_balance', $totalPayout);
                $wallet->refresh();

                // Update UserInvestment
                $userInvestment->update([
                    'actual_return' => $returnAmount,
                    'status' => UserInvestmentStatus::Returned,
                    'matured_at' => now(),
                    'returned_at' => now(),
                ]);

                // Create transaction
                Transaction::create([
                    'user_id' => $userInvestment->user_id,
                    'wallet_id' => $wallet->id,
                    'type' => TransactionType::InvestmentReturn,
                    'category' => 'Investment Return',
                    'amount' => $totalPayout,
                    'balance_after' => $wallet->real_balance,
                    'description' => "{$investment->title} — investment matured ({$returnPercent}% return)",
                    'status' => TransactionStatus::Completed,
                    'reference' => $this->generateReference('IRN'),
                    'transactionable_type' => UserInvestment::class,
                    'transactionable_id' => $userInvestment->id,
                    'metadata' => [
                        'crowd_investment_id' => $investment->id,
                        'principal' => $principal,
                        'return_percent' => $returnPercent,
                        'return_amount' => $returnAmount,
                        'total_payout' => $totalPayout,
                    ],
                ]);

                $totalDistributed += $totalPayout;

                $investorResults[] = [
                    'userId' => $userInvestment->user_id,
                    'principal' => $principal,
                    'returnAmount' => $returnAmount,
                    'totalPayout' => $totalPayout,
                ];
            }

            $investment->update(['status' => InvestmentStatus::Matured]);

            return [
                'investment' => $investment->fresh(),
                'returnPercent' => $returnPercent,
                'totalDistributed' => $totalDistributed,
                'investorCount' => count($investorResults),
                'investorResults' => $investorResults,
            ];
        });
    }

    // ────────────────────────────────────────────────
    // VENDOR INVESTMENT MANAGEMENT
    // ────────────────────────────────────────────────

    public function getVendorInvestments(User $vendor, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = CrowdInvestment::where('vendor_id', $vendor->id)
            ->withCount('userInvestments')
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->paginate($perPage);
    }

    // ────────────────────────────────────────────────
    // HELPERS
    // ────────────────────────────────────────────────

    private function assertApprovedVendor(User $vendor): void
    {
        if (! $vendor->isVendor()) {
            throw new \InvalidArgumentException('Only vendors can manage investments.');
        }

        $profile = $vendor->vendorProfile;

        if (! $profile || ! $profile->is_approved) {
            throw new \InvalidArgumentException(
                'Your vendor profile must be approved before you can create investments.'
            );
        }
    }

    private function generateReference(string $typePrefix): string
    {
        return 'PV-' . $typePrefix . '-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }
}
