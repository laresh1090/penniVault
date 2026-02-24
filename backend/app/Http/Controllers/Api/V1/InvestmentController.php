<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateInvestmentRequest;
use App\Http\Requests\Api\V1\InvestRequest;
use App\Http\Requests\Api\V1\UpdateInvestmentRequest;
use App\Http\Resources\CrowdInvestmentCollection;
use App\Http\Resources\CrowdInvestmentResource;
use App\Http\Resources\UserInvestmentCollection;
use App\Http\Resources\UserInvestmentResource;
use App\Http\Resources\WalletResource;
use App\Models\CrowdInvestment;
use App\Models\UserInvestment;
use App\Services\InvestmentService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    public function __construct(
        private readonly InvestmentService $investmentService,
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // PUBLIC — BROWSE INVESTMENTS
    // ────────────────────────────────────────────────

    public function index(Request $request): CrowdInvestmentCollection
    {
        $filters = $request->only([
            'search', 'category', 'status', 'riskLevel',
            'minReturn', 'maxReturn', 'minInvestment',
            'location', 'vendorId', 'sort',
        ]);

        $perPage = min((int) $request->input('perPage', 15), 50);

        return new CrowdInvestmentCollection(
            $this->investmentService->getInvestments($filters, $perPage)
        );
    }

    public function show(CrowdInvestment $investment): JsonResponse
    {
        $investment->load(['vendor:id,first_name,last_name,avatar_url', 'vendor.vendorProfile']);
        $investment->loadCount('userInvestments');

        return response()->json([
            'investment' => new CrowdInvestmentResource($investment),
        ]);
    }

    // ────────────────────────────────────────────────
    // VENDOR CRUD (Protected)
    // ────────────────────────────────────────────────

    public function store(CreateInvestmentRequest $request): JsonResponse
    {
        try {
            $investment = $this->investmentService->createInvestment(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'message' => 'Investment opportunity created successfully.',
                'investment' => new CrowdInvestmentResource($investment),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(
        UpdateInvestmentRequest $request,
        CrowdInvestment $investment
    ): JsonResponse {
        if ($investment->vendor_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own investments.',
            ], 403);
        }

        try {
            $updated = $this->investmentService->updateInvestment(
                $investment,
                $request->validated()
            );

            return response()->json([
                'message' => 'Investment updated successfully.',
                'investment' => new CrowdInvestmentResource($updated),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, CrowdInvestment $investment): JsonResponse
    {
        if ($investment->vendor_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only cancel your own investments.',
            ], 403);
        }

        try {
            $closed = $this->investmentService->deleteInvestment($investment);

            return response()->json([
                'message' => 'Investment cancelled successfully.',
                'investment' => new CrowdInvestmentResource($closed),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ────────────────────────────────────────────────
    // VENDOR — OWN INVESTMENTS
    // ────────────────────────────────────────────────

    public function vendorInvestments(Request $request): CrowdInvestmentCollection
    {
        $filters = $request->only(['status', 'category']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new CrowdInvestmentCollection(
            $this->investmentService->getVendorInvestments($request->user(), $filters, $perPage)
        );
    }

    // ────────────────────────────────────────────────
    // USER — INVEST + PORTFOLIO
    // ────────────────────────────────────────────────

    public function invest(InvestRequest $request, CrowdInvestment $investment): JsonResponse
    {
        try {
            $result = $this->investmentService->investFromWallet(
                $request->user(),
                $investment,
                (float) $request->input('amount')
            );

            $wallet = $this->walletService->getOrCreateWallet($request->user());

            return response()->json([
                'message' => 'Investment successful.',
                'userInvestment' => new UserInvestmentResource($result['userInvestment']),
                'investment' => new CrowdInvestmentResource($result['investment']),
                'wallet' => new WalletResource($wallet->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function myInvestments(Request $request): UserInvestmentCollection
    {
        $filters = $request->only(['status', 'category']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new UserInvestmentCollection(
            $this->investmentService->getUserInvestments($request->user(), $filters, $perPage)
        );
    }

    public function myInvestmentsSummary(Request $request): JsonResponse
    {
        $summary = $this->investmentService->getUserInvestmentSummary($request->user());

        return response()->json(['data' => $summary]);
    }

    public function myInvestmentShow(Request $request, UserInvestment $userInvestment): JsonResponse
    {
        if ($userInvestment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $userInvestment->load('crowdInvestment');

        return response()->json([
            'userInvestment' => new UserInvestmentResource($userInvestment),
        ]);
    }

    // ────────────────────────────────────────────────
    // ADMIN — MATURATION
    // ────────────────────────────────────────────────

    public function mature(Request $request, CrowdInvestment $investment): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $actualReturnPercent = $request->has('actualReturnPercent')
                ? (float) $request->input('actualReturnPercent')
                : null;

            $result = $this->investmentService->matureInvestment($investment, $actualReturnPercent);

            return response()->json([
                'message' => 'Investment matured and returns distributed.',
                'investment' => new CrowdInvestmentResource($result['investment']),
                'returnPercent' => $result['returnPercent'],
                'totalDistributed' => $result['totalDistributed'],
                'investorCount' => $result['investorCount'],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
