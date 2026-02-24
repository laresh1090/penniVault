"use client";

import { useState, useEffect, useCallback } from "react";
import { installmentService } from "@/services/installment.service";
import type { InstallmentPlan } from "@/types";

interface UseInstallmentPlanReturn {
  plan: InstallmentPlan | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInstallmentPlan(planId: string): UseInstallmentPlanReturn {
  const [plan, setPlan] = useState<InstallmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await installmentService.getPlanById(planId);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load installment plan");
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plan, isLoading, error, refetch: fetch };
}
