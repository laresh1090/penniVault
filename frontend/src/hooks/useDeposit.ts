"use client";

import { useState, useCallback } from "react";
import { savingsService, DepositToSavingsPayload } from "@/services/savings.service";
import { walletService, DepositToWalletPayload } from "@/services/wallet.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

interface UseDepositReturn {
  depositToWallet: (payload: DepositToWalletPayload) => Promise<boolean>;
  depositToSavings: (planId: string, payload: DepositToSavingsPayload) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
}

export function useDeposit(): UseDepositReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const depositToWalletFn = useCallback(
    async (payload: DepositToWalletPayload): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        await walletService.depositToWallet(payload);
        addToast("Deposit successful! Funds added to your wallet.", "success");
        return true;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [addToast],
  );

  const depositToSavingsFn = useCallback(
    async (planId: string, payload: DepositToSavingsPayload): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        await savingsService.depositToSavings(planId, payload);
        addToast("Funds added to your savings plan!", "success");
        return true;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [addToast],
  );

  return {
    depositToWallet: depositToWalletFn,
    depositToSavings: depositToSavingsFn,
    isProcessing,
    error,
  };
}
