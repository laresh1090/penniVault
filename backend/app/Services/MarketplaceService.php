<?php

namespace App\Services;

use App\Enums\ListingStatus;
use App\Enums\OrderStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketplaceService
{
    private const COMMISSION_RATE = 0.05; // 5%

    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // BROWSE / SEARCH LISTINGS
    // ────────────────────────────────────────────────

    public function getListings(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Listing::where('status', ListingStatus::Active)
            ->with('vendor:id,first_name,last_name');

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

        if (! empty($filters['minPrice'])) {
            $query->where('price', '>=', (float) $filters['minPrice']);
        }
        if (! empty($filters['maxPrice'])) {
            $query->where('price', '<=', (float) $filters['maxPrice']);
        }

        if (! empty($filters['location'])) {
            $query->where('location', 'LIKE', '%' . $filters['location'] . '%');
        }

        if (! empty($filters['vendorId'])) {
            $query->where('vendor_id', $filters['vendorId']);
        }

        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        return $query->paginate($perPage);
    }

    public function getListingById(string $id): Listing
    {
        return Listing::with(['vendor:id,first_name,last_name', 'vendor.vendorProfile'])
            ->findOrFail($id);
    }

    // ────────────────────────────────────────────────
    // VENDOR CRUD
    // ────────────────────────────────────────────────

    public function createListing(User $vendor, array $data): Listing
    {
        $this->assertApprovedVendor($vendor);

        return Listing::create([
            'vendor_id' => $vendor->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'price' => $data['price'],
            'images' => $data['images'] ?? [],
            'location' => $data['location'],
            'metadata' => $data['metadata'] ?? null,
            'status' => ListingStatus::Active,
            'stock_quantity' => $data['stockQuantity'] ?? 1,
            'allow_installment' => $data['allowInstallment'] ?? false,
            'min_upfront_percent' => $data['minUpfrontPercent'] ?? 40.00,
            'installment_markup_6m' => $data['installmentMarkup6m'] ?? 5.00,
            'installment_markup_12m' => $data['installmentMarkup12m'] ?? 10.00,
        ]);
    }

    public function updateListing(Listing $listing, array $data): Listing
    {
        if ($listing->status !== ListingStatus::Active) {
            throw new \InvalidArgumentException('Only active listings can be updated.');
        }

        $mapping = [
            'title' => 'title',
            'description' => 'description',
            'category' => 'category',
            'price' => 'price',
            'images' => 'images',
            'location' => 'location',
            'metadata' => 'metadata',
            'stockQuantity' => 'stock_quantity',
            'allowInstallment' => 'allow_installment',
            'minUpfrontPercent' => 'min_upfront_percent',
            'installmentMarkup6m' => 'installment_markup_6m',
            'installmentMarkup12m' => 'installment_markup_12m',
        ];

        $updateData = [];
        foreach ($mapping as $camel => $snake) {
            if (array_key_exists($camel, $data)) {
                $updateData[$snake] = $data[$camel];
            }
        }

        $listing->update($updateData);

        return $listing->fresh();
    }

    public function deleteListing(Listing $listing): Listing
    {
        if ($listing->status === ListingStatus::Archived) {
            throw new \InvalidArgumentException('Listing is already archived.');
        }

        $listing->update(['status' => ListingStatus::Archived]);

        return $listing->fresh();
    }

    // ────────────────────────────────────────────────
    // PURCHASE FROM WALLET
    // ────────────────────────────────────────────────

    public function purchaseFromWallet(User $buyer, Listing $listing): array
    {
        if ($listing->status !== ListingStatus::Active) {
            throw new \InvalidArgumentException('This listing is no longer available for purchase.');
        }

        if ($listing->stock_quantity <= 0) {
            throw new \InvalidArgumentException('This listing is out of stock.');
        }

        if ($listing->vendor_id === $buyer->id) {
            throw new \InvalidArgumentException('You cannot purchase your own listing.');
        }

        $price = (float) $listing->price;
        $commissionAmount = round($price * self::COMMISSION_RATE, 2);
        $vendorAmount = round($price - $commissionAmount, 2);

        return DB::transaction(function () use ($buyer, $listing, $price, $commissionAmount, $vendorAmount) {
            // 1. Debit buyer wallet
            $buyerWallet = $this->walletService->getOrCreateWallet($buyer);

            if ((float) $buyerWallet->real_balance < $price) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance. Available: ₦' . number_format($buyerWallet->real_balance, 2)
                    . '. Required: ₦' . number_format($price, 2)
                );
            }

            $buyerWallet->decrement('real_balance', $price);
            $buyerWallet->refresh();

            // 2. Credit vendor wallet (minus commission)
            $vendor = User::findOrFail($listing->vendor_id);
            $vendorWallet = $this->walletService->getOrCreateWallet($vendor);
            $vendorWallet->increment('real_balance', $vendorAmount);
            $vendorWallet->refresh();

            // 3. Create Order
            $order = Order::create([
                'buyer_id' => $buyer->id,
                'listing_id' => $listing->id,
                'vendor_id' => $listing->vendor_id,
                'amount' => $price,
                'commission_amount' => $commissionAmount,
                'vendor_amount' => $vendorAmount,
                'status' => OrderStatus::Confirmed,
                'reference' => $this->generateReference('ORD'),
            ]);

            // 4. Create buyer transaction (debit)
            Transaction::create([
                'user_id' => $buyer->id,
                'wallet_id' => $buyerWallet->id,
                'type' => TransactionType::Purchase,
                'category' => 'Marketplace Purchase',
                'amount' => -$price,
                'balance_after' => $buyerWallet->real_balance,
                'description' => "Purchase: {$listing->title}",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('PUR'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'listing_id' => $listing->id,
                    'listing_title' => $listing->title,
                    'vendor_id' => $listing->vendor_id,
                ],
            ]);

            // 5. Create vendor transaction (credit, net of commission)
            Transaction::create([
                'user_id' => $vendor->id,
                'wallet_id' => $vendorWallet->id,
                'type' => TransactionType::Sale,
                'category' => 'Marketplace Sale',
                'amount' => $vendorAmount,
                'balance_after' => $vendorWallet->real_balance,
                'description' => "Sale: {$listing->title} (5% commission deducted)",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('SAL'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'listing_id' => $listing->id,
                    'listing_title' => $listing->title,
                    'buyer_id' => $buyer->id,
                    'gross_amount' => $price,
                    'commission_amount' => $commissionAmount,
                    'commission_rate' => self::COMMISSION_RATE,
                ],
            ]);

            // 6. Commission record for audit trail
            Transaction::create([
                'user_id' => $vendor->id,
                'wallet_id' => $vendorWallet->id,
                'type' => TransactionType::Commission,
                'category' => 'Platform Commission',
                'amount' => -$commissionAmount,
                'balance_after' => $vendorWallet->real_balance,
                'description' => "5% commission on sale of {$listing->title}",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('COM'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'listing_id' => $listing->id,
                    'order_id' => $order->id,
                    'commission_rate' => self::COMMISSION_RATE,
                ],
            ]);

            // 7. Update listing stock
            $listing->decrement('stock_quantity');
            $listing->refresh();

            if ($listing->stock_quantity <= 0) {
                $listing->update(['status' => ListingStatus::Sold]);
            }

            $order->load(['listing', 'buyer:id,first_name,last_name', 'vendor:id,first_name,last_name']);

            return [
                'order' => $order,
            ];
        });
    }

    // ────────────────────────────────────────────────
    // ORDER HISTORY
    // ────────────────────────────────────────────────

    public function getUserOrders(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Order::where('buyer_id', $user->id)
            ->with(['listing:id,title,category,price,images', 'vendor:id,first_name,last_name'])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function getVendorSales(User $vendor, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Order::where('vendor_id', $vendor->id)
            ->with(['listing:id,title,category,price,images', 'buyer:id,first_name,last_name'])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function getVendorListings(User $vendor, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Listing::where('vendor_id', $vendor->id)
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
            throw new \InvalidArgumentException('Only vendors can manage listings.');
        }

        $profile = $vendor->vendorProfile;

        if (! $profile || ! $profile->is_approved) {
            throw new \InvalidArgumentException(
                'Your vendor profile must be approved before you can create listings.'
            );
        }
    }

    private function generateReference(string $typePrefix): string
    {
        return 'PV-' . $typePrefix . '-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }
}
