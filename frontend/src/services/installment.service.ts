import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import type {
  InstallmentPlan,
  InstallmentPlanBreakdown,
  InstallmentPayment,
  InstallmentFilters,
  PaginatedResponse,
} from "@/types";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

// ── Mock data for dev mode ──
const mockPlans: InstallmentPlan[] = [
  {
    id: "inst-plan-001",
    orderId: "ord-001",
    userId: "user-001",
    totalAmount: 53550000,
    upfrontAmount: 34000000,
    upfrontPercent: 40,
    remainingAmount: 19550000,
    markupPercent: 5,
    markupAmount: 2550000,
    monthlyAmount: 3258333.33,
    numberOfPayments: 6,
    paymentsCompleted: 2,
    nextPaymentDueAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "active",
    progressPercent: 33,
    amountPaidSoFar: 40516666.66,
    amountRemaining: 13033333.34,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    order: {
      id: "ord-001",
      reference: "PV-ORD-20260115-ABC123",
      amount: 85000000,
      status: "confirmed",
      listing: {
        id: "lst-001",
        title: "3 Bedroom Luxury Apartment in Lekki Phase 1",
        category: "property",
        price: 85000000,
        primaryImage: "/images/listings/property-1.jpg",
        images: ["/images/listings/property-1.jpg"],
      },
      vendor: {
        id: "vendor-skyline",
        firstName: "Skyline",
        lastName: "Realty",
      },
    },
    payments: [
      {
        id: "pay-001", installmentPlanId: "inst-plan-001", paymentNumber: 1, amount: 3258333.33,
        dueDate: new Date(Date.now() - 60 * 86400000).toISOString(), paidAt: new Date(Date.now() - 59 * 86400000).toISOString(),
        status: "paid", transactionId: "txn-001", createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 59 * 86400000).toISOString(),
      },
      {
        id: "pay-002", installmentPlanId: "inst-plan-001", paymentNumber: 2, amount: 3258333.33,
        dueDate: new Date(Date.now() - 30 * 86400000).toISOString(), paidAt: new Date(Date.now() - 28 * 86400000).toISOString(),
        status: "paid", transactionId: "txn-002", createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      },
      {
        id: "pay-003", installmentPlanId: "inst-plan-001", paymentNumber: 3, amount: 3258333.33,
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), paidAt: null,
        status: "pending", transactionId: null, createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "pay-004", installmentPlanId: "inst-plan-001", paymentNumber: 4, amount: 3258333.33,
        dueDate: new Date(Date.now() + 35 * 86400000).toISOString(), paidAt: null,
        status: "pending", transactionId: null, createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "pay-005", installmentPlanId: "inst-plan-001", paymentNumber: 5, amount: 3258333.33,
        dueDate: new Date(Date.now() + 65 * 86400000).toISOString(), paidAt: null,
        status: "pending", transactionId: null, createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "pay-006", installmentPlanId: "inst-plan-001", paymentNumber: 6, amount: 3258333.35,
        dueDate: new Date(Date.now() + 95 * 86400000).toISOString(), paidAt: null,
        status: "pending", transactionId: null, createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
    ],
  },
];

export const installmentService = {
  async previewPlan(listingId: string, months: number): Promise<InstallmentPlanBreakdown> {
    if (useMockData()) {
      await delay();
      // Generate mock breakdown
      const price = 85000000;
      const upfrontPct = 40;
      const markup = months === 6 ? 5 : 10;
      const upfront = price * (upfrontPct / 100);
      const remainBase = price - upfront;
      const markupAmt = remainBase * (markup / 100);
      const totalRemain = remainBase + markupAmt;
      const monthly = totalRemain / months;
      return {
        itemPrice: price,
        upfrontPercent: upfrontPct,
        upfrontAmount: upfront,
        remainingBase: remainBase,
        markupPercent: markup,
        markupAmount: markupAmt,
        totalRemaining: totalRemain,
        monthlyAmount: Math.round(monthly * 100) / 100,
        numberOfPayments: months,
        totalCost: upfront + totalRemain,
        roundingAdjustment: 0,
      };
    }

    const { data } = await api.get(`/listings/${listingId}/installment-preview?months=${months}`);
    return data.breakdown as InstallmentPlanBreakdown;
  },

  async purchaseInstallment(listingId: string, months: number): Promise<{ order: { id: string; reference: string }; installmentPlan: InstallmentPlan }> {
    if (useMockData()) {
      await delay(1500);
      throw new Error("Mock installment purchases not supported");
    }
    await csrf();
    const { data } = await api.post(`/listings/${listingId}/installment-purchase`, { months });
    return {
      order: data.order,
      installmentPlan: data.installmentPlan as InstallmentPlan,
    };
  },

  async getUserPlans(filters?: InstallmentFilters): Promise<PaginatedResponse<InstallmentPlan>> {
    if (useMockData()) {
      await delay();
      let plans = [...mockPlans];
      if (filters?.status) {
        plans = plans.filter((p) => p.status === filters.status);
      }
      return { data: plans, meta: { total: plans.length, page: 1, perPage: 15, totalPages: 1 } };
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/installments?${params.toString()}`);
    return { data: data.data as InstallmentPlan[], meta: data.meta };
  },

  async getPlanById(planId: string): Promise<InstallmentPlan | null> {
    if (useMockData()) {
      await delay();
      return mockPlans.find((p) => p.id === planId) ?? null;
    }
    try {
      const { data } = await api.get(`/installments/${planId}`);
      return data.installmentPlan as InstallmentPlan;
    } catch {
      return null;
    }
  },

  async makePayment(planId: string): Promise<InstallmentPayment> {
    if (useMockData()) {
      await delay(1000);
      throw new Error("Mock payments not supported");
    }
    await csrf();
    const { data } = await api.post(`/installments/${planId}/pay`);
    return data.payment as InstallmentPayment;
  },

  async getVendorPlans(filters?: InstallmentFilters): Promise<PaginatedResponse<InstallmentPlan>> {
    if (useMockData()) {
      await delay();
      return { data: mockPlans, meta: { total: mockPlans.length, page: 1, perPage: 15, totalPages: 1 } };
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get(`/vendor/installments?${params.toString()}`);
    return { data: data.data as InstallmentPlan[], meta: data.meta };
  },
};
