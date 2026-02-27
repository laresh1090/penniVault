<?php

namespace Database\Seeders;

use App\Enums\InstallmentPaymentStatus;
use App\Enums\InstallmentPlanStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\InstallmentPayment;
use App\Models\InstallmentPlan;
use App\Models\Listing;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InstallmentSeeder extends Seeder
{
    public function run(): void
    {
        $adebayo = User::where('email', 'adebayo@test.com')->firstOrFail();
        $chidinma = User::where('email', 'chidinma@test.com')->firstOrFail();

        // Get installment-enabled listings
        $listings = Listing::where('allow_installment', true)->get();

        if ($listings->isEmpty()) {
            return;
        }

        // ── Plan 1: Adebayo — Active 6-month plan (3 of 6 paid) ──
        $listing1 = $listings->first();
        $this->createInstallmentPlan(
            buyer: $adebayo,
            listing: $listing1,
            months: 6,
            paidCount: 3,
            status: InstallmentPlanStatus::Active,
            startDate: now()->subMonths(3),
        );

        // ── Plan 2: Adebayo — Completed 6-month plan ──
        if ($listings->count() >= 2) {
            $listing2 = $listings->skip(1)->first();
            $this->createInstallmentPlan(
                buyer: $adebayo,
                listing: $listing2,
                months: 6,
                paidCount: 6,
                status: InstallmentPlanStatus::Completed,
                startDate: now()->subMonths(7),
            );
        }

        // ── Plan 3: Chidinma — Active 12-month plan (2 of 12 paid, next overdue) ──
        if ($listings->count() >= 3) {
            $listing3 = $listings->skip(2)->first();
            $this->createInstallmentPlan(
                buyer: $chidinma,
                listing: $listing3,
                months: 12,
                paidCount: 2,
                status: InstallmentPlanStatus::Overdue,
                startDate: now()->subMonths(3),
            );
        }

        // ── Plan 4: Chidinma — Active 6-month plan (1 of 6 paid) ──
        $this->createInstallmentPlan(
            buyer: $chidinma,
            listing: $listing1,
            months: 6,
            paidCount: 1,
            status: InstallmentPlanStatus::Active,
            startDate: now()->subMonth(),
        );
    }

    private function createInstallmentPlan(
        User $buyer,
        Listing $listing,
        int $months,
        int $paidCount,
        InstallmentPlanStatus $status,
        \Carbon\Carbon $startDate,
    ): void {
        $price = (float) $listing->price;
        $upfrontPercent = (float) $listing->min_upfront_percent;
        $markupPercent = $months === 6
            ? (float) $listing->installment_markup_6m
            : (float) $listing->installment_markup_12m;

        $upfrontAmount = round($price * ($upfrontPercent / 100), 2);
        $remainingBase = $price - $upfrontAmount;
        $markupAmount = round($remainingBase * ($markupPercent / 100), 2);
        $totalRemaining = $remainingBase + $markupAmount;
        $monthlyAmount = round($totalRemaining / $months, 2);
        $totalAmount = $upfrontAmount + $totalRemaining;

        // Create the order
        $commission = round($price * 0.05, 2);
        $vendorAmount = round($price - $commission, 2);

        $order = Order::create([
            'buyer_id' => $buyer->id,
            'listing_id' => $listing->id,
            'vendor_id' => $listing->vendor_id,
            'amount' => $price,
            'commission_amount' => $commission,
            'vendor_amount' => $vendorAmount,
            'status' => $status === InstallmentPlanStatus::Completed
                ? OrderStatus::Completed
                : OrderStatus::Confirmed,
            'payment_method' => PaymentMethod::Installment,
            'reference' => 'PV-ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'metadata' => ['installment_months' => $months],
        ]);

        // Determine next due date
        $nextDueAt = $paidCount < $months
            ? $startDate->copy()->addMonths($paidCount)
            : null;

        $plan = InstallmentPlan::create([
            'order_id' => $order->id,
            'user_id' => $buyer->id,
            'total_amount' => $totalAmount,
            'upfront_amount' => $upfrontAmount,
            'upfront_percent' => $upfrontPercent,
            'remaining_amount' => $totalRemaining,
            'markup_percent' => $markupPercent,
            'markup_amount' => $markupAmount,
            'monthly_amount' => $monthlyAmount,
            'number_of_payments' => $months,
            'payments_completed' => $paidCount,
            'next_payment_due_at' => $nextDueAt,
            'status' => $status,
        ]);

        // Create individual payment records
        for ($i = 1; $i <= $months; $i++) {
            $dueDate = $startDate->copy()->addMonths($i - 1);
            $isPaid = $i <= $paidCount;
            $isOverdue = !$isPaid && $dueDate->isPast();

            InstallmentPayment::create([
                'installment_plan_id' => $plan->id,
                'payment_number' => $i,
                'amount' => $monthlyAmount,
                'due_date' => $dueDate,
                'paid_at' => $isPaid ? $dueDate->copy()->addDays(rand(0, 3)) : null,
                'status' => $isPaid
                    ? InstallmentPaymentStatus::Paid
                    : ($isOverdue ? InstallmentPaymentStatus::Overdue : InstallmentPaymentStatus::Pending),
            ]);
        }
    }
}
