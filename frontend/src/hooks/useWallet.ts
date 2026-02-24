"use client";

import { useState, useEffect, useCallback } from "react";
import { walletService } from "@/services/wallet.service";
import { Wallet, PaymentMethod } from "@/types";

interface UseWalletReturn {
  wallet: Wallet | null;
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [w, pms] = await Promise.all([
        walletService.getUserWallet(),
        walletService.getUserPaymentMethods(),
      ]);
      setWallet(w);
      setPaymentMethods(pms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { wallet, paymentMethods, isLoading, error, refetch: fetch };
}
