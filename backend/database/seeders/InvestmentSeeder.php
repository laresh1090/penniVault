<?php

namespace Database\Seeders;

use App\Enums\InvestmentCategory;
use App\Enums\InvestmentRiskLevel;
use App\Enums\InvestmentStatus;
use App\Enums\UserInvestmentStatus;
use App\Models\CrowdInvestment;
use App\Models\User;
use App\Models\UserInvestment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvestmentSeeder extends Seeder
{
    public function run(): void
    {
        $adebayo = User::where('email', 'adebayo@test.com')->firstOrFail();

        $savannafarms = User::where('email', 'savannafarms@test.com')->first()
            ?? $this->findOrCreateVendor('Savanna', 'Farms', 'savannafarms@test.com', '+234 808 901 2345', 'other', 'Savanna Farms Nigeria', 'RC-456789', '8 Oregun Road, Ikeja, Lagos');

        $agrovest = $this->findOrCreateVendor(
            'AgroVest', 'Nigeria', 'agrovest@test.com', '+234 809 012 3456',
            'other', 'AgroVest Nigeria Ltd', 'RC-567890', '33 Allen Avenue, Ikeja, Lagos'
        );

        $greenfield = $this->findOrCreateVendor(
            'GreenField', 'Agro', 'greenfield@test.com', '+234 810 123 4567',
            'other', 'GreenField Agro Ltd', 'RC-678901', '5 Industrial Avenue, Ilupeju, Lagos'
        );

        $primeestates = $this->findOrCreateVendor(
            'Prime', 'Estates', 'primeestates@test.com', '+234 811 234 5678',
            'property', 'Prime Estates Nigeria', 'RC-789012', '10 Garki Area 11, Abuja'
        );

        $perazim = $this->findOrCreateVendor(
            'Perazim', 'Properties', 'perazim@test.com', '+234 812 345 6789',
            'property', 'Perazim Properties Ltd', 'RC-890123', '7 Admiralty Way, Lekki Phase 1, Lagos'
        );

        // ── Agriculture Investments (3) ──

        $inv1 = CrowdInvestment::create([
            'vendor_id' => $savannafarms->id,
            'title' => 'Savanna Poultry Farm Expansion',
            'description' => 'Invest in the expansion of Savanna Farms\' poultry operations from 10,000 to 25,000 birds. Established supply chain with major hotels and restaurants across Lagos.',
            'category' => InvestmentCategory::Agriculture,
            'target_amount' => 15000000.00,
            'current_amount' => 8750000.00,
            'minimum_investment' => 50000.00,
            'expected_roi_percent' => 15.00,
            'duration_days' => 180,
            'start_date' => now()->subDays(30)->toDateString(),
            'end_date' => now()->addDays(150)->toDateString(),
            'status' => InvestmentStatus::Open,
            'images' => ['/img/investment-agric-2.jpg'],
            'location' => 'Ikorodu, Lagos',
            'risk_level' => InvestmentRiskLevel::Low,
            'metadata' => ['farm_type' => 'Poultry (Layers)', 'current_capacity' => '10,000 birds', 'insurance' => 'Fully insured with Leadway Assurance'],
        ]);

        $inv2 = CrowdInvestment::create([
            'vendor_id' => $agrovest->id,
            'title' => 'AgroVest Rice Farming - Kebbi State',
            'description' => 'Join AgroVest in cultivating 200 hectares of premium rice in Kebbi State. We partner with local farmers and use modern irrigation systems.',
            'category' => InvestmentCategory::Agriculture,
            'target_amount' => 50000000.00,
            'current_amount' => 32000000.00,
            'minimum_investment' => 100000.00,
            'expected_roi_percent' => 20.00,
            'duration_days' => 365,
            'start_date' => now()->subDays(60)->toDateString(),
            'end_date' => now()->addDays(305)->toDateString(),
            'status' => InvestmentStatus::Open,
            'images' => ['/img/investment-agric-1.jpg'],
            'location' => 'Kebbi State',
            'risk_level' => InvestmentRiskLevel::Medium,
            'metadata' => ['farm_type' => 'Rice Cultivation', 'land_size' => '200 hectares', 'previous_roi' => '18-22% across 3 seasons'],
        ]);

        CrowdInvestment::create([
            'vendor_id' => $greenfield->id,
            'title' => 'GreenField Cassava Processing Plant',
            'description' => 'Fund the establishment of a cassava processing plant in Ogun State. Off-take agreements already secured with FMCG companies.',
            'category' => InvestmentCategory::Agriculture,
            'target_amount' => 30000000.00,
            'current_amount' => 30000000.00,
            'minimum_investment' => 75000.00,
            'expected_roi_percent' => 18.00,
            'duration_days' => 270,
            'start_date' => now()->subDays(90)->toDateString(),
            'end_date' => now()->addDays(180)->toDateString(),
            'status' => InvestmentStatus::InProgress,
            'images' => ['/img/investment-agric-3.jpg'],
            'location' => 'Abeokuta, Ogun State',
            'risk_level' => InvestmentRiskLevel::Low,
            'metadata' => ['farm_type' => 'Cassava Processing', 'products' => ['Garri', 'Fufu', 'Industrial Starch']],
        ]);

        // ── Real Estate Investments (3) ──

        $inv4 = CrowdInvestment::create([
            'vendor_id' => $perazim->id,
            'title' => 'Lekki Pearl Luxury Apartments Development',
            'description' => 'Co-invest in the development of a 24-unit luxury apartment complex in Lekki Phase 2, Lagos. Pre-sales have already secured 60% of units.',
            'category' => InvestmentCategory::RealEstate,
            'target_amount' => 200000000.00,
            'current_amount' => 125000000.00,
            'minimum_investment' => 500000.00,
            'expected_roi_percent' => 25.00,
            'duration_days' => 365,
            'start_date' => now()->subDays(45)->toDateString(),
            'end_date' => now()->addDays(320)->toDateString(),
            'status' => InvestmentStatus::Open,
            'images' => ['/img/investment-property-1.jpg'],
            'location' => 'Lekki Phase 2, Lagos',
            'risk_level' => InvestmentRiskLevel::Medium,
            'metadata' => ['project_type' => 'Residential Development', 'total_units' => 24, 'pre_sold_units' => 14],
        ]);

        CrowdInvestment::create([
            'vendor_id' => $primeestates->id,
            'title' => 'Abuja Commercial Complex - Wuse 2',
            'description' => 'Invest in a 6-floor commercial complex in Wuse 2, Abuja. Pre-lease agreements signed with two multinational tenants covering 40% of lettable space.',
            'category' => InvestmentCategory::RealEstate,
            'target_amount' => 350000000.00,
            'current_amount' => 175000000.00,
            'minimum_investment' => 250000.00,
            'expected_roi_percent' => 22.00,
            'duration_days' => 540,
            'start_date' => now()->subDays(120)->toDateString(),
            'end_date' => now()->addDays(420)->toDateString(),
            'status' => InvestmentStatus::Open,
            'images' => ['/img/investment-property-3.jpg'],
            'location' => 'Wuse 2, Abuja',
            'risk_level' => InvestmentRiskLevel::Medium,
            'metadata' => ['project_type' => 'Commercial Development', 'floors' => 6, 'pre_lease_percent' => 40],
        ]);

        CrowdInvestment::create([
            'vendor_id' => $perazim->id,
            'title' => 'Ibeju-Lekki Gated Estate Development',
            'description' => 'Participate in the development of a 50-plot gated estate in Ibeju-Lekki, near the Dangote Refinery and Lekki Free Trade Zone.',
            'category' => InvestmentCategory::RealEstate,
            'target_amount' => 500000000.00,
            'current_amount' => 500000000.00,
            'minimum_investment' => 200000.00,
            'expected_roi_percent' => 30.00,
            'duration_days' => 730,
            'start_date' => now()->subDays(200)->toDateString(),
            'end_date' => now()->addDays(530)->toDateString(),
            'status' => InvestmentStatus::Funded,
            'images' => ['/img/investment-property-9.jpg'],
            'location' => 'Ibeju-Lekki, Lagos',
            'risk_level' => InvestmentRiskLevel::High,
            'metadata' => ['project_type' => 'Estate Development', 'total_plots' => 50],
        ]);

        // ── Technology Investment (1) ──

        CrowdInvestment::create([
            'vendor_id' => $agrovest->id,
            'title' => 'AgroTech Platform Expansion',
            'description' => 'Fund the expansion of AgroVest\'s proprietary AgroTech platform connecting farmers directly with buyers, eliminating middlemen.',
            'category' => InvestmentCategory::Technology,
            'target_amount' => 100000000.00,
            'current_amount' => 45000000.00,
            'minimum_investment' => 100000.00,
            'expected_roi_percent' => 35.00,
            'duration_days' => 365,
            'start_date' => now()->subDays(15)->toDateString(),
            'end_date' => now()->addDays(350)->toDateString(),
            'status' => InvestmentStatus::Open,
            'images' => ['/img/investment-property-5.jpg'],
            'location' => 'Lagos (Nationwide)',
            'risk_level' => InvestmentRiskLevel::High,
            'metadata' => ['platform_type' => 'B2B AgriTech Marketplace', 'current_farmers' => 5000, 'target_farmers' => 50000],
        ]);

        // ── Pre-seeded User Investments for Adebayo ──

        UserInvestment::create([
            'user_id' => $adebayo->id,
            'crowd_investment_id' => $inv1->id,
            'amount' => 200000.00,
            'expected_return' => round(200000.00 * (15.00 / 100) * (180.0 / 365.0), 2),
            'status' => UserInvestmentStatus::Active,
            'invested_at' => now()->subDays(25),
            'reference' => 'PV-INV-' . now()->subDays(25)->format('Ymd') . '-' . strtoupper(Str::random(6)),
        ]);

        UserInvestment::create([
            'user_id' => $adebayo->id,
            'crowd_investment_id' => $inv4->id,
            'amount' => 500000.00,
            'expected_return' => round(500000.00 * (25.00 / 100) * (365.0 / 365.0), 2),
            'status' => UserInvestmentStatus::Active,
            'invested_at' => now()->subDays(40),
            'reference' => 'PV-INV-' . now()->subDays(40)->format('Ymd') . '-' . strtoupper(Str::random(6)),
        ]);
    }

    private function findOrCreateVendor(
        string $firstName, string $lastName, string $email, string $phone,
        string $businessType, string $businessName, string $regNumber, string $businessAddress,
    ): User {
        $user = User::where('email', $email)->first();
        if ($user) return $user;

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'password' => 'password',
            'role' => \App\Enums\UserRole::Vendor,
            'status' => \App\Enums\AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => str_contains(strtolower($businessAddress), 'abuja') ? 'Abuja' : 'Lagos',
            'state' => str_contains(strtolower($businessAddress), 'abuja') ? 'FCT' : 'Lagos',
        ]);

        $user->vendorProfile()->create([
            'business_name' => $businessName,
            'business_type' => $businessType,
            'registration_number' => $regNumber,
            'business_address' => $businessAddress,
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        $user->wallet()->create(['real_balance' => 500000, 'virtual_balance' => 0, 'currency' => 'NGN']);

        return $user;
    }
}
