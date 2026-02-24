"use client";

import { useState, useCallback } from "react";
import { installmentService } from "@/services/installment.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { InstallmentPayment } from "@/types";

interface UseInstallmentPaymentReturn {
  pay: (planId: string) => Promise<InstallmentPayment | null>;
  isProcessing: boolean;
  error: string | null;
}

export function useInstallmentPayment(): UseInstallmentPaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const payFn = useCallback(
    async (planId: string): Promise<InstallmentPayment | null> => {
      setIsProcessing(true);
      setError(null);
      try {
        const payment = await installmentService.makePayment(planId);
        addToast("Installment payment successful!", "success");
        return payment;
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

  return { pay: payFn, isProcessing, error };
}
