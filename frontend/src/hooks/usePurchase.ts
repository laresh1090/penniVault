"use client";

import { useState, useCallback } from "react";
import { marketplaceService } from "@/services/marketplace.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { Order } from "@/types";

interface UsePurchaseReturn {
  purchase: (listingId: string) => Promise<Order | null>;
  isProcessing: boolean;
  error: string | null;
}

export function usePurchase(): UsePurchaseReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const purchaseFn = useCallback(
    async (listingId: string): Promise<Order | null> => {
      setIsProcessing(true);
      setError(null);
      try {
        const order = await marketplaceService.purchaseFromWallet(listingId);
        addToast("Purchase successful! Check your orders for details.", "success");
        return order;
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
