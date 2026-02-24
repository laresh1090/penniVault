<?php

namespace App\Services;

use App\Enums\InstallmentPaymentStatus;
use App\Enums\InstallmentPlanStatus;
use App\Enums\ListingStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\InstallmentPayment;
use App\Models\InstallmentPlan;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InstallmentService
{
    private const COMMISSION_RATE = 0.05; // 5%

    public function __construct(
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // CALCULATE / PREVIEW
    // ────────────────────────────────────────────────

    /**
     * Pure calculation — no side effects.
     * Returns a breakdown of costs for the given plan configuration.
     */
    public function calculatePlan(float $price, float $upfrontPercent, int $months): array
    {
        $upfrontAmount = round($price * ($upfrontPercent / 100), 2);
        $remainingBase = round($price - $upfrontAmount, 2);

        // Determine markup rate from listing (passed externally) or default
        $markupRate = 0;
        // The caller passes the rate directly

        return $this->buildBreakdown($price, $upfrontAmount, $upfrontPercent, $remainingBase, $markupRate, $months);
    }

    /**
     * Preview a specific listing's installment options.
     */
    public function previewListingPlan(Listing $listing, int $months): array
    {
        if (! $listing->allow_installment) {
            throw new \InvalidArgumentException('This listing does not support installment payments.');
        }

        $price = (float) $listing->price;
        $upfrontPercent = (float) $listing->min_upfront_percent;
        $markupRate = $months === 6
            ? (float) $listing->installment_markup_6m
            : (float) $listing->installment_markup_12m;

        $upfrontAmount = round($price * ($upfrontPercent / 100), 2);
        $remainingBase = round($price - $upfrontAmount, 2);

        return $this->buildBreakdown($price, $upfrontAmount, $upfrontPercent, $remainingBase, $markupRate, $months);
    }

    private function buildBreakdown(
        float $price,
        float $upfrontAmount,
        float $upfrontPercent,
        float $remainingBase,
        float $markupRate,
        int $months,
    ): array {
        $markupAmount = round($remainingBase * ($markupRate / 100), 2);
        $totalRemaining = round($remainingBase + $markupAmount, 2);
        $monthlyAmount = round($totalRemaining / $months, 2);

        // Adjust last payment for rounding
        $totalFromMonthly = round($monthlyAmount * $months, 2);
        $roundingAdjustment = round($totalRemaining - $totalFromMonthly, 2);

        $totalCost = round($upfrontAmount + $totalRemaining, 2);

        return [
            'itemPrice' => $price,
            'upfrontPercent' => $upfrontPercent,
            'upfrontAmount' => $upfrontAmount,
            'remainingBase' => $remainingBase,
            'markupPercent' => $markupRate,
            'markupAmount' => $markupAmount,
            'totalRemaining' => $totalRemaining,
            'monthlyAmount' => $monthlyAmount,
            'numberOfPayments' => $months,
            'totalCost' => $totalCost,
            'roundingAdjustment' => $roundingAdjustment,
        ];
    }

    // ────────────────────────────────────────────────
    // PURCHASE (CREATE INSTALLMENT)
    // ────────────────────────────────────────────────

    public function createInstallmentPurchase(User $buyer, Listing $listing, int $months): array
    {
        // Validations
        if (! $listing->allow_installment) {
            throw new \InvalidArgumentException('This listing does not support installment payments.');
        }

        if ($listing->status !== ListingStatus::Active) {
            throw new \InvalidArgumentException('This listing is no longer available for purchase.');
        }

        if ($listing->stock_quantity <= 0) {
            throw new \InvalidArgumentException('This listing is out of stock.');
        }

        if ($listing->vendor_id === $buyer->id) {
            throw new \InvalidArgumentException('You cannot purchase your own listing.');
        }

        if (! in_array($months, [6, 12])) {
            throw new \InvalidArgumentException('Installment plan must be 6 or 12 months.');
        }

        // Calculate plan
        $breakdown = $this->previewListingPlan($listing, $months);
        $price = (float) $listing->price;
        $commissionAmount = round($price * self::COMMISSION_RATE, 2);
        $vendorAmount = round($price - $commissionAmount, 2);

        return DB::transaction(function () use (
            $buyer, $listing, $months, $breakdown, $price, $commissionAmount, $vendorAmount
        ) {
            // 1. Debit buyer wallet for upfront amount only
            $buyerWallet = $this->walletService->getOrCreateWallet($buyer);
            $upfrontAmount = $breakdown['upfrontAmount'];

            if ((float) $buyerWallet->real_balance < $upfrontAmount) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance for upfront payment. Available: ₦'
                    . number_format($buyerWallet->real_balance, 2)
                    . '. Required: ₦' . number_format($upfrontAmount, 2)
                );
            }

            $buyerWallet->decrement('real_balance', $upfrontAmount);
            $buyerWallet->refresh();

            // 2. Credit vendor full item price (PenniVault takes credit risk)
            $vendor = User::findOrFail($listing->vendor_id);
            $vendorWallet = $this->walletService->getOrCreateWallet($vendor);
            $vendorWallet->increment('real_balance', $vendorAmount);
            $vendorWallet->refresh();

            // 3. Create Order (payment_method = installment)
            $order = Order::create([
                'buyer_id' => $buyer->id,
                'listing_id' => $listing->id,
                'vendor_id' => $listing->vendor_id,
                'amount' => $price,
                'commission_amount' => $commissionAmount,
                'vendor_amount' => $vendorAmount,
                'status' => OrderStatus::Confirmed,
                'reference' => $this->generateReference('ORD'),
                'payment_method' => PaymentMethod::Installment,
            ]);

            // 4. Create buyer upfront transaction
            Transaction::create([
                'user_id' => $buyer->id,
                'wallet_id' => $buyerWallet->id,
                'type' => TransactionType::InstallmentUpfront,
                'category' => 'Installment Upfront Payment',
                'amount' => -$upfrontAmount,
                'balance_after' => $buyerWallet->real_balance,
                'description' => "Installment upfront ({$breakdown['upfrontPercent']}%): {$listing->title}",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('IUP'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'listing_id' => $listing->id,
                    'listing_title' => $listing->title,
                    'installment_months' => $months,
                    'upfront_percent' => $breakdown['upfrontPercent'],
                ],
            ]);

            // 5. Vendor sale + commission records (same as full purchase)
            Transaction::create([
                'user_id' => $vendor->id,
                'wallet_id' => $vendorWallet->id,
                'type' => TransactionType::Sale,
                'category' => 'Marketplace Sale (Installment)',
                'amount' => $vendorAmount,
                'balance_after' => $vendorWallet->real_balance,
                'description' => "Sale: {$listing->title} (installment, 5% commission deducted)",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('SAL'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'listing_id' => $listing->id,
                    'buyer_id' => $buyer->id,
                    'gross_amount' => $price,
                    'commission_amount' => $commissionAmount,
                    'payment_method' => 'installment',
                ],
            ]);

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

            // 6. Create installment plan
            $firstDueDate = now()->addMonth();

            $plan = InstallmentPlan::create([
                'order_id' => $order->id,
                'user_id' => $buyer->id,
                'total_amount' => $breakdown['totalCost'],
                'upfront_amount' => $upfrontAmount,
                'upfront_percent' => $breakdown['upfrontPercent'],
                'remaining_amount' => $breakdown['totalRemaining'],
                'markup_percent' => $breakdown['markupPercent'],
                'markup_amount' => $breakdown['markupAmount'],
                'monthly_amount' => $breakdown['monthlyAmount'],
                'number_of_payments' => $months,
                'payments_completed' => 0,
                'next_payment_due_at' => $firstDueDate,
                'status' => InstallmentPlanStatus::Active,
            ]);

            // 7. Create individual payment records
            for ($i = 1; $i <= $months; $i++) {
                $amount = $breakdown['monthlyAmount'];

                // Add rounding adjustment to last payment
                if ($i === $months && $breakdown['roundingAdjustment'] != 0) {
                    $amount = round($amount + $breakdown['roundingAdjustment'], 2);
                }

                InstallmentPayment::create([
                    'installment_plan_id' => $plan->id,
                    'payment_number' => $i,
                    'amount' => $amount,
                    'due_date' => now()->addMonths($i),
                    'status' => InstallmentPaymentStatus::Pending,
                ]);
            }

            // 8. Update listing stock
            $listing->decrement('stock_quantity');
            $listing->refresh();

            if ($listing->stock_quantity <= 0) {
                $listing->update(['status' => ListingStatus::Sold]);
            }

            $order->load(['listing', 'buyer:id,first_name,last_name', 'vendor:id,first_name,last_name']);
            $plan->load('payments');

            return [
                'order' => $order,
                'installmentPlan' => $plan,
            ];
        });
    }

    // ────────────────────────────────────────────────
    // PROCESS MONTHLY PAYMENT
    // ────────────────────────────────────────────────

    public function processPayment(InstallmentPlan $plan): InstallmentPayment
    {
        if (! in_array($plan->status, [InstallmentPlanStatus::Active, InstallmentPlanStatus::Overdue])) {
            throw new \InvalidArgumentException('This installment plan is not eligible for payment.');
        }

        $payment = $plan->payments()
            ->whereIn('status', [InstallmentPaymentStatus::Pending, InstallmentPaymentStatus::Overdue])
            ->orderBy('payment_number')
            ->first();

        if (! $payment) {
            throw new \InvalidArgumentException('No pending payments found for this plan.');
        }

        return DB::transaction(function () use ($plan, $payment) {
            $user = $plan->user;
            $wallet = $this->walletService->getOrCreateWallet($user);
            $amount = (float) $payment->amount;

            if ((float) $wallet->real_balance < $amount) {
                throw new \InvalidArgumentException(
                    'Insufficient wallet balance. Available: ₦'
                    . number_format($wallet->real_balance, 2)
                    . '. Required: ₦' . number_format($amount, 2)
                );
            }

            // Debit wallet
            $wallet->decrement('real_balance', $amount);
            $wallet->refresh();

            // Record transaction
            $order = $plan->order;
            $listing = $order->listing;

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => TransactionType::InstallmentPayment,
                'category' => 'Installment Payment',
                'amount' => -$amount,
                'balance_after' => $wallet->real_balance,
                'description' => "Installment #{$payment->payment_number}/{$plan->number_of_payments}: {$listing->title}",
                'status' => TransactionStatus::Completed,
                'reference' => $this->generateReference('INS'),
                'transactionable_type' => Order::class,
                'transactionable_id' => $order->id,
                'metadata' => [
                    'installment_plan_id' => $plan->id,
                    'payment_number' => $payment->payment_number,
                    'listing_title' => $listing->title,
                ],
            ]);

            // Mark payment as paid
            $payment->update([
                'status' => InstallmentPaymentStatus::Paid,
                'paid_at' => now(),
                'transaction_id' => $transaction->id,
            ]);

            // Update plan counters
            $plan->increment('payments_completed');
            $plan->refresh();

            // Check if all payments completed
            if ($plan->payments_completed >= $plan->number_of_payments) {
                $plan->update([
                    'status' => InstallmentPlanStatus::Completed,
                    'next_payment_due_at' => null,
                ]);
            } else {
                // Set next due date
                $nextPayment = $plan->payments()
                    ->where('status', InstallmentPaymentStatus::Pending)
                    ->orderBy('payment_number')
                    ->first();

                $plan->update([
                    'next_payment_due_at' => $nextPayment?->due_date,
                    'status' => InstallmentPlanStatus::Active,
                ]);
            }

            $payment->refresh();

            return $payment;
        });
    }

    // ────────────────────────────────────────────────
    // QUERY PLANS
    // ────────────────────────────────────────────────

    public function getUserPlans(User $user, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = InstallmentPlan::where('user_id', $user->id)
            ->with([
                'order.listing:id,title,category,price,images',
                'order.vendor:id,first_name,last_name',
            ])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function getUserPlanById(string $planId, User $user): InstallmentPlan
    {
        return InstallmentPlan::where('user_id', $user->id)
            ->with([
                'order.listing',
                'order.vendor:id,first_name,last_name',
                'payments',
            ])
            ->findOrFail($planId);
    }

    public function getVendorPlans(User $vendor, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = InstallmentPlan::whereHas('order', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        })
            ->with([
                'order.listing:id,title,category,price,images',
                'order.buyer:id,first_name,last_name',
                'user:id,first_name,last_name',
            ])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    // ────────────────────────────────────────────────
    // OVERDUE CHECK (Scheduled)
    // ────────────────────────────────────────────────

    public function checkOverdue(): int
    {
        $count = 0;

        // Mark individual payments as overdue
        $overduePayments = InstallmentPayment::where('status', InstallmentPaymentStatus::Pending)
            ->where('due_date', '<', now()->startOfDay())
            ->get();

        foreach ($overduePayments as $payment) {
            $payment->update(['status' => InstallmentPaymentStatus::Overdue]);
            $count++;
        }

        // Mark plans with overdue payments as overdue
        $activePlans = InstallmentPlan::where('status', InstallmentPlanStatus::Active)->get();

        foreach ($activePlans as $plan) {
            $hasOverdue = $plan->payments()
                ->where('status', InstallmentPaymentStatus::Overdue)
                ->exists();

            if ($hasOverdue) {
                $plan->update(['status' => InstallmentPlanStatus::Overdue]);
            }
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
}
