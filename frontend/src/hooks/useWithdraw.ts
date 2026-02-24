"use client";

import { useState, useCallback } from "react";
import { savingsService, WithdrawFromSavingsPayload } from "@/services/savings.service";
import { walletService, WithdrawFromWalletPayload } from "@/services/wallet.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

interface UseWithdrawReturn {
  withdrawFromWallet: (payload: WithdrawFromWalletPayload) => Promise<boolean>;
  withdrawFromSavings: (planId: string, payload: WithdrawFromSavingsPayload) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
}

export function useWithdraw(): UseWithdrawReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const withdrawFromWalletFn = useCallback(
    async (payload: WithdrawFromWalletPayload): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        await walletService.withdrawFromWallet(payload);
        addToast("Withdrawal initiated! Funds will arrive in your bank shortly.", "success");
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

  const withdrawFromSavingsFn = useCallback(
    async (planId: string, payload: WithdrawFromSavingsPayload): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        await savingsService.withdrawFromSavings(planId, payload);
        addToast("Withdrawal from savings successful! Funds moved to your wallet.", "success");
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
    withdrawFromWallet: withdrawFromWalletFn,
    withdrawFromSavings: withdrawFromSavingsFn,
    isProcessing,
    error,
  };
}
