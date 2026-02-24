import api, { ApiResponse, ApiPaginatedResponse } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { Transaction, TransactionFilters, PaginatedResponse } from "@/types";
import { mockTransactions } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const transactionService = {
  async getUserTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    if (useMockData()) {
      await delay();
      let filtered = [...mockTransactions];

      if (filters?.type) {
        filtered = filtered.filter((t) => t.type === filters.type);
      }
      if (filters?.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }
      if (filters?.dateFrom) {
        filtered = filtered.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom!));
      }
      if (filters?.dateTo) {
        filtered = filtered.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo!));
      }

      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const page = filters?.page || 1;
      const perPage = filters?.perPage || 20;
      const start = (page - 1) * perPage;
      const data = filtered.slice(start, start + perPage);

      return {
        data,
        meta: { total: filtered.length, page, perPage, totalPages: Math.ceil(filtered.length / perPage) },
      };
    }

    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get<ApiPaginatedResponse<Transaction>>(`/wallet/transactions?${params.toString()}`);
    return {
      data: data.data,
      meta: { total: data.meta.total, page: data.meta.page, perPage: data.meta.perPage, totalPages: data.meta.totalPages },
    };
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    if (useMockData()) {
      await delay();
      return mockTransactions.find((t) => t.id === id) || null;
    }
    try {
      const { data } = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
      return data.data;
    } catch {
      return null;
    }
  },

  async getSavingsPlanTransactions(planId: string, filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    if (useMockData()) {
      await delay();
      return {
        data: mockTransactions.slice(0, 5),
        meta: { total: 5, page: 1, perPage: 20, totalPages: 1 },
      };
    }

    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));

    const { data } = await api.get<ApiPaginatedResponse<Transaction>>(`/savings-plans/${planId}/transactions?${params.toString()}`);
    return {
      data: data.data,
      meta: { total: data.meta.total, page: data.meta.page, perPage: data.meta.perPage, totalPages: data.meta.totalPages },
    };
  },
};
