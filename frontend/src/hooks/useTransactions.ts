"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services/transaction.service";
import { Transaction, TransactionFilters, PaginatedResponse } from "@/types";

interface UseTransactionsReturn {
  transactions: Transaction[];
  meta: PaginatedResponse<Transaction>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTransactions(filters?: TransactionFilters): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Transaction>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await transactionService.getUserTransactions(filters);
      setTransactions(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.type, filters?.status, filters?.dateFrom, filters?.dateTo, filters?.page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, meta, isLoading, error, refetch: fetch };
}
