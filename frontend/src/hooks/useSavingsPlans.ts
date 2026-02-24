"use client";

import { useState, useEffect, useCallback } from "react";
import { savingsService, SavingsPlanFilters } from "@/services/savings.service";
import { SavingsPlan, PaginatedResponse } from "@/types";

interface UseSavingsPlansReturn {
  plans: SavingsPlan[];
  meta: PaginatedResponse<SavingsPlan>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSavingsPlans(filters?: SavingsPlanFilters): UseSavingsPlansReturn {
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<SavingsPlan>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await savingsService.getUserSavingsPlans(filters);
      setPlans(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load savings plans");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.productType, filters?.status, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plans, meta, isLoading, error, refetch: fetch };
}
