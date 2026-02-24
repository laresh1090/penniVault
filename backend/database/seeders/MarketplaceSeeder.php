<?php

namespace Database\Seeders;

use App\Enums\ListingCategory;
use App\Enums\ListingStatus;
use App\Enums\OrderStatus;
use App\Models\Listing;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $emeka = User::where('email', 'vendor@test.com')->firstOrFail();
        $adebayo = User::where('email', 'adebayo@test.com')->firstOrFail();

        $skyline = $this->findOrCreateVendor(
            'Skyline', 'Realty', 'skyline@test.com', '+234 806 789 0123',
            'property', 'Skyline Realty Group', 'RC-234567', '15 Bourdillon Road, Ikoyi, Lagos'
        );

        $ademotors = $this->findOrCreateVendor(
            'Ade', 'Motors', 'ademotors@test.com', '+234 807 890 1234',
            'automotive', 'Ade Motors Ltd', 'RC-345678', '22 Ozumba Mbadiwe Ave, Victoria Island, Lagos'
        );

        $savannafarms = $this->findOrCreateVendor(
            'Savanna', 'Farms', 'savannafarms@test.com', '+234 808 901 2345',
            'other', 'Savanna Farms Nigeria', 'RC-456789', '8 Oregun Road, Ikeja, Lagos'
        );

        // ── Property Listings (4) ──

        Listing::create([
            'vendor_id' => $skyline->id,
            'title' => '3 Bedroom Luxury Apartment in Lekki Phase 1',
            'description' => 'Exquisitely finished 3-bedroom apartment with BQ in a serene environment. Features include 24/7 power supply, swimming pool, gym, and ample parking.',
            'category' => ListingCategory::Property,
            'price' => 85000000.00,
            'images' => ['/images/listings/property-1.jpg'],
            'location' => 'Lekki Phase 1, Lagos',
            'status' => ListingStatus::Active,
            'featured' => true,
            'stock_quantity' => 1,
            'metadata' => ['bedrooms' => 3, 'bathrooms' => 4, 'sqm' => 250, 'property_type' => 'Apartment'],
            'allow_installment' => true,
            'min_upfront_percent' => 40.00,
            'installment_markup_6m' => 5.00,
            'installment_markup_12m' => 10.00,
        ]);

        Listing::create([
            'vendor_id' => $skyline->id,
            'title' => '5 Bedroom Detached Duplex in Ikoyi',
            'description' => 'Magnificent 5-bedroom detached duplex with swimming pool, cinema room, and smart home features. Situated on a large plot in the heart of Ikoyi.',
            'category' => ListingCategory::Property,
            'price' => 150000000.00,
            'images' => ['/images/listings/ikoyi-duplex.jpg'],
            'location' => 'Old Ikoyi, Lagos',
            'status' => ListingStatus::Active,
            'featured' => true,
            'stock_quantity' => 1,
            'metadata' => ['bedrooms' => 5, 'bathrooms' => 6, 'sqm' => 500, 'property_type' => 'Detached Duplex'],
            'allow_installment' => true,
            'min_upfront_percent' => 30.00,
            'installment_markup_6m' => 3.00,
            'installment_markup_12m' => 7.00,
        ]);

        Listing::create([
            'vendor_id' => $skyline->id,
            'title' => '2 Bedroom Serviced Flat in Victoria Island',
            'description' => 'Modern 2-bedroom serviced apartment in a premium high-rise building on Victoria Island. 24/7 security, concierge, rooftop lounge, and fitness center.',
            'category' => ListingCategory::Property,
            'price' => 45000000.00,
            'images' => ['/images/listings/property-2.jpg'],
            'location' => 'Victoria Island, Lagos',
            'status' => ListingStatus::Active,
            'stock_quantity' => 3,
            'metadata' => ['bedrooms' => 2, 'bathrooms' => 2, 'sqm' => 120, 'property_type' => 'Serviced Apartment'],
        ]);

        Listing::create([
            'vendor_id' => $skyline->id,
            'title' => '4 Bedroom Semi-Detached in Lekki County',
            'description' => 'Brand new 4-bedroom semi-detached duplex in Lekki County Homes estate. Spacious rooms, modern kitchen, all-room en-suite.',
            'category' => ListingCategory::Property,
            'price' => 65000000.00,
            'images' => ['/images/listings/property-3.jpg'],
            'location' => 'Lekki County, Ikota, Lagos',
            'status' => ListingStatus::Draft,
            'stock_quantity' => 2,
            'metadata' => ['bedrooms' => 4, 'bathrooms' => 5, 'sqm' => 320, 'property_type' => 'Semi-Detached Duplex'],
        ]);

        // ── Automotive Listings (4) ──

        Listing::create([
            'vendor_id' => $emeka->id,
            'title' => 'Toyota Camry 2024 XSE - Pearl White',
            'description' => 'Brand new 2024 Toyota Camry XSE with full factory warranty. Leather seats, JBL premium audio, panoramic sunroof, adaptive cruise control.',
            'category' => ListingCategory::Automotive,
            'price' => 28000000.00,
            'images' => ['/images/listings/car-1.jpg'],
            'location' => 'Lekki Phase 1, Lagos',
            'status' => ListingStatus::Active,
            'featured' => true,
            'stock_quantity' => 2,
            'metadata' => ['make' => 'Toyota', 'model' => 'Camry XSE', 'year' => 2024, 'mileage' => '0 km', 'transmission' => 'Automatic', 'condition' => 'Brand New'],
        ]);

        Listing::create([
            'vendor_id' => $emeka->id,
            'title' => 'Honda Accord 2023 Sport - Midnight Blue',
            'description' => 'Toks (foreign used) 2023 Honda Accord Sport with low mileage. Excellent condition with full service history.',
            'category' => ListingCategory::Automotive,
            'price' => 18500000.00,
            'images' => ['/images/listings/car-2.jpg'],
            'location' => 'Lekki Phase 1, Lagos',
            'status' => ListingStatus::Active,
            'stock_quantity' => 1,
            'metadata' => ['make' => 'Honda', 'model' => 'Accord Sport', 'year' => 2023, 'mileage' => '15,000 km', 'condition' => 'Foreign Used'],
        ]);

        Listing::create([
            'vendor_id' => $ademotors->id,
            'title' => 'Mercedes-Benz C300 2024 AMG Line',
            'description' => 'Stunning 2024 Mercedes-Benz C300 with AMG Line package. MBUX infotainment, Burmester surround sound, ambient lighting.',
            'category' => ListingCategory::Automotive,
            'price' => 42000000.00,
            'images' => ['/images/listings/car-3.jpg'],
            'location' => 'Victoria Island, Lagos',
            'status' => ListingStatus::Active,
            'featured' => true,
            'stock_quantity' => 1,
            'metadata' => ['make' => 'Mercedes-Benz', 'model' => 'C300 AMG Line', 'year' => 2024, 'mileage' => '0 km', 'condition' => 'Brand New'],
            'allow_installment' => true,
            'min_upfront_percent' => 40.00,
            'installment_markup_6m' => 5.00,
            'installment_markup_12m' => 10.00,
        ]);

        $listing8 = Listing::create([
            'vendor_id' => $ademotors->id,
            'title' => 'Range Rover Sport 2023 HSE Dynamic',
            'description' => 'Pre-owned 2023 Range Rover Sport HSE Dynamic in pristine condition. Meridian sound system, panoramic roof, air suspension.',
            'category' => ListingCategory::Automotive,
            'price' => 45000000.00,
            'images' => ['/images/listings/camry-2024.jpg'],
            'location' => 'Victoria Island, Lagos',
            'status' => ListingStatus::Active,
            'stock_quantity' => 1,
            'metadata' => ['make' => 'Land Rover', 'model' => 'Range Rover Sport HSE Dynamic', 'year' => 2023, 'mileage' => '8,500 km', 'condition' => 'Foreign Used'],
            'allow_installment' => true,
            'min_upfront_percent' => 40.00,
            'installment_markup_6m' => 0.00,
            'installment_markup_12m' => 5.00,
        ]);

        // ── Agriculture Listings (2) ──

        Listing::create([
            'vendor_id' => $savannafarms->id,
            'title' => '5 Hectares Farmland in Ogun State',
            'description' => 'Fertile 5-hectare farmland ideal for crop cultivation or poultry farming. Good access road, water borehole, C of O available.',
            'category' => ListingCategory::Agriculture,
            'price' => 8000000.00,
            'images' => ['/images/listings/land-1.jpg'],
            'location' => 'Sagamu, Ogun State',
            'status' => ListingStatus::Active,
            'stock_quantity' => 1,
            'metadata' => ['land_size' => '5 hectares', 'soil_type' => 'Loamy', 'document_type' => 'C of O'],
        ]);

        Listing::create([
            'vendor_id' => $savannafarms->id,
            'title' => '10 Hectares Agricultural Land in Oyo State',
            'description' => 'Expansive 10-hectare agricultural land perfect for large-scale farming operations. Proximity to Ibadan market.',
            'category' => ListingCategory::Agriculture,
            'price' => 10000000.00,
            'images' => ['/images/listings/land-2.jpg'],
            'location' => 'Iseyin, Oyo State',
            'status' => ListingStatus::Active,
            'stock_quantity' => 1,
            'metadata' => ['land_size' => '10 hectares', 'soil_type' => 'Clay-Loam', 'document_type' => 'Survey Plan'],
        ]);

        // ── Other Listings (2) ──

        $solarListing = Listing::create([
            'vendor_id' => $emeka->id,
            'title' => '10kVA Solar Power System - Complete Installation',
            'description' => 'Complete 10kVA solar power system including 20 x 450W panels, 10kVA hybrid inverter, 20kWh lithium battery bank, and full installation.',
            'category' => ListingCategory::Other,
            'price' => 8500000.00,
            'images' => ['/images/listings/samsung-tv.jpg'],
            'location' => 'Nationwide Delivery',
            'status' => ListingStatus::Active,
            'stock_quantity' => 5,
            'metadata' => ['type' => 'Solar Power System', 'capacity' => '10kVA', 'warranty' => '5 years'],
        ]);

        Listing::create([
            'vendor_id' => $emeka->id,
            'title' => 'Mikano 20kVA Diesel Generator - Soundproof',
            'description' => 'Brand new Mikano 20kVA soundproof diesel generator. Automatic transfer switch (ATS) included. 1-year warranty.',
            'category' => ListingCategory::Other,
            'price' => 4500000.00,
            'images' => ['/images/listings/macbook-m4.jpg'],
            'location' => 'Ikeja, Lagos',
            'status' => ListingStatus::Active,
            'stock_quantity' => 3,
            'metadata' => ['type' => 'Diesel Generator', 'brand' => 'Mikano', 'capacity' => '20kVA'],
        ]);

        // ── Sample Order ──

        $orderAmount = 8500000.00;
        $commission = round($orderAmount * 0.05, 2);
        $vendorAmount = round($orderAmount - $commission, 2);

        Order::create([
            'buyer_id' => $adebayo->id,
            'listing_id' => $solarListing->id,
            'vendor_id' => $emeka->id,
            'amount' => $orderAmount,
            'commission_amount' => $commission,
            'vendor_amount' => $vendorAmount,
            'status' => OrderStatus::Confirmed,
            'reference' => 'PV-ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'metadata' => ['delivery_address' => '12 Admiralty Road, Lekki Phase 1, Lagos'],
        ]);
    }

    private function findOrCreateVendor(
        string $firstName,
        string $lastName,
        string $email,
        string $phone,
        string $businessType,
        string $businessName,
        string $regNumber,
        string $businessAddress,
    ): User {
        $user = User::where('email', $email)->first();

        if ($user) {
            return $user;
        }

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'password' => 'password',
            'role' => \App\Enums\UserRole::Vendor,
            'status' => \App\Enums\AccountStatus::Active,
            'email_verified_at' => now(),
            'city' => 'Lagos',
            'state' => 'Lagos',
        ]);

        $user->vendorProfile()->create([
            'business_name' => $businessName,
            'business_type' => $businessType,
            'registration_number' => $regNumber,
            'business_address' => $businessAddress,
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        $user->wallet()->create([
            'real_balance' => 500000,
            'virtual_balance' => 0,
            'currency' => 'NGN',
        ]);

        return $user;
    }
}
