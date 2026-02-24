"use client";

import { useState, useEffect, useCallback } from "react";
import { savingsService } from "@/services/savings.service";
import { SavingsPlan } from "@/types";

interface UseSavingsPlanReturn {
  plan: SavingsPlan | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSavingsPlan(id: string): UseSavingsPlanReturn {
  const [plan, setPlan] = useState<SavingsPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await savingsService.getSavingsPlanById(id);
      setPlan(result);
      if (!result) setError("Savings plan not found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load savings plan");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plan, isLoading, error, refetch: fetch };
}
