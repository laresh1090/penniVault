"use client";

import { useState, useCallback } from "react";
import {
  vendorService,
  CreateInvestmentPayload,
  UpdateInvestmentPayload,
} from "@/services/vendor.service";
import { extractApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { CrowdInvestment } from "@/types";

interface UseMutateInvestmentReturn {
  createInvestment: (p: CreateInvestmentPayload) => Promise<CrowdInvestment | null>;
  updateInvestment: (id: string, p: UpdateInvestmentPayload) => Promise<CrowdInvestment | null>;
  deleteInvestment: (id: string) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

export function useMutateInvestment(): UseMutateInvestmentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const create = useCallback(
    async (payload: CreateInvestmentPayload): Promise<CrowdInvestment | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const inv = await vendorService.createInvestment(payload);
        addToast("Investment opportunity created!", "success");
        return inv;
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
    async (id: string, payload: UpdateInvestmentPayload): Promise<CrowdInvestment | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const inv = await vendorService.updateInvestment(id, payload);
        addToast("Investment updated successfully!", "success");
        return inv;
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
        await vendorService.deleteInvestment(id);
        addToast("Investment opportunity removed.", "success");
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

  return { createInvestment: create, updateInvestment: update, deleteInvestment: remove, isSubmitting, error };
}
