"use client";

import { useState, useCallback } from "react";
import { savingsService, CreateSavingsPlanPayload } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import { SavingsPlan } from "@/types";
import { useToast } from "@/contexts/ToastContext";

interface UseCreateSavingsReturn {
  createPlan: (payload: CreateSavingsPlanPayload) => Promise<SavingsPlan | null>;
  isCreating: boolean;
  error: string | null;
}

export function useCreateSavings(): UseCreateSavingsReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const createPlan = useCallback(
    async (payload: CreateSavingsPlanPayload): Promise<SavingsPlan | null> => {
      setIsCreating(true);
      setError(null);
      try {
        const plan = await savingsService.createSavingsPlan(payload);
        addToast("Savings plan created successfully!", "success");
        return plan;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [addToast],
  );

  return { createPlan, isCreating, error };
}
