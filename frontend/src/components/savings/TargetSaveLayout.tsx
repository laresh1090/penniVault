"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { SavingsPlan } from "@/types";
import type { SavingsStatus } from "@/types/common";
import TargetSaveSummaryCard from "./TargetSaveSummaryCard";
import TargetSavePlanCard from "./TargetSavePlanCard";
import TargetSaveEmptyState from "./TargetSaveEmptyState";

type FilterStatus = "all" | SavingsStatus;

interface TargetSaveLayoutProps {
  plans: SavingsPlan[];
  onCreateNew: () => void;
  onAddFunds: (planId: string) => void;
  onWithdraw: (planId: string) => void;
}

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function TargetSaveLayout({
  plans,
  onCreateNew,
  onAddFunds,
  onWithdraw,
}: TargetSaveLayoutProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Aggregate stats
  const activePlans = plans.filter((p) => p.status === "active");
  const totalSaved = activePlans.reduce((sum, p) => sum + p.currentAmount, 0);
  const activeGoals = activePlans.length;
  const averageProgress = activeGoals > 0
    ? Math.round(
        activePlans.reduce((sum, p) => {
          const pct = p.targetAmount > 0
            ? (p.currentAmount / p.targetAmount) * 100
            : 0;
          return sum + Math.min(100, pct);
        }, 0) / activeGoals,
      )
    : 0;

  const filteredPlans = useMemo(() => {
    if (filter === "all") return plans;
    return plans.filter((p) => p.status === filter);
  }, [plans, filter]);

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="targetsave-page-title">
            <FontAwesomeIcon icon={faBullseye} className="targetsave-title-icon" />
            TargetSave
          </h2>
          <p className="targetsave-page-subtitle">
            Goal-based savings with a target date
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="quick-action-btn primary"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={onCreateNew}
          >
            <FontAwesomeIcon icon={faBullseye} className="me-1" />
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} /> New Goal
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <TargetSaveSummaryCard
        totalSaved={totalSaved}
        activeGoals={activeGoals}
        averageProgress={averageProgress}
      />

      {/* Filter Pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`targetsave-filter-pill ${filter === opt.value ? "active" : ""}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Plan Cards or Empty State */}
      {filteredPlans.length === 0 ? (
        <TargetSaveEmptyState
          hasAnyPlans={plans.length > 0}
          onCreateNew={onCreateNew}
        />
      ) : (
        <div className="row g-3">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="col-md-6">
              <TargetSavePlanCard
                plan={plan}
                onAddFunds={() => onAddFunds(plan.id)}
                onWithdraw={() => onWithdraw(plan.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
