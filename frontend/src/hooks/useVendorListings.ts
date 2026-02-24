"use client";

import { useState, useEffect, useCallback } from "react";
import { vendorService } from "@/services/vendor.service";
import type { Listing, ListingFilters, PaginatedResponse } from "@/types";

interface UseVendorListingsReturn {
  listings: Listing[];
  meta: PaginatedResponse<Listing>["meta"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVendorListings(filters?: ListingFilters): UseVendorListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Listing>["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await vendorService.getMyListings(filters);
      setListings(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.category, filters?.sort, filters?.page, filters?.perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { listings, meta, isLoading, error, refetch: fetch };
}
