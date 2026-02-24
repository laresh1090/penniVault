<?php

namespace Database\Seeders;

use App\Enums\AccountStatus;
use App\Enums\BusinessType;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Regular users
        $adebayo = User::create([
            'first_name' => 'Adebayo',
            'last_name' => 'Johnson',
            'email' => 'adebayo@test.com',
            'phone' => '+234 801 234 5678',
            'password' => 'password',
            'role' => UserRole::User,
            'status' => AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        $chidinma = User::create([
            'first_name' => 'Chidinma',
            'last_name' => 'Okafor',
            'email' => 'chidinma@test.com',
            'phone' => '+234 802 345 6789',
            'password' => 'password',
            'role' => UserRole::User,
            'status' => AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        $amina = User::create([
            'first_name' => 'Amina',
            'last_name' => 'Bello',
            'email' => 'amina@test.com',
            'phone' => '+234 805 678 9012',
            'password' => 'password',
            'role' => UserRole::User,
            'status' => AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Abuja',
            'state' => 'FCT',
        ]);

        // Vendor
        $vendor = User::create([
            'first_name' => 'Emeka',
            'last_name' => 'Motors',
            'email' => 'vendor@test.com',
            'phone' => '+234 803 456 7890',
            'password' => 'password',
            'role' => UserRole::Vendor,
            'status' => AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        $vendor->vendorProfile()->create([
            'business_name' => 'Emeka Motors Ltd',
            'business_type' => BusinessType::Automotive,
            'registration_number' => 'RC-123456',
            'business_address' => '45 Admiralty Way, Lekki Phase 1, Lagos',
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        // Admin
        $admin = User::create([
            'first_name' => 'Platform',
            'last_name' => 'Admin',
            'email' => 'admin@test.com',
            'phone' => '+234 804 567 8901',
            'password' => 'password',
            'role' => UserRole::Admin,
            'status' => AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        // ── Wallets ──
        $adebayo->wallet()->create(['real_balance' => 1250000, 'virtual_balance' => 0, 'currency' => 'NGN']);
        $chidinma->wallet()->create(['real_balance' => 800000, 'virtual_balance' => 0, 'currency' => 'NGN']);
        $amina->wallet()->create(['real_balance' => 500000, 'virtual_balance' => 0, 'currency' => 'NGN']);
        $vendor->wallet()->create(['real_balance' => 2000000, 'virtual_balance' => 0, 'currency' => 'NGN']);
        $admin->wallet()->create(['real_balance' => 100000, 'virtual_balance' => 0, 'currency' => 'NGN']);

        // ── Payment Methods for Adebayo ──
        $adebayo->paymentMethods()->createMany([
            [
                'bank_name' => 'GTBank',
                'bank_code' => '058',
                'account_number' => '0123456789',
                'account_name' => 'Adebayo Johnson',
                'is_default' => true,
            ],
            [
                'bank_name' => 'Access Bank',
                'bank_code' => '044',
                'account_number' => '9876543210',
                'account_name' => 'Adebayo Johnson',
                'is_default' => false,
            ],
        ]);

        // ── Seeders ──
        $this->call([
            SavingsSeeder::class,
            MarketplaceSeeder::class,
            InvestmentSeeder::class,
        ]);
    }
}
