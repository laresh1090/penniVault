<?php

namespace Database\Seeders;

use App\Enums\ContributionStatus;
use App\Enums\GroupSavingsStatus;
use App\Enums\PayoutStatus;
use App\Enums\SavingsFrequency;
use App\Models\GroupContribution;
use App\Models\GroupMember;
use App\Models\GroupPayout;
use App\Models\GroupSavings;
use App\Models\Listing;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class GroupSavingsSeeder extends Seeder
{
    public function run(): void
    {
        $adebayo = User::where('email', 'adebayo@test.com')->firstOrFail();
        $chidinma = $this->findOrCreateUser('Chidinma', 'Okafor', 'chidinma@test.com', '+234 812 345 6789');
        $funmi = $this->findOrCreateUser('Funmilayo', 'Adeyemo', 'funmi@test.com', '+234 813 456 7890');
        $emeka = User::where('email', 'vendor@test.com')->firstOrFail();
        $kola = $this->findOrCreateUser('Kolawole', 'Bakare', 'kola@test.com', '+234 814 567 8901');
        $amara = $this->findOrCreateUser('Amara', 'Nwosu', 'amara@test.com', '+234 815 678 9012');
        $tunde = $this->findOrCreateUser('Tunde', 'Ogunleye', 'tunde@test.com', '+234 816 789 0123');
        $ngozi = $this->findOrCreateUser('Ngozi', 'Eze', 'ngozi@test.com', '+234 817 890 1234');

        // ── Group 1: HomeOwners Circle (8 members, peer mode, active, round 4 of 8) ──

        $group1 = GroupSavings::create([
            'name' => 'HomeOwners Circle',
            'description' => 'A group of 8 professionals pooling resources towards homeownership. Monthly contributions help members acquire properties faster.',
            'created_by_id' => $adebayo->id,
            'contribution_amount' => 500000.00,
            'frequency' => SavingsFrequency::Monthly,
            'total_slots' => 8,
            'filled_slots' => 8,
            'current_round' => 4,
            'total_rounds' => 8,
            'status' => GroupSavingsStatus::Active,
            'start_date' => '2025-11-01',
            'next_payout_date' => '2026-02-01',
            'mode' => 'peer',
        ]);

        $members1 = [
            [$adebayo, 1], [$chidinma, 2], [$funmi, 3], [$emeka, 4],
            [$kola, 5], [$amara, 6], [$tunde, 7], [$ngozi, 8],
        ];

        $memberModels1 = [];
        foreach ($members1 as [$user, $pos]) {
            $memberModels1[$pos] = GroupMember::create([
                'group_savings_id' => $group1->id,
                'user_id' => $user->id,
                'position' => $pos,
                'total_contributed' => 500000 * min($pos <= 5 ? 4 : 3, 4),
                'joined_at' => Carbon::parse('2025-10-15')->addDays($pos - 1),
            ]);
        }

        // Contributions for rounds 1-3 (all paid)
        foreach (range(1, 3) as $round) {
            foreach ($memberModels1 as $member) {
                GroupContribution::create([
                    'group_savings_id' => $group1->id,
                    'group_member_id' => $member->id,
                    'round' => $round,
                    'amount' => 500000,
                    'status' => ContributionStatus::Paid,
                    'paid_at' => Carbon::parse('2025-11-01')->addMonths($round - 1)->addDays(rand(0, 5)),
                ]);
            }
        }

        // Round 4 contributions (partially paid — 5 of 8 have paid)
        foreach ($memberModels1 as $pos => $member) {
            if ($pos <= 5) {
                GroupContribution::create([
                    'group_savings_id' => $group1->id,
                    'group_member_id' => $member->id,
                    'round' => 4,
                    'amount' => 500000,
                    'status' => ContributionStatus::Paid,
                    'paid_at' => Carbon::parse('2026-02-01')->addDays(rand(0, 10)),
                ]);
            }
        }

        // Payout schedule — peer mode: payouts start at round 1
        $pool = 500000 * 8; // 4,000,000 per payout
        foreach ($memberModels1 as $pos => $member) {
            $payoutRound = $pos; // Position 1 → round 1, position 2 → round 2, etc.

            $status = PayoutStatus::Pending;
            $paidAt = null;
            if ($payoutRound < $group1->current_round) {
                $status = PayoutStatus::Completed;
                $paidAt = Carbon::parse('2025-11-01')->addMonths($payoutRound - 1);
            } elseif ($payoutRound === $group1->current_round) {
                $status = PayoutStatus::Current;
            }

            GroupPayout::create([
                'group_savings_id' => $group1->id,
                'group_member_id' => $member->id,
                'round' => $payoutRound,
                'amount' => $pool,
                'real_amount' => $pool,
                'virtual_amount' => 0,
                'status' => $status,
                'expected_date' => Carbon::parse('2025-11-01')->addMonths($payoutRound - 1),
                'paid_at' => $paidAt,
            ]);
        }

        // ── Group 2: Auto Buyers Club (6 members, peer mode, active, round 2 of 6) ──

        $group2 = GroupSavings::create([
            'name' => 'Auto Buyers Club',
            'description' => 'Save together towards vehicle purchases. Each member receives the pool to buy their dream car.',
            'created_by_id' => $chidinma->id,
            'contribution_amount' => 200000.00,
            'frequency' => SavingsFrequency::Monthly,
            'total_slots' => 6,
            'filled_slots' => 6,
            'current_round' => 2,
            'total_rounds' => 6,
            'status' => GroupSavingsStatus::Active,
            'start_date' => '2025-12-01',
            'next_payout_date' => '2026-01-01',
            'mode' => 'peer',
        ]);

        $members2 = [
            [$chidinma, 1], [$adebayo, 2], [$funmi, 3],
            [$kola, 4], [$amara, 5], [$tunde, 6],
        ];

        $memberModels2 = [];
        foreach ($members2 as [$user, $pos]) {
            $memberModels2[$pos] = GroupMember::create([
                'group_savings_id' => $group2->id,
                'user_id' => $user->id,
                'position' => $pos,
                'total_contributed' => 200000,
                'joined_at' => Carbon::parse('2025-11-20')->addDays($pos - 1),
            ]);
        }

        // Round 1 contributions (all paid)
        foreach ($memberModels2 as $member) {
            GroupContribution::create([
                'group_savings_id' => $group2->id,
                'group_member_id' => $member->id,
                'round' => 1,
                'amount' => 200000,
                'status' => ContributionStatus::Paid,
                'paid_at' => Carbon::parse('2025-12-01')->addDays(rand(0, 5)),
            ]);
        }

        // Round 2 contributions (3 of 6 paid)
        foreach ($memberModels2 as $pos => $member) {
            if ($pos <= 3) {
                GroupContribution::create([
                    'group_savings_id' => $group2->id,
                    'group_member_id' => $member->id,
                    'round' => 2,
                    'amount' => 200000,
                    'status' => ContributionStatus::Paid,
                    'paid_at' => Carbon::parse('2026-01-01')->addDays(rand(0, 10)),
                ]);
            }
        }

        // Payout schedule for group 2 — peer mode: starts at round 1
        $pool2 = 200000 * 6; // 1,200,000
        foreach ($memberModels2 as $pos => $member) {
            $payoutRound = $pos;

            $status = PayoutStatus::Pending;
            $paidAt = null;
            if ($payoutRound < $group2->current_round) {
                $status = PayoutStatus::Completed;
                $paidAt = Carbon::parse('2025-12-01')->addMonths($payoutRound - 1);
            } elseif ($payoutRound === $group2->current_round) {
                $status = PayoutStatus::Current;
            }

            GroupPayout::create([
                'group_savings_id' => $group2->id,
                'group_member_id' => $member->id,
                'round' => $payoutRound,
                'amount' => $pool2,
                'real_amount' => $pool2,
                'virtual_amount' => 0,
                'status' => $status,
                'expected_date' => Carbon::parse('2025-12-01')->addMonths($payoutRound - 1),
                'paid_at' => $paidAt,
            ]);
        }

        // ── Group 3: PenniAjo Starter (pending, peer mode with freeze, 3 of 5 slots) ──

        $group3 = GroupSavings::create([
            'name' => 'PenniAjo Starter Circle',
            'description' => 'A beginner-friendly ajo group with lower contributions. Perfect for first-time group savers.',
            'created_by_id' => $funmi->id,
            'contribution_amount' => 50000.00,
            'frequency' => SavingsFrequency::Monthly,
            'total_slots' => 5,
            'filled_slots' => 3,
            'current_round' => 0,
            'total_rounds' => 5,
            'status' => GroupSavingsStatus::Pending,
            'start_date' => '2026-04-01',
            'mode' => 'peer',
            'freeze_payout_until_percent' => 30,
        ]);

        foreach ([[$funmi, 1], [$adebayo, 2], [$ngozi, 3]] as [$user, $pos]) {
            GroupMember::create([
                'group_savings_id' => $group3->id,
                'user_id' => $user->id,
                'position' => $pos,
                'total_contributed' => 0,
                'joined_at' => Carbon::parse('2026-02-20')->addDays($pos - 1),
            ]);
        }

        // ── Group 4: Vendor Ajo — linked to a listing (vendor mode) ──

        $listing = Listing::where('status', 'active')->first();
        if ($listing) {
            $vendorUser = User::find($listing->vendor_id);
            $productPrice = (float) $listing->price;
            $totalSlots = 5;
            $contributionAmount = round($productPrice / $totalSlots, 2);

            $group4 = GroupSavings::create([
                'name' => "Ajo for {$listing->title}",
                'description' => "Vendor ajo linked to {$listing->title}. Join to own this item through group savings!",
                'created_by_id' => $vendorUser->id,
                'contribution_amount' => $contributionAmount,
                'frequency' => SavingsFrequency::Monthly,
                'total_slots' => $totalSlots,
                'filled_slots' => 3,
                'current_round' => 1,
                'total_rounds' => $totalSlots,
                'status' => GroupSavingsStatus::Active,
                'start_date' => '2026-02-01',
                'next_payout_date' => null,
                'mode' => 'vendor',
                'vendor_id' => $vendorUser->id,
                'listing_id' => $listing->id,
                'product_price' => $productPrice,
                'payout_start_percent' => 40,
            ]);

            // Add 3 members (NOT the vendor)
            $vendorAjoMembers = [[$adebayo, 1], [$chidinma, 2], [$funmi, 3]];
            $memberModels4 = [];
            foreach ($vendorAjoMembers as [$user, $pos]) {
                $memberModels4[$pos] = GroupMember::create([
                    'group_savings_id' => $group4->id,
                    'user_id' => $user->id,
                    'position' => $pos,
                    'total_contributed' => $contributionAmount,
                    'joined_at' => Carbon::parse('2026-01-25')->addDays($pos - 1),
                ]);
            }

            // Round 1 contributions (all 3 paid)
            foreach ($memberModels4 as $member) {
                GroupContribution::create([
                    'group_savings_id' => $group4->id,
                    'group_member_id' => $member->id,
                    'round' => 1,
                    'amount' => $contributionAmount,
                    'status' => ContributionStatus::Paid,
                    'paid_at' => Carbon::parse('2026-02-01')->addDays(rand(0, 5)),
                ]);
            }

            // Payout schedule — vendor mode: payouts start at round ceil(5 * 40/100) = 2
            $payoutStartRound = $group4->payoutStartRound(); // Should be 2
            $poolSize = $contributionAmount * 3; // 3 members
            foreach ($memberModels4 as $pos => $member) {
                $payoutRound = $payoutStartRound + ($pos - 1);
                if ($payoutRound > $totalSlots) continue;

                $memberContributedAtPayout = $contributionAmount * $payoutRound;
                $realAmount = min($memberContributedAtPayout, $poolSize);
                $virtualAmount = $poolSize - $realAmount;

                GroupPayout::create([
                    'group_savings_id' => $group4->id,
                    'group_member_id' => $member->id,
                    'round' => $payoutRound,
                    'amount' => $poolSize,
                    'real_amount' => $realAmount,
                    'virtual_amount' => $virtualAmount,
                    'status' => PayoutStatus::Pending,
                    'expected_date' => Carbon::parse('2026-02-01')->addMonths($payoutRound - 1),
                ]);
            }

            // Set next payout date
            $firstPayout = $group4->payouts()->orderBy('round')->first();
            if ($firstPayout) {
                $group4->update(['next_payout_date' => $firstPayout->expected_date]);
            }
        }
    }

    private function findOrCreateUser(string $firstName, string $lastName, string $email, string $phone): User
    {
        $user = User::where('email', $email)->first();
        if ($user) return $user;

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'password' => 'password',
            'role' => \App\Enums\UserRole::User,
            'status' => \App\Enums\AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        $user->wallet()->create([
            'real_balance' => 1500000,
            'virtual_balance' => 0,
            'currency' => 'NGN',
        ]);

        return $user;
    }
}
