<?php

namespace App\Services;

use App\Enums\ContributionStatus;
use App\Enums\GroupSavingsMode;
use App\Enums\GroupSavingsStatus;
use App\Enums\PayoutStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\GroupContribution;
use App\Models\GroupMember;
use App\Models\GroupPayout;
use App\Models\GroupSavings;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class GroupSavingsService
{
    public function __construct(
        private WalletService $walletService,
    ) {}

    /**
     * Create a new peer-to-peer group savings.
     */
    public function createGroup(User $creator, array $data): GroupSavings
    {
        return DB::transaction(function () use ($creator, $data) {
            $totalRounds = $data['total_slots'];

            $group = GroupSavings::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'created_by_id' => $creator->id,
                'contribution_amount' => $data['contribution_amount'],
                'frequency' => $data['frequency'],
                'total_slots' => $data['total_slots'],
                'filled_slots' => 1,
                'current_round' => 0,
                'total_rounds' => $totalRounds,
                'status' => GroupSavingsStatus::Pending,
                'start_date' => $data['start_date'] ?? null,
                'mode' => GroupSavingsMode::Peer,
                'freeze_payout_until_percent' => $data['freeze_payout_until_percent'] ?? null,
            ]);

            // Creator automatically joins as position 1
            GroupMember::create([
                'group_savings_id' => $group->id,
                'user_id' => $creator->id,
                'position' => 1,
                'total_contributed' => 0,
                'joined_at' => now(),
            ]);

            return $group->load('members.user');
        });
    }

    /**
     * Create a vendor-led ajo linked to a product/listing.
     */
    public function createVendorAjo(User $vendor, Listing $listing, array $data): GroupSavings
    {
        if (!$vendor->isVendor()) {
            throw new \InvalidArgumentException('Only vendors can create vendor ajo groups.');
        }

        if ($listing->vendor_id !== $vendor->id) {
            throw new \InvalidArgumentException('You can only create ajo for your own listings.');
        }

        return DB::transaction(function () use ($vendor, $listing, $data) {
            $totalSlots = $data['total_slots'];
            $totalRounds = $totalSlots;
            $productPrice = (float) $listing->price;
            $contributionAmount = round($productPrice / $totalRounds, 2);
            $payoutStartPercent = $data['payout_start_percent'] ?? 40;

            $group = GroupSavings::create([
                'name' => $data['name'] ?? "Ajo for {$listing->title}",
                'description' => $data['description'] ?? "Vendor ajo linked to {$listing->title}. Join to own this item through group savings!",
                'created_by_id' => $vendor->id,
                'contribution_amount' => $contributionAmount,
                'frequency' => $data['frequency'],
                'total_slots' => $totalSlots,
                'filled_slots' => 0,
                'current_round' => 0,
                'total_rounds' => $totalRounds,
                'status' => GroupSavingsStatus::Pending,
                'start_date' => $data['start_date'] ?? null,
                'mode' => GroupSavingsMode::Vendor,
                'vendor_id' => $vendor->id,
                'listing_id' => $listing->id,
                'product_price' => $productPrice,
                'payout_start_percent' => $payoutStartPercent,
            ]);

            return $group->load(['listing', 'vendor']);
        });
    }

    /**
     * Join an existing group.
     */
    public function joinGroup(User $user, GroupSavings $group): GroupMember
    {
        if ($group->isFull()) {
            throw new \InvalidArgumentException('This group is already full.');
        }

        if ($group->hasMember($user->id)) {
            throw new \InvalidArgumentException('You are already a member of this group.');
        }

        if ($group->status === GroupSavingsStatus::Cancelled || $group->status === GroupSavingsStatus::Completed) {
            throw new \InvalidArgumentException('This group is no longer accepting members.');
        }

        // Vendor cannot join their own vendor ajo
        if ($group->isVendorMode() && $group->vendor_id === $user->id) {
            throw new \InvalidArgumentException('As the vendor, you manage this ajo but cannot join as a member.');
        }

        return DB::transaction(function () use ($user, $group) {
            $nextPosition = $group->filled_slots + 1;

            $member = GroupMember::create([
                'group_savings_id' => $group->id,
                'user_id' => $user->id,
                'position' => $nextPosition,
                'total_contributed' => 0,
                'joined_at' => now(),
            ]);

            $group->increment('filled_slots');

            // If group is now full and has a start date, activate it
            $group->refresh();
            if ($group->isFull() && $group->start_date) {
                $this->activateGroup($group);
            }

            return $member->load('user');
        });
    }

    /**
     * Activate a group (start collecting contributions).
     */
    public function activateGroup(GroupSavings $group): void
    {
        if ($group->isActive()) {
            return;
        }

        DB::transaction(function () use ($group) {
            $group->update([
                'status' => GroupSavingsStatus::Active,
                'current_round' => 1,
                'start_date' => $group->start_date ?? now()->toDateString(),
            ]);

            // Create payout schedule
            $this->generatePayoutSchedule($group);
        });
    }

    /**
     * Generate payout schedule for all members.
     * - Peer mode: payouts start at round 1 (or freeze threshold)
     * - Vendor mode: payouts start after payout_start_percent (default 40%)
     */
    private function generatePayoutSchedule(GroupSavings $group): void
    {
        $members = $group->members()->orderBy('position')->get();
        $startDate = Carbon::parse($group->start_date);
        $payoutStartRound = $group->payoutStartRound();
        $poolSize = $group->poolSize();

        foreach ($members as $index => $member) {
            $payoutRound = $payoutStartRound + $index;

            // Skip if payout round exceeds total rounds
            if ($payoutRound > $group->total_rounds) {
                continue;
            }

            $expectedDate = $this->calculatePayoutDate($startDate, $payoutRound, $group->frequency->value);

            $payoutData = [
                'group_savings_id' => $group->id,
                'group_member_id' => $member->id,
                'round' => $payoutRound,
                'amount' => $poolSize,
                'status' => PayoutStatus::Pending,
                'expected_date' => $expectedDate,
            ];

            if ($group->isVendorMode()) {
                // Pre-calculate real/virtual split for vendor mode
                $memberContributedAtPayout = (float) $group->contribution_amount * $payoutRound;
                $realAmount = min($memberContributedAtPayout, $poolSize);
                $virtualAmount = $poolSize - $realAmount;

                $payoutData['real_amount'] = $realAmount;
                $payoutData['virtual_amount'] = $virtualAmount;
            } else {
                // Peer mode: full payout goes to real wallet
                $payoutData['real_amount'] = $poolSize;
                $payoutData['virtual_amount'] = 0;
            }

            GroupPayout::create($payoutData);
        }

        // Set next payout date
        $firstPayout = $group->payouts()->orderBy('round')->first();
        if ($firstPayout) {
            $group->update(['next_payout_date' => $firstPayout->expected_date]);
        }
    }

    /**
     * Make a contribution for the current round.
     */
    public function makeContribution(User $user, GroupSavings $group): GroupContribution
    {
        if (!$group->isActive()) {
            throw new \InvalidArgumentException('This group is not active.');
        }

        $member = $group->getMember($user->id);
        if (!$member) {
            throw new \InvalidArgumentException('You are not a member of this group.');
        }

        if ($member->hasPaidRound($group->current_round)) {
            throw new \InvalidArgumentException('You have already paid for this round.');
        }

        $amount = (float) $group->contribution_amount;

        return DB::transaction(function () use ($user, $group, $member, $amount) {
            $wallet = $this->walletService->getOrCreateWallet($user);

            if ((float) $wallet->real_balance < $amount) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance. Available: ₦' . number_format($wallet->real_balance, 2)
                );
            }

            // Debit real wallet
            $wallet->decrement('real_balance', $amount);

            // In vendor mode: if member has virtual balance (post-payout debt),
            // reduce their virtual_balance by the contribution amount
            if ($group->isVendorMode() && (float) $wallet->virtual_balance > 0) {
                $debtReduction = min($amount, (float) $wallet->virtual_balance);
                $wallet->decrement('virtual_balance', $debtReduction);
            }

            $wallet->refresh();

            $txn = Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::GroupContribution,
                'category' => 'Group Savings',
                'amount' => -$amount,
                'balance_after' => $wallet->real_balance,
                'description' => "Contribution to {$group->name} — Round {$group->current_round}",
                'status' => TransactionStatus::Completed,
                'reference' => 'PV-GCN-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
                'metadata' => [
                    'group_id' => $group->id,
                    'round' => $group->current_round,
                    'mode' => $group->mode->value,
                ],
            ]);

            $contribution = GroupContribution::create([
                'group_savings_id' => $group->id,
                'group_member_id' => $member->id,
                'round' => $group->current_round,
                'amount' => $amount,
                'status' => ContributionStatus::Paid,
                'paid_at' => now(),
                'transaction_id' => $txn->id,
            ]);

            $member->increment('total_contributed', $amount);

            // Check if all members have paid for this round
            $this->checkRoundCompletion($group);

            return $contribution;
        });
    }

    /**
     * Check if all members have paid for the current round.
     * If so, process payout and advance to next round.
     */
    private function checkRoundCompletion(GroupSavings $group): void
    {
        $paidCount = GroupContribution::where('group_savings_id', $group->id)
            ->where('round', $group->current_round)
            ->where('status', ContributionStatus::Paid)
            ->count();

        if ($paidCount >= $group->filled_slots) {
            // Process payout for this round if applicable
            $payout = $group->payouts()
                ->where('round', $group->current_round)
                ->first();

            if ($payout && !$payout->isCompleted()) {
                $this->processPayout($group, $payout);
            }

            // Advance to next round
            $nextRound = $group->current_round + 1;
            if ($nextRound > $group->total_rounds) {
                $group->update([
                    'status' => GroupSavingsStatus::Completed,
                    'current_round' => $group->total_rounds,
                ]);
            } else {
                $nextPayout = $group->payouts()->where('round', '>=', $nextRound)->orderBy('round')->first();
                $group->update([
                    'current_round' => $nextRound,
                    'next_payout_date' => $nextPayout?->expected_date,
                ]);
            }
        }
    }

    /**
     * Process a payout to the designated member.
     * Delegates to mode-specific logic.
     */
    private function processPayout(GroupSavings $group, GroupPayout $payout): void
    {
        if ($group->isVendorMode()) {
            $this->processVendorPayout($group, $payout);
        } else {
            $this->processPeerPayout($group, $payout);
        }
    }

    /**
     * Peer mode: full payout goes to real wallet.
     */
    private function processPeerPayout(GroupSavings $group, GroupPayout $payout): void
    {
        $member = $payout->member;
        $user = $member->user;
        $amount = (float) $payout->amount;

        $wallet = $this->walletService->getOrCreateWallet($user);
        $wallet->increment('real_balance', $amount);
        $wallet->refresh();

        $txn = Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'type' => TransactionType::GroupPayout,
            'category' => 'Group Savings',
            'amount' => $amount,
            'balance_after' => $wallet->real_balance,
            'description' => "Payout from {$group->name} — Round {$payout->round}",
            'status' => TransactionStatus::Completed,
            'reference' => 'PV-GPO-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'metadata' => [
                'group_id' => $group->id,
                'round' => $payout->round,
                'mode' => 'peer',
            ],
        ]);

        $payout->update([
            'status' => PayoutStatus::Completed,
            'paid_at' => now(),
            'transaction_id' => $txn->id,
            'real_amount' => $amount,
            'virtual_amount' => 0,
        ]);
    }

    /**
     * Vendor mode: split payout between real and virtual wallet.
     * Real wallet gets what the member actually contributed, virtual gets the remainder.
     */
    private function processVendorPayout(GroupSavings $group, GroupPayout $payout): void
    {
        $member = $payout->member;
        $user = $member->user;
        $poolSize = (float) $payout->amount;

        // Calculate actual split based on member's contributions at this point
        $memberContributed = (float) $member->total_contributed;
        $realAmount = min($memberContributed, $poolSize);
        $virtualAmount = $poolSize - $realAmount;

        $wallet = $this->walletService->getOrCreateWallet($user);

        // Credit real balance
        if ($realAmount > 0) {
            $wallet->increment('real_balance', $realAmount);
        }

        // Credit virtual balance
        if ($virtualAmount > 0) {
            $wallet->increment('virtual_balance', $virtualAmount);
        }

        $wallet->refresh();

        $txn = Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'type' => TransactionType::GroupPayout,
            'category' => 'Group Savings (Vendor Ajo)',
            'amount' => $poolSize,
            'balance_after' => $wallet->real_balance,
            'description' => "Vendor Ajo payout from {$group->name} — Round {$payout->round} (Real: ₦" . number_format($realAmount, 2) . ", Virtual: ₦" . number_format($virtualAmount, 2) . ")",
            'status' => TransactionStatus::Completed,
            'reference' => 'PV-VGP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'metadata' => [
                'group_id' => $group->id,
                'round' => $payout->round,
                'mode' => 'vendor',
                'real_amount' => $realAmount,
                'virtual_amount' => $virtualAmount,
                'listing_id' => $group->listing_id,
            ],
        ]);

        $payout->update([
            'status' => PayoutStatus::Completed,
            'paid_at' => now(),
            'transaction_id' => $txn->id,
            'real_amount' => $realAmount,
            'virtual_amount' => $virtualAmount,
        ]);
    }

    /**
     * Get groups for a user (where they are a member).
     */
    public function getUserGroups(User $user)
    {
        $memberGroupIds = GroupMember::where('user_id', $user->id)
            ->whereNull('left_at')
            ->pluck('group_savings_id');

        return GroupSavings::whereIn('id', $memberGroupIds)
            ->with(['members.user', 'listing', 'vendor'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get vendor's ajo groups.
     */
    public function getVendorAjoGroups(User $vendor)
    {
        return GroupSavings::where('vendor_id', $vendor->id)
            ->vendorMode()
            ->with(['members.user', 'listing'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get detailed view of a group.
     */
    public function getGroupDetail(GroupSavings $group): array
    {
        $group->load(['members.user', 'payouts.member.user', 'contributions', 'listing', 'vendor']);

        $members = $group->members->map(function ($member) use ($group) {
            $payoutForMember = $group->payouts->firstWhere('group_member_id', $member->id);
            return [
                'userId' => $member->user_id,
                'name' => $member->displayName(),
                'position' => $member->position,
                'hasPaidCurrentRound' => $member->hasPaidRound($group->current_round),
                'totalContributed' => (float) $member->total_contributed,
                'joinedAt' => $member->joined_at->toISOString(),
                'isCurrentTurn' => $payoutForMember && $payoutForMember->round === $group->current_round && !$payoutForMember->isCompleted(),
            ];
        });

        $payoutSchedule = $group->payouts->map(function ($payout) use ($group) {
            $status = 'upcoming';
            if ($payout->isCompleted()) {
                $status = 'completed';
            } elseif ($payout->round === $group->current_round) {
                $status = 'current';
            }

            return [
                'round' => $payout->round,
                'recipientName' => $payout->member->displayName(),
                'date' => $payout->expected_date?->toDateString(),
                'amount' => (float) $payout->amount,
                'realAmount' => $payout->real_amount !== null ? (float) $payout->real_amount : null,
                'virtualAmount' => $payout->virtual_amount !== null ? (float) $payout->virtual_amount : null,
                'status' => $status,
            ];
        });

        $recentActivity = $group->contributions()
            ->with('member.user')
            ->where('status', ContributionStatus::Paid)
            ->orderBy('paid_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($contribution) {
                return [
                    'id' => $contribution->id,
                    'memberName' => $contribution->member->displayName(),
                    'action' => 'Made round ' . $contribution->round . ' contribution of ₦' . number_format($contribution->amount, 0),
                    'timestamp' => $contribution->paid_at->toISOString(),
                ];
            });

        $result = [
            'id' => $group->id,
            'name' => $group->name,
            'description' => $group->description,
            'contributionAmount' => (float) $group->contribution_amount,
            'frequency' => ucfirst($group->frequency->value),
            'totalSlots' => $group->total_slots,
            'filledSlots' => $group->filled_slots,
            'currentRound' => $group->current_round,
            'totalRounds' => $group->total_rounds,
            'poolSize' => $group->poolSize(),
            'status' => $group->status->value,
            'startDate' => $group->start_date?->toDateString(),
            'nextPayoutDate' => $group->next_payout_date?->toDateString(),
            'mode' => $group->mode->value,
            'payoutStartRound' => $group->payoutStartRound(),
            'vendorId' => $group->vendor_id,
            'listingId' => $group->listing_id,
            'productPrice' => $group->product_price ? (float) $group->product_price : null,
            'payoutStartPercent' => $group->payout_start_percent ? (float) $group->payout_start_percent : null,
            'freezePayoutUntilPercent' => $group->freeze_payout_until_percent ? (float) $group->freeze_payout_until_percent : null,
            'listing' => $group->listing ? [
                'id' => $group->listing->id,
                'title' => $group->listing->title,
                'price' => (float) $group->listing->price,
                'category' => $group->listing->category->value,
                'primaryImage' => $group->listing->primary_image,
            ] : null,
            'vendor' => $group->vendor ? [
                'id' => $group->vendor->id,
                'name' => $group->vendor->first_name . ' ' . $group->vendor->last_name,
            ] : null,
            'members' => $members,
            'payoutSchedule' => $payoutSchedule,
            'recentActivity' => $recentActivity,
        ];

        return $result;
    }

    /**
     * List all available groups (for browsing/joining).
     */
    public function listGroups(array $filters = [])
    {
        $query = GroupSavings::with(['members.user', 'creator', 'listing', 'vendor'])
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['mode'])) {
            $query->where('mode', $filters['mode']);
        }

        if (!empty($filters['hasSlots'])) {
            $query->hasSlots();
        }

        return $query->paginate($filters['perPage'] ?? 15);
    }

    private function calculatePayoutDate(Carbon $startDate, int $round, string $frequency): string
    {
        return match ($frequency) {
            'daily' => $startDate->copy()->addDays($round - 1)->toDateString(),
            'weekly' => $startDate->copy()->addWeeks($round - 1)->toDateString(),
            'biweekly' => $startDate->copy()->addWeeks(($round - 1) * 2)->toDateString(),
            default => $startDate->copy()->addMonths($round - 1)->toDateString(),
        };
    }
}
