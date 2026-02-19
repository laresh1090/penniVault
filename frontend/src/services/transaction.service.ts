import { Transaction, TransactionFilters, PaginatedResponse } from "@/types";
import { mockTransactions } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const transactionService = {
  async getUserTransactions(
    userId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    await delay();
    let filtered = mockTransactions.filter((t) => t.userId === userId);

    if (filters?.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters?.dateFrom) {
      filtered = filtered.filter(
        (t) => new Date(t.createdAt) >= new Date(filters.dateFrom!),
      );
    }
    if (filters?.dateTo) {
      filtered = filtered.filter(
        (t) => new Date(t.createdAt) <= new Date(filters.dateTo!),
      );
    }

    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const page = filters?.page || 1;
    const perPage = filters?.perPage || 20;
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return {
      data,
      meta: {
        total: filtered.length,
        page,
        perPage,
        totalPages: Math.ceil(filtered.length / perPage),
      },
    };
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    await delay();
    return mockTransactions.find((t) => t.id === id) || null;
  },
};
