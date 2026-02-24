<?php

namespace Database\Seeders;

use App\Models\SavingsPlan;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavingsSeeder extends Seeder
{
    public function run(): void
    {
        $adebayo = User::where('email', 'adebayo@test.com')->first();
        $chidinma = User::where('email', 'chidinma@test.com')->first();

        if (! $adebayo) {
            return;
        }

        // ── Adebayo's PenniSave Plans ──
        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Emergency Fund',
            'description' => 'Daily savings for emergencies',
            'product_type' => 'pennisave',
            'target_amount' => 500000,
            'current_amount' => 175000,
            'start_date' => '2026-01-15',
            'frequency' => 'daily',
            'contribution_amount' => 5000,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 5.00,
            'accrued_interest' => 1250,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Vacation Fund',
            'description' => 'Weekly savings for December vacation',
            'product_type' => 'pennisave',
            'target_amount' => 1000000,
            'current_amount' => 320000,
            'start_date' => '2026-01-01',
            'frequency' => 'weekly',
            'contribution_amount' => 40000,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 6.00,
            'accrued_interest' => 3500,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Laptop Upgrade',
            'description' => 'Monthly savings for a new MacBook',
            'product_type' => 'pennisave',
            'target_amount' => 2500000,
            'current_amount' => 500000,
            'start_date' => '2025-11-01',
            'frequency' => 'monthly',
            'contribution_amount' => 250000,
            'status' => 'active',
            'has_interest' => false,
            'accrued_interest' => 0,
        ]);

        // ── Adebayo's PenniLock Plans ──
        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Year-end Bonus Lock',
            'description' => 'Locked until December — discipline savings',
            'product_type' => 'pennilock',
            'target_amount' => 2000000,
            'current_amount' => 1200000,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'frequency' => 'monthly',
            'contribution_amount' => 200000,
            'status' => 'active',
            'has_interest' => false,
            'accrued_interest' => 0,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 5.00,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Q2 Business Capital',
            'description' => 'Locked for 90 days at 12% — maturity interest',
            'product_type' => 'pennilock',
            'target_amount' => 2000000,
            'current_amount' => 2000000,
            'start_date' => '2026-01-15',
            'end_date' => '2026-04-15',
            'frequency' => 'monthly',
            'contribution_amount' => 0,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 12.00,
            'accrued_interest' => 29589,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 5.00,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Annual Growth Lock',
            'description' => '1-year lock at 15% — interest paid upfront',
            'product_type' => 'pennilock',
            'target_amount' => 5000000,
            'current_amount' => 5000000,
            'start_date' => '2025-12-01',
            'end_date' => '2026-12-01',
            'frequency' => 'monthly',
            'contribution_amount' => 0,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 15.00,
            'accrued_interest' => 750000,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 0,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Short-term Cash Lock',
            'description' => '30-day lock at 8% — matures soon',
            'product_type' => 'pennilock',
            'target_amount' => 500000,
            'current_amount' => 500000,
            'start_date' => '2026-01-25',
            'end_date' => '2026-02-24',
            'frequency' => 'monthly',
            'contribution_amount' => 0,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 8.00,
            'accrued_interest' => 3123,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 5.00,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Wedding Fund Lock',
            'description' => '180-day lock at 14% — saving for December wedding',
            'product_type' => 'pennilock',
            'target_amount' => 3000000,
            'current_amount' => 3000000,
            'start_date' => '2026-02-10',
            'end_date' => '2026-08-09',
            'frequency' => 'monthly',
            'contribution_amount' => 0,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 14.00,
            'accrued_interest' => 11507,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 5.00,
        ]);

        // ── Adebayo's TargetSave Plans ──
        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Dream Home Fund',
            'description' => 'Saving towards first apartment down payment',
            'product_type' => 'targetsave',
            'target_amount' => 15000000,
            'current_amount' => 8050000,
            'start_date' => '2025-06-01',
            'end_date' => '2027-06-01',
            'frequency' => 'monthly',
            'contribution_amount' => 500000,
            'status' => 'active',
            'has_interest' => true,
            'interest_rate' => 10.00,
            'accrued_interest' => 125000,
        ]);

        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'New Car Fund',
            'description' => 'Monthly savings towards a Toyota Camry 2024',
            'product_type' => 'targetsave',
            'target_amount' => 20000000,
            'current_amount' => 2000000,
            'start_date' => '2026-01-01',
            'end_date' => '2027-12-31',
            'frequency' => 'monthly',
            'contribution_amount' => 850000,
            'status' => 'active',
            'has_interest' => false,
            'accrued_interest' => 0,
        ]);

        // ── Adebayo's completed plan ──
        SavingsPlan::create([
            'user_id' => $adebayo->id,
            'name' => 'Business Capital',
            'description' => 'Locked for 9 months — earned 12% interest',
            'product_type' => 'pennilock',
            'target_amount' => 5000000,
            'current_amount' => 5000000,
            'start_date' => '2025-03-01',
            'end_date' => '2025-12-01',
            'frequency' => 'monthly',
            'contribution_amount' => 600000,
            'status' => 'completed',
            'has_interest' => true,
            'interest_rate' => 12.00,
            'accrued_interest' => 450000,
            'is_fixed_term' => true,
            'early_withdrawal_penalty_percent' => 10.00,
            'matured_at' => '2025-12-01',
        ]);

        // ── Chidinma's plans ──
        if ($chidinma) {
            SavingsPlan::create([
                'user_id' => $chidinma->id,
                'name' => 'Rainy Day Fund',
                'description' => 'Weekly auto-save for unexpected expenses',
                'product_type' => 'pennisave',
                'target_amount' => 200000,
                'current_amount' => 85000,
                'start_date' => '2026-02-01',
                'frequency' => 'weekly',
                'contribution_amount' => 10000,
                'status' => 'active',
                'has_interest' => true,
                'interest_rate' => 6.00,
                'accrued_interest' => 520,
            ]);

            SavingsPlan::create([
                'user_id' => $chidinma->id,
                'name' => '6-Month Fixed Lock',
                'description' => 'Locked at 12% for 180 days',
                'product_type' => 'pennilock',
                'target_amount' => 1000000,
                'current_amount' => 1000000,
                'start_date' => '2026-01-10',
                'end_date' => '2026-07-10',
                'frequency' => 'monthly',
                'contribution_amount' => 0,
                'status' => 'active',
                'has_interest' => true,
                'interest_rate' => 12.00,
                'accrued_interest' => 14795,
                'is_fixed_term' => true,
                'early_withdrawal_penalty_percent' => 5.00,
            ]);
        }
    }
}
