"use client";

import { useState, useEffect, useCallback } from "react";
import { investmentService } from "@/services/investment.service";
import type { UserInvestment, UserInvestmentFilters, PaginatedResponse } from "@/types";

interface UseUserInvestmentsReturn {
  investments: UserInvestment[];
  meta: PaginatedResponse<UserInvestment>["meta"] | null;
  summary: {
    totalInvested: number;
    totalExpectedReturn: number;
    totalActualReturn: number;
    activeCount: number;
    maturedCount: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserInvestments(filters?: UserInvestmentFilters): UseUserInvestmentsReturn {
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<UserInvestment>["meta"] | null>(null);
  const [summary, setSummary] = useState<UseUserInvestmentsReturn["summary"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [investmentsResult, summaryResult] = await Promise.all([
        investmentService.getUserInvestments(filters),
        investmentService.getUserInvestmentSummary(),
      ]);
      setInvestments(investmentsResult.data);
      setMeta(investmentsResult.meta);
      setSummary(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your investments");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { investments, meta, summary, isLoading, error, refetch: fetch };
}
