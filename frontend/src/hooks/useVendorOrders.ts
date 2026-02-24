"use client";

import { useState, useEffect, useCallback } from "react";
import { vendorService } from "@/services/vendor.service";
import type { Order, OrderFilters, PaginatedResponse } from "@/types";

interface UseVendorOrdersReturn {
  orders: Order[];
  meta: PaginatedResponse<Order>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVendorOrders(filters?: OrderFilters): UseVendorOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Order>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await vendorService.getMySales(filters);
      setOrders(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { orders, meta, isLoading, error, refetch: fetch };
}
