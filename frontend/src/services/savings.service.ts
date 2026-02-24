import api, { ApiResponse, ApiPaginatedResponse, csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { SavingsPlan, GroupSavings, PaginatedResponse } from "@/types";
import type { GroupSavingsDetail } from "@/types/dashboard";
import { mockSavingsPlans, mockGroupSavings } from "@/data";
import { mockGroupSavingsDetail } from "@/data/dashboard";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export interface CreateSavingsPlanPayload {
  name: string;
  description?: string;
  productType: "pennisave" | "pennilock" | "targetsave";
  targetAmount: number;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  contributionAmount: number;
  startDate: string;
  endDate?: string;
  hasInterest: boolean;
  linkedAssetId?: string;
}

export interface UpdateSavingsPlanPayload {
  name?: string;
  description?: string;
  contributionAmount?: number;
  frequency?: "daily" | "weekly" | "biweekly" | "monthly";
  targetAmount?: number;
}

export interface SavingsPlanFilters {
  productType?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export interface DepositToSavingsPayload {
  amount: number;
  source: "wallet" | "card" | "bank_transfer";
}

export interface WithdrawFromSavingsPayload {
  amount: number;
  destination: "wallet" | "bank_account";
  paymentMethodId?: string;
  confirmPenalty?: boolean;
}

export interface SavingsSummary {
  totalSavings: number;
  totalAccruedInterest: number;
  activePlans: number;
  completedPlans: number;
  savingsBreakdown: {
    pennisave: number;
    pennilock: number;
    targetsave: number;
    penniajo: number;
  };
}

export const savingsService = {
  async getSavingsSummary(): Promise<SavingsSummary> {
    if (useMockData()) {
      await delay();
      const active = mockSavingsPlans.filter((p) => p.status === "active");
      const sumByType = (type: string) =>
        active.filter((p) => p.productType === type).reduce((s, p) => s + p.currentAmount, 0);
      return {
        totalSavings: active.reduce((s, p) => s + p.currentAmount, 0),
        totalAccruedInterest: mockSavingsPlans.reduce((s, p) => s + p.accruedInterest, 0),
        activePlans: active.length,
        completedPlans: mockSavingsPlans.filter((p) => p.status === "completed").length,
        savingsBreakdown: {
          pennisave: sumByType("pennisave"),
          pennilock: sumByType("pennilock"),
          targetsave: sumByType("targetsave"),
          penniajo: sumByType("penniajo"),
        },
      };
    }
    const { data } = await api.get("/savings-plans/summary");
    return data.data as SavingsSummary;
  },

  async getUserSavingsPlans(filters?: SavingsPlanFilters): Promise<PaginatedResponse<SavingsPlan>> {
    if (useMockData()) {
      await delay();
      let plans = [...mockSavingsPlans];
      if (filters?.productType) {
        plans = plans.filter((p) => p.productType === filters.productType);
      }
      if (filters?.status) {
        plans = plans.filter((p) => p.status === filters.status);
      }
      const page = filters?.page || 1;
      const perPage = filters?.perPage || 20;
      const start = (page - 1) * perPage;
      return {
        data: plans.slice(start, start + perPage),
        meta: { total: plans.length, page, perPage, totalPages: Math.ceil(plans.length / perPage) },
      };
    }

    const params = new URLSearchParams();
    if (filters?.productType) params.append("productType", filters.productType);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get<ApiPaginatedResponse<SavingsPlan>>(`/savings-plans?${params.toString()}`);
    return {
      data: data.data,
      meta: { total: data.meta.total, page: data.meta.page, perPage: data.meta.perPage, totalPages: data.meta.totalPages },
    };
  },

  async getSavingsPlanById(id: string): Promise<SavingsPlan | null> {
    if (useMockData()) {
      await delay();
      return mockSavingsPlans.find((s) => s.id === id) || null;
    }
    try {
      const { data } = await api.get(`/savings-plans/${id}`);
      return data.plan as SavingsPlan;
    } catch {
      return null;
    }
  },

  async createSavingsPlan(payload: CreateSavingsPlanPayload): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const newPlan: SavingsPlan = {
        id: `sav_${Date.now()}`,
        userId: "usr_001",
        name: payload.name,
        description: payload.description,
        productType: payload.productType,
        targetAmount: payload.targetAmount,
        currentAmount: 0,
        startDate: new Date().toISOString(),
        endDate: payload.endDate,
        frequency: payload.frequency,
        contributionAmount: payload.contributionAmount,
        status: "active",
        linkedAssetId: payload.linkedAssetId,
        hasInterest: payload.hasInterest,
        accruedInterest: 0,
        isFixedTerm: payload.productType === "pennilock",
        earlyWithdrawalPenaltyPercent: payload.productType === "pennilock" ? 10 : payload.hasInterest ? 2 : 0,
        createdAt: new Date().toISOString(),
      };
      mockSavingsPlans.push(newPlan);
      return newPlan;
    }

    await csrf();
    const { data } = await api.post("/savings-plans", {
      name: payload.name,
      description: payload.description,
      productType: payload.productType,
      targetAmount: payload.targetAmount,
      frequency: payload.frequency,
      contributionAmount: payload.contributionAmount,
      startDate: payload.startDate,
      endDate: payload.endDate,
      hasInterest: payload.hasInterest,
      linkedAssetId: payload.linkedAssetId,
    });
    return data.plan as SavingsPlan;
  },

  async updateSavingsPlan(id: string, payload: UpdateSavingsPlanPayload): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === id);
      if (!plan) throw new Error("Plan not found");
      Object.assign(plan, payload);
      return plan;
    }

    await csrf();
    const { data } = await api.put(`/savings-plans/${id}`, {
      name: payload.name,
      description: payload.description,
      contributionAmount: payload.contributionAmount,
      frequency: payload.frequency,
      targetAmount: payload.targetAmount,
    });
    return data.plan as SavingsPlan;
  },

  async pauseSavingsPlan(id: string): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === id);
      if (!plan) throw new Error("Plan not found");
      plan.status = "paused";
      return plan;
    }
    await csrf();
    const { data } = await api.post(`/savings-plans/${id}/pause`);
    return data.plan as SavingsPlan;
  },

  async resumeSavingsPlan(id: string): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === id);
      if (!plan) throw new Error("Plan not found");
      plan.status = "active";
      return plan;
    }
    await csrf();
    const { data } = await api.post(`/savings-plans/${id}/resume`);
    return data.plan as SavingsPlan;
  },

  async cancelSavingsPlan(id: string): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === id);
      if (!plan) throw new Error("Plan not found");
      plan.status = "cancelled";
      return plan;
    }
    await csrf();
    const { data } = await api.post(`/savings-plans/${id}/cancel`);
    return data.plan as SavingsPlan;
  },

  async depositToSavings(planId: string, payload: DepositToSavingsPayload): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === planId);
      if (!plan) throw new Error("Plan not found");
      plan.currentAmount += payload.amount;
      return plan;
    }
    await csrf();
    const { data } = await api.post(`/savings-plans/${planId}/deposit`, {
      amount: payload.amount,
      source: payload.source,
    });
    return data.plan as SavingsPlan;
  },

  async withdrawFromSavings(planId: string, payload: WithdrawFromSavingsPayload): Promise<SavingsPlan> {
    if (useMockData()) {
      await delay();
      const plan = mockSavingsPlans.find((s) => s.id === planId);
      if (!plan) throw new Error("Plan not found");
      plan.currentAmount = Math.max(0, plan.currentAmount - payload.amount);
      return plan;
    }
    await csrf();
    const { data } = await api.post(`/savings-plans/${planId}/withdraw`, {
      amount: payload.amount,
      destination: payload.destination,
      paymentMethodId: payload.paymentMethodId,
      confirmPenalty: payload.confirmPenalty,
    });
    return data.plan as SavingsPlan;
  },

  async getGroupSavings(): Promise<GroupSavings[]> {
    if (useMockData()) {
      await delay();
      return mockGroupSavings;
    }
    const { data } = await api.get<ApiResponse<GroupSavings[]>>("/group-savings");
    return data.data;
  },

  async getGroupSavingsById(id: string): Promise<GroupSavings | null> {
    if (useMockData()) {
      await delay();
      return mockGroupSavings.find((g) => g.id === id) || null;
    }
    try {
      const { data } = await api.get<ApiResponse<GroupSavings>>(`/group-savings/${id}`);
      return data.data;
    } catch {
      return null;
    }
  },

  async getGroupSavingsDetail(id: string): Promise<GroupSavingsDetail | null> {
    if (useMockData()) {
      await delay();
      if (id === mockGroupSavingsDetail.id) return mockGroupSavingsDetail;
      return null;
    }
    try {
      const { data } = await api.get<ApiResponse<GroupSavingsDetail>>(`/group-savings/${id}`);
      return data.data;
    } catch {
      return null;
    }
  },

  async getUserGroupSavings(): Promise<GroupSavings[]> {
    if (useMockData()) {
      await delay();
      return mockGroupSavings.filter((g) => g.members.some((m) => m.userId === "usr_001"));
    }
    const { data } = await api.get<ApiResponse<GroupSavings[]>>("/group-savings/mine");
    return data.data;
  },
};
