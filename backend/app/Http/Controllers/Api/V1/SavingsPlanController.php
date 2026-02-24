<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateSavingsPlanRequest;
use App\Http\Requests\Api\V1\SavingsContributionRequest;
use App\Http\Requests\Api\V1\SavingsWithdrawalRequest;
use App\Http\Requests\Api\V1\UpdateSavingsPlanRequest;
use App\Http\Resources\SavingsPlanCollection;
use App\Http\Resources\SavingsPlanResource;
use App\Http\Resources\TransactionResource;
use App\Models\SavingsPlan;
use App\Services\SavingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavingsPlanController extends Controller
{
    public function __construct(
        private readonly SavingsService $savingsService,
    ) {}

    /**
     * GET /api/v1/savings-plans
     */
    public function index(Request $request): SavingsPlanCollection
    {
        $query = SavingsPlan::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($request->has('productType')) {
            $query->where('product_type', $request->input('productType'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = min((int) $request->input('perPage', 15), 50);

        return new SavingsPlanCollection($query->paginate($perPage));
    }

    /**
     * POST /api/v1/savings-plans
     */
    public function store(CreateSavingsPlanRequest $request): JsonResponse
    {
        $plan = $this->savingsService->createPlan(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Savings plan created successfully.',
            'plan' => new SavingsPlanResource($plan),
        ], 201);
    }

    /**
     * GET /api/v1/savings-plans/{savingsPlan}
     */
    public function show(Request $request, SavingsPlan $savingsPlan): JsonResponse
    {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $savingsPlan->load(['transactions' => function ($q) {
            $q->orderBy('created_at', 'desc')->limit(20);
        }]);

        return response()->json([
            'plan' => new SavingsPlanResource($savingsPlan),
        ]);
    }

    /**
     * PUT /api/v1/savings-plans/{savingsPlan}
     */
    public function update(
        UpdateSavingsPlanRequest $request,
        SavingsPlan $savingsPlan
    ): JsonResponse {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validated();
        $data = [];

        $mapping = [
            'name' => 'name',
            'description' => 'description',
            'contributionAmount' => 'contribution_amount',
            'frequency' => 'frequency',
        ];

        foreach ($mapping as $camel => $snake) {
            if (array_key_exists($camel, $validated)) {
                $data[$snake] = $validated[$camel];
            }
        }

        $savingsPlan->update($data);

        return response()->json([
            'message' => 'Savings plan updated successfully.',
            'plan' => new SavingsPlanResource($savingsPlan->fresh()),
        ]);
    }

    /**
     * POST /api/v1/savings-plans/{savingsPlan}/deposit
     */
    public function deposit(
        SavingsContributionRequest $request,
        SavingsPlan $savingsPlan
    ): JsonResponse {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $transaction = $this->savingsService->deposit(
                $savingsPlan,
                (float) $request->input('amount'),
                $request->input('source', 'wallet')
            );

            return response()->json([
                'message' => 'Deposit successful.',
                'transaction' => new TransactionResource($transaction),
                'plan' => new SavingsPlanResource($savingsPlan->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/v1/savings-plans/{savingsPlan}/withdraw
     */
    public function withdraw(
        SavingsWithdrawalRequest $request,
        SavingsPlan $savingsPlan
    ): JsonResponse {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $result = $this->savingsService->withdraw(
                $savingsPlan,
                (float) $request->input('amount'),
                $request->boolean('confirmPenalty', false)
            );

            return response()->json([
                'message' => 'Withdrawal successful.',
                'transaction' => new TransactionResource($result['transaction']),
                'penaltyAmount' => $result['penaltyAmount'],
                'netAmount' => $result['netAmount'],
                'plan' => new SavingsPlanResource($savingsPlan->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/v1/savings-plans/{savingsPlan}/pause
     */
    public function pause(Request $request, SavingsPlan $savingsPlan): JsonResponse
    {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $plan = $this->savingsService->pause($savingsPlan);

            return response()->json([
                'message' => 'Plan paused successfully.',
                'plan' => new SavingsPlanResource($plan),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/v1/savings-plans/{savingsPlan}/resume
     */
    public function resume(Request $request, SavingsPlan $savingsPlan): JsonResponse
    {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $plan = $this->savingsService->resume($savingsPlan);

            return response()->json([
                'message' => 'Plan resumed successfully.',
                'plan' => new SavingsPlanResource($plan),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/v1/savings-plans/{savingsPlan}/cancel
     */
    public function cancel(Request $request, SavingsPlan $savingsPlan): JsonResponse
    {
        if ($savingsPlan->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $result = $this->savingsService->cancel($savingsPlan);

            return response()->json([
                'message' => 'Plan cancelled. Remaining balance has been returned to your wallet.',
                'withdrawalResult' => $result ? [
                    'penaltyAmount' => $result['penaltyAmount'],
                    'netAmount' => $result['netAmount'],
                ] : null,
                'plan' => new SavingsPlanResource($savingsPlan->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/v1/savings-plans/summary
     */
    public function summary(Request $request): JsonResponse
    {
        $summary = $this->savingsService->getUserSavingsSummary($request->user());

        return response()->json(['data' => $summary]);
    }
}
