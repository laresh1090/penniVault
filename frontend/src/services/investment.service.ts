import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { mockCrowdInvestments, mockUserInvestments } from "@/data/investments";
import type {
  CrowdInvestment,
  UserInvestment,
  InvestmentFilters,
  UserInvestmentFilters,
  PaginatedResponse,
} from "@/types";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export interface InvestFromWalletPayload {
  amount: number;
}

/**
 * Normalize a CrowdInvestment from the backend API response
 * to the frontend CrowdInvestment type shape.
 *
 * Backend uses: currentAmount, expectedRoiPercent, endDate, investorCount, images/primaryImage
 * Frontend uses: raisedAmount, expectedReturnPercent, maturityDate, investorsCount, imageUrl, vendorName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCrowdInvestment(raw: any): CrowdInvestment {
  const vendor = raw.vendor;
  const vendorName = vendor?.vendorProfile?.businessName
    || (vendor ? `${vendor.firstName} ${vendor.lastName}` : "Unknown");

  return {
    id: raw.id,
    vendorId: raw.vendorId,
    vendorName,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    imageUrl: raw.primaryImage || (raw.images?.[0]) || "",
    location: raw.location,
    targetAmount: raw.targetAmount,
    raisedAmount: raw.currentAmount,
    minimumInvestment: raw.minimumInvestment,
    expectedReturnPercent: raw.expectedRoiPercent,
    durationDays: raw.durationDays,
    startDate: raw.startDate,
    maturityDate: raw.endDate,
    status: raw.status,
    investorsCount: raw.investorCount ?? 0,
    riskLevel: raw.riskLevel,
    vendor: raw.vendor,
    createdAt: raw.createdAt,
  };
}

/**
 * Normalize a UserInvestment from the backend API response.
 *
 * Backend uses: crowdInvestmentId, amount, expectedReturn, actualReturn, crowdInvestment
 * Frontend uses: investmentId, amountInvested, interestEarned, investment, maturityDate
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUserInvestment(raw: any): UserInvestment {
  const crowdInvestment = raw.crowdInvestment
    ? normalizeCrowdInvestment(raw.crowdInvestment)
    : null;

  return {
    id: raw.id,
    userId: raw.userId,
    investmentId: raw.crowdInvestmentId,
    investment: crowdInvestment!,
    amountInvested: raw.amount,
    expectedReturn: raw.totalExpectedPayout ?? (raw.amount + raw.expectedReturn),
    interestEarned: raw.actualReturn ?? 0,
    investedAt: raw.investedAt,
    maturityDate: crowdInvestment?.maturityDate ?? raw.maturedAt ?? "",
    status: raw.status,
  };
}

export const investmentService = {
  async getInvestments(
    filters?: InvestmentFilters,
  ): Promise<PaginatedResponse<CrowdInvestment>> {
    if (useMockData()) {
      await delay();
      let items = [...mockCrowdInvestments];

      if (filters?.category && filters.category !== "all") {
        items = items.filter((i) => i.category === filters.category);
      }
      if (filters?.riskLevel && filters.riskLevel !== "all") {
        items = items.filter((i) => i.riskLevel === filters.riskLevel);
      }
      if (filters?.status && filters.status !== "all") {
        items = items.filter((i) => i.status === filters.status);
      }

      switch (filters?.sort) {
        case "highest-roi":
          items.sort((a, b) => b.expectedReturnPercent - a.expectedReturnPercent);
          break;
        case "lowest-minimum":
          items.sort((a, b) => a.minimumInvestment - b.minimumInvestment);
          break;
        case "most-funded":
          items.sort((a, b) => (b.raisedAmount / b.targetAmount) - (a.raisedAmount / a.targetAmount));
          break;
        default:
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }

      const page = filters?.page || 1;
      const perPage = filters?.perPage || 6;
      const start = (page - 1) * perPage;

      return {
        data: items.slice(start, start + perPage),
        meta: { total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) },
      };
    }

    // Real API
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "all") params.append("category", filters.category);
    if (filters?.riskLevel && filters.riskLevel !== "all") params.append("riskLevel", filters.riskLevel);
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.sort) {
      const sortMap: Record<string, string> = {
        "highest-roi": "return_desc",
        "lowest-minimum": "target_asc",
        "most-funded": "ending_soon",
        "newest": "newest",
      };
      params.append("sort", sortMap[filters.sort] || "newest");
    }
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/investments?${params.toString()}`);
    return {
      data: (data.data as unknown[]).map(normalizeCrowdInvestment),
      meta: data.meta,
    };
  },

  async getInvestmentById(id: string): Promise<CrowdInvestment | null> {
    if (useMockData()) {
      await delay();
      return mockCrowdInvestments.find((i) => i.id === id) || null;
    }
    try {
      const { data } = await api.get(`/investments/${id}`);
      return normalizeCrowdInvestment(data.investment);
    } catch {
      return null;
    }
  },

  async investFromWallet(
    investmentId: string,
    payload: InvestFromWalletPayload,
  ): Promise<UserInvestment> {
    if (useMockData()) {
      await delay(1500);
      throw new Error("Mock investment not supported");
    }
    await csrf();
    const { data } = await api.post(`/investments/${investmentId}/invest`, {
      amount: payload.amount,
    });
    return normalizeUserInvestment(data.userInvestment);
  },

  async getUserInvestments(
    filters?: UserInvestmentFilters,
  ): Promise<PaginatedResponse<UserInvestment>> {
    if (useMockData()) {
      await delay();
      let items = [...mockUserInvestments];
      if (filters?.status && filters.status !== "all") {
        items = items.filter((i) => i.status === filters.status);
      }
      const page = filters?.page || 1;
      const perPage = filters?.perPage || 20;
      const start = (page - 1) * perPage;
      return {
        data: items.slice(start, start + perPage),
        meta: { total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) },
      };
    }

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/my-investments?${params.toString()}`);
    return {
      data: (data.data as unknown[]).map(normalizeUserInvestment),
      meta: data.meta,
    };
  },

  async getUserInvestmentSummary(): Promise<{
    totalInvested: number;
    totalExpectedReturn: number;
    totalActualReturn: number;
    activeCount: number;
    maturedCount: number;
  }> {
    if (useMockData()) {
      await delay();
      const active = mockUserInvestments.filter((i) => i.status === "active");
      return {
        totalInvested: active.reduce((s, i) => s + i.amountInvested, 0),
        totalExpectedReturn: active.reduce((s, i) => s + i.expectedReturn, 0),
        totalActualReturn: mockUserInvestments.reduce((s, i) => s + i.interestEarned, 0),
        activeCount: active.length,
        maturedCount: mockUserInvestments.filter((i) => i.status !== "active").length,
      };
    }

    const { data } = await api.get("/my-investments/summary");
    return data.data;
  },
};
