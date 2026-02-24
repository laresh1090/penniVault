"use client";

import { useState, useEffect, useCallback } from "react";
import { investmentService } from "@/services/investment.service";
import type { CrowdInvestment, InvestmentFilters, PaginatedResponse } from "@/types";

interface UseInvestmentsReturn {
  investments: CrowdInvestment[];
  meta: PaginatedResponse<CrowdInvestment>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInvestments(filters?: InvestmentFilters): UseInvestmentsReturn {
  const [investments, setInvestments] = useState<CrowdInvestment[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<CrowdInvestment>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await investmentService.getInvestments(filters);
      setInvestments(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load investments");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.category, filters?.riskLevel, filters?.status, filters?.sort, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { investments, meta, isLoading, error, refetch: fetch };
}
