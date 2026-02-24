"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { SavingsPlan } from "@/types";
import type { SavingsStatus } from "@/types/common";
import { formatNaira } from "@/lib/formatters";
import PenniLockSummaryCard from "./PenniLockSummaryCard";
import PenniLockPlanCard from "./PenniLockPlanCard";
import PenniLockEmptyState from "./PenniLockEmptyState";

type FilterStatus = "all" | SavingsStatus;

interface PenniLockLayoutProps {
  plans: SavingsPlan[];
  onCreateNew: () => void;
  onBreakLock: (planId: string) => void;
}

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function PenniLockLayout({
  plans,
  onCreateNew,
  onBreakLock,
}: PenniLockLayoutProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Aggregate stats
  const totalLocked = plans
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.currentAmount, 0);
  const totalInterest = plans.reduce((sum, p) => sum + p.accruedInterest, 0);
  const activeLocksCount = plans.filter((p) => p.status === "active").length;

  const filteredPlans = useMemo(() => {
    if (filter === "all") return plans;
    return plans.filter((p) => p.status === filter);
  }, [plans, filter]);

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="pennilock-page-title">
            <FontAwesomeIcon icon={faLock} className="pennilock-title-icon" />
            PenniLock
          </h2>
          <p className="pennilock-page-subtitle">
            Fixed-term locked savings
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="quick-action-btn primary"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={onCreateNew}
          >
            <FontAwesomeIcon icon={faLock} className="me-1" />
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} /> New PenniLock
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <PenniLockSummaryCard
        totalLocked={totalLocked}
        totalInterest={totalInterest}
        activeLocksCount={activeLocksCount}
      />

      {/* Filter Pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`pennilock-filter-pill ${filter === opt.value ? "active" : ""}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Plan Cards or Empty State */}
      {filteredPlans.length === 0 ? (
        <PenniLockEmptyState
          hasAnyPlans={plans.length > 0}
          onCreateNew={onCreateNew}
        />
      ) : (
        <div className="row g-3">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="col-md-6">
              <PenniLockPlanCard
                plan={plan}
                onBreakLock={() => onBreakLock(plan.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
