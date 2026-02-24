import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { mockVendorListings, mockVendorOrders } from "@/data/dashboard";
import { mockCrowdInvestments } from "@/data/investments";
import type {
  Listing,
  Order,
  ListingFilters,
  OrderFilters,
  CrowdInvestment,
  InvestmentFilters,
  PaginatedResponse,
} from "@/types";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

function buildParams(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      params.append(key, String(val));
    }
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}

// ── Payload types for vendor CRUD ──

export interface CreateListingPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  stockQuantity: number;
  images: string[];
  status?: "active" | "draft";
  allowInstallment?: boolean;
  minUpfrontPercent?: number;
  installmentMarkup6m?: number;
  installmentMarkup12m?: number;
}

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  stockQuantity?: number;
  images?: string[];
  status?: string;
  allowInstallment?: boolean;
  minUpfrontPercent?: number;
  installmentMarkup6m?: number;
  installmentMarkup12m?: number;
}

export interface CreateInvestmentPayload {
  title: string;
  description: string;
  category: string;
  images: string[];
  location: string;
  targetAmount: number;
  minimumInvestment: number;
  expectedRoiPercent: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  riskLevel: string;
}

export interface UpdateInvestmentPayload {
  title?: string;
  description?: string;
  category?: string;
  images?: string[];
  location?: string;
  targetAmount?: number;
  minimumInvestment?: number;
  expectedRoiPercent?: number;
  durationDays?: number;
  startDate?: string;
  endDate?: string;
  riskLevel?: string;
}

export const vendorService = {
  // ── Listings CRUD ──

  async getMyListings(
    filters?: ListingFilters,
  ): Promise<PaginatedResponse<Listing>> {
    if (useMockData()) {
      await delay();
      // Convert mock vendor listings to Listing shape
      const items: Listing[] = mockVendorListings.map((l) => ({
        id: l.id,
        vendorId: "vnd_mock",
        title: l.title,
        description: "",
        category: l.category === "lifestyle" ? "other" : l.category as Listing["category"],
        price: l.price,
        images: [l.imageUrl],
        primaryImage: l.imageUrl || null,
        location: "Lagos, Nigeria",
        status: l.status === "sold" ? "sold" : l.status as Listing["status"],
        featured: false,
        stockQuantity: l.status === "sold" ? 0 : 1,
        inStock: l.status !== "sold",
        metadata: null,
        allowInstallment: false,
        minUpfrontPercent: 40,
        installmentMarkup6m: 5,
        installmentMarkup12m: 10,
        createdAt: l.createdAt,
        updatedAt: l.createdAt,
      }));
      const page = filters?.page || 1;
      const perPage = filters?.perPage || 12;
      const start = (page - 1) * perPage;
      return {
        data: items.slice(start, start + perPage),
        meta: { total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) },
      };
    }
    const qs = buildParams({ ...(filters || {}) });
    const { data } = await api.get(`/vendor/listings${qs}`);
    return { data: data.data as Listing[], meta: data.meta };
  },

  async createListing(payload: CreateListingPayload): Promise<Listing> {
    if (useMockData()) {
      await delay(500);
      throw new Error("Mock create not supported");
    }
    await csrf();
    const { data } = await api.post("/listings", payload);
    return data.listing as Listing;
  },

  async updateListing(id: string, payload: UpdateListingPayload): Promise<Listing> {
    if (useMockData()) {
      await delay(500);
      throw new Error("Mock update not supported");
    }
    await csrf();
    const { data } = await api.put(`/listings/${id}`, payload);
    return data.listing as Listing;
  },

  async deleteListing(id: string): Promise<void> {
    if (useMockData()) {
      await delay(300);
      return;
    }
    await csrf();
    await api.delete(`/listings/${id}`);
  },

  // ── Investments CRUD ──

  async getMyInvestments(
    filters?: InvestmentFilters,
  ): Promise<PaginatedResponse<CrowdInvestment>> {
    if (useMockData()) {
      await delay();
      const page = filters?.page || 1;
      const perPage = filters?.perPage || 12;
      const start = (page - 1) * perPage;
      return {
        data: mockCrowdInvestments.slice(start, start + perPage),
        meta: {
          total: mockCrowdInvestments.length,
          page,
          perPage,
          totalPages: Math.ceil(mockCrowdInvestments.length / perPage),
        },
      };
    }
    const qs = buildParams({ ...(filters || {}) });
    const { data } = await api.get(`/vendor/investments${qs}`);
    // Normalize backend fields to frontend CrowdInvestment shape
    const investments = (data.data as Record<string, unknown>[]).map((raw) => ({
      id: raw.id as string,
      vendorId: raw.vendorId as string,
      vendorName: "",
      title: raw.title as string,
      description: raw.description as string,
      category: raw.category as CrowdInvestment["category"],
      imageUrl: (raw.primaryImage as string) || ((raw.images as string[])?.[0]) || "",
      location: raw.location as string,
      targetAmount: raw.targetAmount as number,
      raisedAmount: raw.currentAmount as number,
      minimumInvestment: raw.minimumInvestment as number,
      expectedReturnPercent: raw.expectedRoiPercent as number,
      durationDays: raw.durationDays as number,
      startDate: raw.startDate as string,
      maturityDate: raw.endDate as string,
      status: raw.status as CrowdInvestment["status"],
      investorsCount: (raw.investorCount as number) ?? 0,
      riskLevel: raw.riskLevel as CrowdInvestment["riskLevel"],
      createdAt: raw.createdAt as string,
    })) as CrowdInvestment[];
    return { data: investments, meta: data.meta };
  },

  async createInvestment(payload: CreateInvestmentPayload): Promise<CrowdInvestment> {
    if (useMockData()) {
      await delay(500);
      throw new Error("Mock create not supported");
    }
    await csrf();
    const { data } = await api.post("/investments", payload);
    return data.investment as CrowdInvestment;
  },

  async updateInvestment(id: string, payload: UpdateInvestmentPayload): Promise<CrowdInvestment> {
    if (useMockData()) {
      await delay(500);
      throw new Error("Mock update not supported");
    }
    await csrf();
    const { data } = await api.put(`/investments/${id}`, payload);
    return data.investment as CrowdInvestment;
  },

  async deleteInvestment(id: string): Promise<void> {
    if (useMockData()) {
      await delay(300);
      return;
    }
    await csrf();
    await api.delete(`/investments/${id}`);
  },

  // ── Vendor Orders/Sales ──

  async getMySales(
    filters?: OrderFilters,
  ): Promise<PaginatedResponse<Order>> {
    if (useMockData()) {
      await delay();
      const items: Order[] = mockVendorOrders.map((o) => ({
        id: o.id,
        buyerId: "usr_mock",
        listingId: "lst_mock",
        vendorId: "vnd_mock",
        amount: o.amount,
        commissionAmount: Math.round(o.amount * 0.05),
        vendorAmount: Math.round(o.amount * 0.95),
        status: o.status as Order["status"],
        reference: `REF-${o.id}`,
        paymentMethod: "full" as const,
        metadata: null,
        buyer: { id: "usr_mock", firstName: o.buyerName.split(" ")[0], lastName: o.buyerName.split(" ")[1] || "" },
        listing: { id: "lst_mock", title: o.assetTitle, category: "property", primaryImage: null },
        createdAt: o.createdAt,
        updatedAt: o.createdAt,
      }));
      const page = filters?.page || 1;
      const perPage = filters?.perPage || 20;
      const start = (page - 1) * perPage;
      return {
        data: items.slice(start, start + perPage),
        meta: { total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) },
      };
    }
    const qs = buildParams({ ...(filters || {}) });
    const { data } = await api.get(`/vendor/sales${qs}`);
    return { data: data.data as Order[], meta: data.meta };
  },
};
