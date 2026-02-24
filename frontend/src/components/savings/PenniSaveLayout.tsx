"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPiggyBank,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import type { SavingsPlan } from "@/types";
import type { SavingsStatus } from "@/types/common";
import { formatNaira } from "@/lib/formatters";
import PenniSaveSummaryCard from "./PenniSaveSummaryCard";
import PenniSavePlanCard from "./PenniSavePlanCard";
import PenniSaveEmptyState from "./PenniSaveEmptyState";

type FilterStatus = "all" | SavingsStatus;

interface PenniSaveLayoutProps {
  plans: SavingsPlan[];
  onCreateNew: () => void;
  onQuickSave: (planId: string) => void;
  onWithdraw: (planId: string) => void;
}

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
];

export default function PenniSaveLayout({
  plans,
  onCreateNew,
  onQuickSave,
  onWithdraw,
}: PenniSaveLayoutProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Aggregate stats
  const totalBalance = plans
    .filter((p) => p.status === "active" || p.status === "paused")
    .reduce((sum, p) => sum + p.currentAmount, 0);
  const totalInterest = plans.reduce((sum, p) => sum + p.accruedInterest, 0);
  const activePlans = plans.filter((p) => p.status === "active");

  // Find next auto-save: earliest next contribution date among active plans
  const nextAutoSaveDate = useMemo(() => {
    if (activePlans.length === 0) return null;
    // Simulated: return "tomorrow" style date for mock
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }, [activePlans.length]);

  const filteredPlans = useMemo(() => {
    if (filter === "all") return plans;
    return plans.filter((p) => p.status === filter);
  }, [plans, filter]);

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="pennisave-page-title">
            <FontAwesomeIcon icon={faPiggyBank} className="pennisave-title-icon" />
            PenniSave
          </h2>
          <p className="pennisave-page-subtitle">
            Flexible auto-save &middot; Withdraw anytime
          </p>
        </div>
        <div className="d-flex gap-2">
          {activePlans.length > 0 && (
            <button
              className="quick-action-btn secondary"
              style={{ fontSize: 13, padding: "8px 16px" }}
              onClick={() => onQuickSave(activePlans[0].id)}
            >
              <FontAwesomeIcon icon={faBoltLightning} /> Quick Save
            </button>
          )}
          <button
            className="quick-action-btn primary"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={onCreateNew}
          >
            <FontAwesomeIcon icon={faPlus} /> New PenniSave
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <PenniSaveSummaryCard
        totalBalance={totalBalance}
        totalInterest={totalInterest}
        activePlanCount={activePlans.length}
        nextAutoSaveDate={nextAutoSaveDate}
      />

      {/* Filter Pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`pennisave-filter-pill ${filter === opt.value ? "active" : ""}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Plan Cards or Empty State */}
      {filteredPlans.length === 0 ? (
        <PenniSaveEmptyState
          hasAnyPlans={plans.length > 0}
          onCreateNew={onCreateNew}
        />
      ) : (
        <div className="row g-3">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="col-md-6">
              <PenniSavePlanCard
                plan={plan}
                onQuickSave={() => onQuickSave(plan.id)}
                onWithdraw={() => onWithdraw(plan.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
