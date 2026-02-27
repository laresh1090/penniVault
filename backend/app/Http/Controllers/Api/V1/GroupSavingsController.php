<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupSavingsResource;
use App\Models\GroupSavings;
use App\Models\Listing;
use App\Services\GroupSavingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupSavingsController extends Controller
{
    public function __construct(
        private GroupSavingsService $groupService,
    ) {}

    /**
     * List all groups (for browsing/joining).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'status' => $request->query('status'),
            'mode' => $request->query('mode'),
            'hasSlots' => $request->boolean('hasSlots'),
            'perPage' => $request->integer('perPage', 15),
        ];

        $groups = $this->groupService->listGroups($filters);

        return response()->json([
            'data' => GroupSavingsResource::collection($groups),
            'meta' => [
                'currentPage' => $groups->currentPage(),
                'lastPage' => $groups->lastPage(),
                'total' => $groups->total(),
            ],
        ]);
    }

    /**
     * Get groups the authenticated user belongs to.
     */
    public function mine(Request $request): JsonResponse
    {
        $groups = $this->groupService->getUserGroups($request->user());

        return response()->json([
            'data' => GroupSavingsResource::collection($groups),
        ]);
    }

    /**
     * Create a new peer-to-peer group.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'contribution_amount' => 'required|numeric|min:1000',
            'frequency' => 'required|in:daily,weekly,biweekly,monthly',
            'total_slots' => 'required|integer|min:2|max:30',
            'start_date' => 'nullable|date|after_or_equal:today',
            'freeze_payout_until_percent' => 'nullable|numeric|min:0|max:90',
        ]);

        $group = $this->groupService->createGroup($request->user(), $validated);

        return response()->json([
            'message' => 'Group created successfully.',
            'data' => new GroupSavingsResource($group),
        ], 201);
    }

    /**
     * Create a vendor-led ajo linked to a product.
     */
    public function storeVendorAjo(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isVendor()) {
            return response()->json(['message' => 'Only vendors can create vendor ajo groups.'], 403);
        }

        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'frequency' => 'required|in:daily,weekly,biweekly,monthly',
            'total_slots' => 'required|integer|min:2|max:30',
            'start_date' => 'nullable|date|after_or_equal:today',
            'payout_start_percent' => 'nullable|numeric|min:10|max:80',
        ]);

        $listing = Listing::findOrFail($validated['listing_id']);

        try {
            $group = $this->groupService->createVendorAjo($user, $listing, $validated);
            return response()->json([
                'message' => 'Vendor ajo group created successfully.',
                'data' => new GroupSavingsResource($group),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Get vendor's ajo groups.
     */
    public function vendorGroups(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isVendor()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $groups = $this->groupService->getVendorAjoGroups($user);

        return response()->json([
            'data' => GroupSavingsResource::collection($groups),
        ]);
    }

    /**
     * Get detailed view of a group (with payout schedule, activity, members).
     */
    public function show(GroupSavings $groupSaving): JsonResponse
    {
        $detail = $this->groupService->getGroupDetail($groupSaving);

        return response()->json(['data' => $detail]);
    }

    /**
     * Join an existing group.
     */
    public function join(Request $request, GroupSavings $groupSaving): JsonResponse
    {
        try {
            $member = $this->groupService->joinGroup($request->user(), $groupSaving);

            return response()->json([
                'message' => 'Successfully joined the group.',
                'data' => [
                    'userId' => $member->user_id,
                    'name' => $member->displayName(),
                    'position' => $member->position,
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Make a contribution for the current round.
     */
    public function contribute(Request $request, GroupSavings $groupSaving): JsonResponse
    {
        try {
            $contribution = $this->groupService->makeContribution($request->user(), $groupSaving);

            return response()->json([
                'message' => 'Contribution successful.',
                'data' => [
                    'round' => $contribution->round,
                    'amount' => (float) $contribution->amount,
                    'paidAt' => $contribution->paid_at->toISOString(),
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Activate a pending group (admin or creator only).
     */
    public function activate(Request $request, GroupSavings $groupSaving): JsonResponse
    {
        $user = $request->user();

        if ($groupSaving->created_by_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!$groupSaving->isFull()) {
            return response()->json(['message' => 'Group must be full before activation.'], 422);
        }

        $this->groupService->activateGroup($groupSaving);

        return response()->json(['message' => 'Group activated successfully.']);
    }
}
