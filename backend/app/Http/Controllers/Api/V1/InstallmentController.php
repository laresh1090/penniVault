<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PurchaseInstallmentRequest;
use App\Http\Resources\InstallmentPaymentResource;
use App\Http\Resources\InstallmentPlanCollection;
use App\Http\Resources\InstallmentPlanResource;
use App\Http\Resources\WalletResource;
use App\Models\InstallmentPlan;
use App\Models\Listing;
use App\Services\InstallmentService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstallmentController extends Controller
{
    public function __construct(
        private readonly InstallmentService $installmentService,
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // PREVIEW — Calculate plan breakdown
    // ────────────────────────────────────────────────

    public function preview(Request $request, Listing $listing): JsonResponse
    {
        $months = (int) $request->query('months', 6);

        if (! in_array($months, [6, 12])) {
            return response()->json(['message' => 'Months must be 6 or 12.'], 422);
        }

        try {
            $breakdown = $this->installmentService->previewListingPlan($listing, $months);

            return response()->json([
                'breakdown' => $breakdown,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ────────────────────────────────────────────────
    // PURCHASE — Create installment order
    // ────────────────────────────────────────────────

    public function purchase(PurchaseInstallmentRequest $request, Listing $listing): JsonResponse
    {
        try {
            $result = $this->installmentService->createInstallmentPurchase(
                $request->user(),
                $listing,
                (int) $request->validated('months')
            );

            $wallet = $this->walletService->getOrCreateWallet($request->user());

            return response()->json([
                'message' => 'Installment purchase successful. First payment is due in 30 days.',
                'order' => [
                    'id' => $result['order']->id,
                    'reference' => $result['order']->reference,
                ],
                'installmentPlan' => new InstallmentPlanResource($result['installmentPlan']),
                'wallet' => new WalletResource($wallet->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ────────────────────────────────────────────────
    // USER — List my installment plans
    // ────────────────────────────────────────────────

    public function index(Request $request): InstallmentPlanCollection
    {
        $filters = $request->only(['status']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new InstallmentPlanCollection(
            $this->installmentService->getUserPlans($request->user(), $filters, $perPage)
        );
    }

    // ────────────────────────────────────────────────
    // USER — View single plan with payments
    // ────────────────────────────────────────────────

    public function show(Request $request, InstallmentPlan $installmentPlan): JsonResponse
    {
        if ($installmentPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $installmentPlan->load([
            'order.listing',
            'order.vendor:id,first_name,last_name',
            'payments',
        ]);

        return response()->json([
            'installmentPlan' => new InstallmentPlanResource($installmentPlan),
        ]);
    }

    // ────────────────────────────────────────────────
    // USER — Make a payment
    // ────────────────────────────────────────────────

    public function pay(Request $request, InstallmentPlan $installmentPlan): JsonResponse
    {
        if ($installmentPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $payment = $this->installmentService->processPayment($installmentPlan);
            $wallet = $this->walletService->getOrCreateWallet($request->user());

            $installmentPlan->refresh();

            return response()->json([
                'message' => 'Payment successful.',
                'payment' => new InstallmentPaymentResource($payment),
                'installmentPlan' => new InstallmentPlanResource(
                    $installmentPlan->load(['order.listing:id,title,category,price,images', 'payments'])
                ),
                'wallet' => new WalletResource($wallet->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ────────────────────────────────────────────────
    // VENDOR — View installment plans on their sales
    // ────────────────────────────────────────────────

    public function vendorIndex(Request $request): InstallmentPlanCollection
    {
        $filters = $request->only(['status']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new InstallmentPlanCollection(
            $this->installmentService->getVendorPlans($request->user(), $filters, $perPage)
        );
    }
}
