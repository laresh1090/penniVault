"use client";

import { useState, useEffect, useCallback } from "react";
import { installmentService } from "@/services/installment.service";
import type { InstallmentPlan, InstallmentFilters, PaginatedResponse } from "@/types";

interface UseInstallmentsReturn {
  plans: InstallmentPlan[];
  meta: PaginatedResponse<InstallmentPlan>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInstallments(filters?: InstallmentFilters): UseInstallmentsReturn {
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<InstallmentPlan>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await installmentService.getUserPlans(filters);
      setPlans(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load installment plans");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plans, meta, isLoading, error, refetch: fetch };
}
