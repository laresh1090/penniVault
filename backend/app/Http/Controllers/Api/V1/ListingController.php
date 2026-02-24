<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateListingRequest;
use App\Http\Requests\Api\V1\PurchaseListingRequest;
use App\Http\Requests\Api\V1\UpdateListingRequest;
use App\Http\Resources\ListingCollection;
use App\Http\Resources\ListingResource;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Http\Resources\WalletResource;
use App\Models\Listing;
use App\Models\Order;
use App\Services\MarketplaceService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function __construct(
        private readonly MarketplaceService $marketplaceService,
        private readonly WalletService $walletService,
    ) {}

    // ────────────────────────────────────────────────
    // PUBLIC — BROWSE LISTINGS
    // ────────────────────────────────────────────────

    public function index(Request $request): ListingCollection
    {
        $filters = $request->only([
            'search', 'category', 'minPrice', 'maxPrice',
            'location', 'vendorId', 'sort',
        ]);

        $perPage = min((int) $request->input('perPage', 15), 50);

        return new ListingCollection(
            $this->marketplaceService->getListings($filters, $perPage)
        );
    }

    public function show(Listing $listing): JsonResponse
    {
        $listing->load(['vendor:id,first_name,last_name,avatar_url', 'vendor.vendorProfile']);

        return response()->json([
            'listing' => new ListingResource($listing),
        ]);
    }

    // ────────────────────────────────────────────────
    // VENDOR CRUD (Protected)
    // ────────────────────────────────────────────────

    public function store(CreateListingRequest $request): JsonResponse
    {
        try {
            $listing = $this->marketplaceService->createListing(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'message' => 'Listing created successfully.',
                'listing' => new ListingResource($listing),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateListingRequest $request, Listing $listing): JsonResponse
    {
        if ($listing->vendor_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only update your own listings.'], 403);
        }

        try {
            $updated = $this->marketplaceService->updateListing(
                $listing,
                $request->validated()
            );

            return response()->json([
                'message' => 'Listing updated successfully.',
                'listing' => new ListingResource($updated),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, Listing $listing): JsonResponse
    {
        if ($listing->vendor_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only archive your own listings.'], 403);
        }

        try {
            $archived = $this->marketplaceService->deleteListing($listing);

            return response()->json([
                'message' => 'Listing archived successfully.',
                'listing' => new ListingResource($archived),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // ────────────────────────────────────────────────
    // VENDOR — OWN LISTINGS + SALES
    // ────────────────────────────────────────────────

    public function vendorListings(Request $request): ListingCollection
    {
        $filters = $request->only(['status', 'category']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new ListingCollection(
            $this->marketplaceService->getVendorListings($request->user(), $filters, $perPage)
        );
    }

    public function vendorSales(Request $request): OrderCollection
    {
        $filters = $request->only(['status']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new OrderCollection(
            $this->marketplaceService->getVendorSales($request->user(), $filters, $perPage)
        );
    }

    // ────────────────────────────────────────────────
    // USER — PURCHASE + ORDER HISTORY
    // ────────────────────────────────────────────────

    public function purchase(PurchaseListingRequest $request, Listing $listing): JsonResponse
    {
        try {
            $result = $this->marketplaceService->purchaseFromWallet(
                $request->user(),
                $listing
            );

            $wallet = $this->walletService->getOrCreateWallet($request->user());

            return response()->json([
                'message' => 'Purchase successful.',
                'order' => new OrderResource($result['order']),
                'wallet' => new WalletResource($wallet->fresh()),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function orders(Request $request): OrderCollection
    {
        $filters = $request->only(['status']);
        $perPage = min((int) $request->input('perPage', 15), 50);

        return new OrderCollection(
            $this->marketplaceService->getUserOrders($request->user(), $filters, $perPage)
        );
    }

    public function orderShow(Request $request, Order $order): JsonResponse
    {
        if ($order->buyer_id !== $request->user()->id && $order->vendor_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $order->load(['listing', 'buyer:id,first_name,last_name', 'vendor:id,first_name,last_name']);

        return response()->json([
            'order' => new OrderResource($order),
        ]);
    }
}
