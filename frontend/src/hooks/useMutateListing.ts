"use client";

import { useState, useCallback } from "react";
import {
  vendorService,
  CreateListingPayload,
  UpdateListingPayload,
} from "@/services/vendor.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { Listing } from "@/types";

interface UseMutateListingReturn {
  createListing: (p: CreateListingPayload) => Promise<Listing | null>;
  updateListing: (id: string, p: UpdateListingPayload) => Promise<Listing | null>;
  deleteListing: (id: string) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

export function useMutateListing(): UseMutateListingReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const create = useCallback(
    async (payload: CreateListingPayload): Promise<Listing | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const listing = await vendorService.createListing(payload);
        addToast(
          payload.status === "draft"
            ? "Listing saved as draft."
            : "Listing published successfully!",
          "success",
        );
        return listing;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [addToast],
  );

  const update = useCallback(
    async (id: string, payload: UpdateListingPayload): Promise<Listing | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const listing = await vendorService.updateListing(id, payload);
        addToast("Listing updated successfully!", "success");
        return listing;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [addToast],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        await vendorService.deleteListing(id);
        addToast("Listing deleted.", "success");
        return true;
      } catch (err) {
        const msg = extractApiError(err);
        setError(msg);
        addToast(msg, "error");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [addToast],
  );

  return { createListing: create, updateListing: update, deleteListing: remove, isSubmitting, error };
}
