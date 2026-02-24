"use client";

import { useState, useCallback } from "react";
import { investmentService, InvestFromWalletPayload } from "@/services/investment.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { UserInvestment } from "@/types";

interface UseInvestReturn {
  invest: (investmentId: string, payload: InvestFromWalletPayload) => Promise<UserInvestment | null>;
  isProcessing: boolean;
  error: string | null;
}

export function useInvest(): UseInvestReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const investFn = useCallback(
    async (investmentId: string, payload: InvestFromWalletPayload): Promise<UserInvestment | null> => {
      setIsProcessing(true);
      setError(null);
      try {
        const userInvestment = await investmentService.investFromWallet(investmentId, payload);
        addToast("Investment successful! Funds have been allocated.", "success");
        return userInvestment;
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

  return { invest: investFn, isProcessing, error };
}
