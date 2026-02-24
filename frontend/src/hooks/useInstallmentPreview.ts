"use client";

import { useState, useEffect, useCallback } from "react";
import { installmentService } from "@/services/installment.service";
import type { InstallmentPlanBreakdown } from "@/types";

interface UseInstallmentPreviewReturn {
  breakdown: InstallmentPlanBreakdown | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInstallmentPreview(
  listingId: string | null,
  months: number,
): UseInstallmentPreviewReturn {
  const [breakdown, setBreakdown] = useState<InstallmentPlanBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!listingId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await installmentService.previewPlan(listingId, months);
      setBreakdown(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load installment preview");
    } finally {
      setIsLoading(false);
    }
  }, [listingId, months]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { breakdown, isLoading, error, refetch: fetch };
}
