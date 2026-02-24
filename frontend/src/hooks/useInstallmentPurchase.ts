"use client";

import { useState, useCallback } from "react";
import { installmentService } from "@/services/installment.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { InstallmentPlan } from "@/types";

interface UseInstallmentPurchaseReturn {
  purchase: (listingId: string, months: number) => Promise<InstallmentPlan | null>;
  isProcessing: boolean;
  error: string | null;
}

export function useInstallmentPurchase(): UseInstallmentPurchaseReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const purchaseFn = useCallback(
    async (listingId: string, months: number): Promise<InstallmentPlan | null> => {
      setIsProcessing(true);
      setError(null);
      try {
        const result = await installmentService.purchaseInstallment(listingId, months);
        addToast("Installment purchase successful! First payment is due in 30 days.", "success");
        return result.installmentPlan;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [addToast],
  );

  return { purchase: purchaseFn, isProcessing, error };
}
