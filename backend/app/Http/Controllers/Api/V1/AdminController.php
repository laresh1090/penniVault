<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AccountStatus;
use App\Enums\GroupSavingsStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\GroupSavings;
use App\Models\Listing;
use App\Models\Order;
use App\Models\SavingsPlan;
use App\Models\Transaction;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Dashboard statistics (KPIs).
     */
    public function dashboardStats(): JsonResponse
    {
        $totalUsers = User::where('role', UserRole::User)->count();
        $totalVendors = User::where('role', UserRole::Vendor)->count();
        $pendingVendors = VendorProfile::where('is_approved', false)->count();

        $savingsVolume = SavingsPlan::where('status', 'active')->sum('current_amount');
        $activeGroups = GroupSavings::where('status', GroupSavingsStatus::Active)->count();
        $groupMembers = \App\Models\GroupMember::whereNull('left_at')->count();

        $transactionsThisMonth = Transaction::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $revenue = Order::where('status', 'confirmed')
            ->sum('commission_amount');

        return response()->json([
            'data' => [
                'totalUsers' => $totalUsers,
                'totalVendors' => $totalVendors,
                'pendingVendors' => $pendingVendors,
                'savingsVolume' => (float) $savingsVolume,
                'activeGroups' => $activeGroups,
                'groupMembers' => $groupMembers,
                'transactionsThisMonth' => $transactionsThisMonth,
                'platformRevenue' => (float) $revenue,
            ],
        ]);
    }

    /**
     * Recent users (for dashboard widget).
     */
    public function recentUsers(Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        $users = User::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn(User $u) => [
                'id' => $u->id,
                'name' => $u->first_name . ' ' . $u->last_name,
                'email' => $u->email,
                'role' => $u->role->value,
                'status' => $u->status->value,
                'joinedAt' => $u->created_at->toISOString(),
            ]);

        return response()->json(['data' => $users]);
    }

    /**
     * List all users (paginated, filterable).
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::orderBy('created_at', 'desc');

        if ($request->filled('role')) {
            $query->where('role', $request->query('role'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->integer('perPage', 15));

        return response()->json([
            'data' => $users->map(fn(User $u) => [
                'id' => $u->id,
                'name' => $u->first_name . ' ' . $u->last_name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role->value,
                'status' => $u->status->value,
                'joinedAt' => $u->created_at->toISOString(),
            ]),
            'meta' => [
                'total' => $users->total(),
                'page' => $users->currentPage(),
                'perPage' => $users->perPage(),
                'totalPages' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Update user status (activate, suspend, etc.).
     */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:active,pending,suspended',
            'role' => 'sometimes|in:user,vendor,admin',
        ]);

        if (isset($validated['status'])) {
            $user->status = AccountStatus::from($validated['status']);
        }
        if (isset($validated['role'])) {
            $user->role = UserRole::from($validated['role']);
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'role' => $user->role->value,
                'status' => $user->status->value,
            ],
        ]);
    }

    /**
     * Pending vendor approvals.
     */
    public function pendingVendors(): JsonResponse
    {
        $pending = VendorProfile::where('is_approved', false)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($vp) => [
                'id' => $vp->id,
                'businessName' => $vp->business_name,
                'ownerName' => $vp->user->first_name . ' ' . $vp->user->last_name,
                'category' => ucfirst($vp->business_type instanceof \BackedEnum ? $vp->business_type->value : $vp->business_type),
                'submittedAt' => $vp->created_at->toISOString(),
                'status' => 'pending',
            ]);

        return response()->json(['data' => $pending]);
    }

    /**
     * Approve a vendor.
     */
    public function approveVendor(VendorProfile $vendorProfile): JsonResponse
    {
        $vendorProfile->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        return response()->json(['message' => 'Vendor approved successfully.']);
    }

    /**
     * Reject a vendor.
     */
    public function rejectVendor(Request $request, VendorProfile $vendorProfile): JsonResponse
    {
        $vendorProfile->update([
            'is_approved' => false,
            'rejected_at' => now(),
            'rejection_reason' => $request->input('reason'),
        ]);

        return response()->json(['message' => 'Vendor rejected.']);
    }

    /**
     * Recent transactions (for dashboard widget).
     */
    public function recentTransactions(Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        $transactions = Transaction::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'userName' => $t->user ? $t->user->first_name . ' ' . $t->user->last_name : 'System',
                'type' => $t->type->value,
                'amount' => (float) $t->amount,
                'status' => $t->status->value,
                'description' => $t->description,
                'createdAt' => $t->created_at->toISOString(),
            ]);

        return response()->json(['data' => $transactions]);
    }

    /**
     * All transactions (paginated, filterable).
     */
    public function transactions(Request $request): JsonResponse
    {
        $query = Transaction::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('dateFrom')) {
            $query->where('created_at', '>=', $request->query('dateFrom'));
        }
        if ($request->filled('dateTo')) {
            $query->where('created_at', '<=', $request->query('dateTo') . ' 23:59:59');
        }

        $txns = $query->paginate($request->integer('perPage', 20));

        return response()->json([
            'data' => $txns->map(fn($t) => [
                'id' => $t->id,
                'userName' => $t->user ? $t->user->first_name . ' ' . $t->user->last_name : 'System',
                'type' => $t->type->value,
                'amount' => (float) $t->amount,
                'status' => $t->status->value,
                'description' => $t->description,
                'reference' => $t->reference,
                'createdAt' => $t->created_at->toISOString(),
            ]),
            'meta' => [
                'total' => $txns->total(),
                'page' => $txns->currentPage(),
                'perPage' => $txns->perPage(),
                'totalPages' => $txns->lastPage(),
            ],
        ]);
    }

    /**
     * Group savings overview (for dashboard widget).
     */
    public function groupSavingsOverview(): JsonResponse
    {
        $groups = GroupSavings::with(['members', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'members' => $g->filled_slots . ' / ' . $g->total_slots,
                'contribution' => (float) $g->contribution_amount,
                'frequency' => ucfirst($g->frequency->value),
                'currentRound' => $g->current_round . ' / ' . $g->total_rounds,
                'poolSize' => $g->poolSize(),
                'status' => $g->status->value,
                'createdBy' => $g->creator->first_name . ' ' . $g->creator->last_name,
            ]);

        return response()->json(['data' => $groups]);
    }

    /**
     * All savings plans (paginated).
     */
    public function savingsPlans(Request $request): JsonResponse
    {
        $query = SavingsPlan::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('productType')) {
            $query->where('product_type', $request->query('productType'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $plans = $query->paginate($request->integer('perPage', 20));

        return response()->json([
            'data' => $plans->map(fn($p) => [
                'id' => $p->id,
                'userName' => $p->user->first_name . ' ' . $p->user->last_name,
                'name' => $p->name,
                'productType' => $p->product_type->value,
                'targetAmount' => (float) $p->target_amount,
                'currentAmount' => (float) $p->current_amount,
                'status' => $p->status->value,
                'createdAt' => $p->created_at->toISOString(),
            ]),
            'meta' => [
                'total' => $plans->total(),
                'page' => $plans->currentPage(),
                'perPage' => $plans->perPage(),
                'totalPages' => $plans->lastPage(),
            ],
        ]);
    }

    /**
     * All listings (paginated).
     */
    public function listings(Request $request): JsonResponse
    {
        $query = Listing::with('vendor')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        $listings = $query->paginate($request->integer('perPage', 20));

        return response()->json([
            'data' => $listings->map(fn($l) => [
                'id' => $l->id,
                'title' => $l->title,
                'vendorName' => $l->vendor->first_name . ' ' . $l->vendor->last_name,
                'category' => $l->category->value,
                'price' => (float) $l->price,
                'status' => $l->status->value,
                'stockQuantity' => $l->stock_quantity,
                'createdAt' => $l->created_at->toISOString(),
            ]),
            'meta' => [
                'total' => $listings->total(),
                'page' => $listings->currentPage(),
                'perPage' => $listings->perPage(),
                'totalPages' => $listings->lastPage(),
            ],
        ]);
    }

    /**
     * Growth report data (monthly).
     */
    public function growthReport(): JsonResponse
    {
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('M');
            $users = User::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            $months->push([
                'month' => $month,
                'users' => $users,
            ]);
        }

        return response()->json(['data' => $months]);
    }

    /**
     * Savings volume report data (monthly).
     */
    public function savingsVolumeReport(): JsonResponse
    {
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('M');
            $volume = Transaction::whereIn('type', ['savings_contribution', 'group_contribution'])
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('amount');
            $months->push([
                'month' => $month,
                'volume' => abs((float) $volume),
            ]);
        }

        return response()->json(['data' => $months]);
    }
}
