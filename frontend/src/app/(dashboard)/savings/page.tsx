"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faLock,
  faUnlock,
  faPercent,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useSavingsPlans } from "@/hooks";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { SavingsProductType } from "@/types/common";
import PenniSaveLayout from "@/components/savings/PenniSaveLayout";
import CreatePenniSaveModal from "@/components/savings/CreatePenniSaveModal";
import QuickSaveModal from "@/components/savings/QuickSaveModal";
import WithdrawPenniSaveModal from "@/components/savings/WithdrawPenniSaveModal";
import PenniLockLayout from "@/components/savings/PenniLockLayout";
import CreatePenniLockModal from "@/components/savings/CreatePenniLockModal";
import BreakLockModal from "@/components/savings/BreakLockModal";
import TargetSaveLayout from "@/components/savings/TargetSaveLayout";
import CreateTargetSaveModal from "@/components/savings/CreateTargetSaveModal";

type FilterStatus = "all" | "active" | "completed" | "paused";

const PRODUCT_LABELS: Record<SavingsProductType, string> = {
  pennisave: "PenniSave",
  pennilock: "PenniLock",
  targetsave: "TargetSave",
  penniajo: "PenniAjo",
};

const PRODUCT_COLORS: Record<SavingsProductType, string> = {
  pennisave: "#3B82F6",
  pennilock: "#10B981",
  targetsave: "#8B5CF6",
  penniajo: "#EB5310",
};

export default function SavingsPage() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") as SavingsProductType | null;
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  // PenniSave modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quickSavePlanId, setQuickSavePlanId] = useState<string | null>(null);
  const [withdrawPlanId, setWithdrawPlanId] = useState<string | null>(null);

  // PenniLock modal state
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [breakLockPlanId, setBreakLockPlanId] = useState<string | null>(null);

  // TargetSave modal state
  const [showCreateTargetModal, setShowCreateTargetModal] = useState(false);

  const { plans: allPlans, isLoading, error, refetch } = useSavingsPlans();

  const filteredPlans = useMemo(() => {
    let plans = allPlans;
    if (typeFilter) {
      plans = plans.filter((p) => p.productType === typeFilter);
    }
    if (activeFilter !== "all") {
      plans = plans.filter((p) => p.status === activeFilter);
    }
    return plans;
  }, [allPlans, activeFilter, typeFilter]);

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Paused", value: "paused" },
  ];

  const pageTitle = typeFilter ? PRODUCT_LABELS[typeFilter] : "Savings Plans";

  // PenniSave dedicated layout
  if (typeFilter === "pennisave") {
    const pennisavePlans = allPlans.filter(
      (p) => p.productType === "pennisave"
    );
    return (
      <>
        <PenniSaveLayout
          plans={pennisavePlans}
          onCreateNew={() => setShowCreateModal(true)}
          onQuickSave={(id) => setQuickSavePlanId(id)}
          onWithdraw={(id) => setWithdrawPlanId(id)}
        />
        {showCreateModal && (
          <CreatePenniSaveModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => refetch()}
          />
        )}
        {quickSavePlanId && (() => {
          const qsPlan = allPlans.find((p) => p.id === quickSavePlanId);
          return qsPlan ? (
            <QuickSaveModal
              plan={qsPlan}
              onClose={() => setQuickSavePlanId(null)}
              onSuccess={() => refetch()}
            />
          ) : null;
        })()}
        {withdrawPlanId && (() => {
          const wdPlan = allPlans.find((p) => p.id === withdrawPlanId);
          return wdPlan ? (
            <WithdrawPenniSaveModal
              plan={wdPlan}
              onClose={() => setWithdrawPlanId(null)}
              onSuccess={() => refetch()}
            />
          ) : null;
        })()}
      </>
    );
  }

  // PenniLock dedicated layout
  if (typeFilter === "pennilock") {
    const pennilockPlans = allPlans.filter(
      (p) => p.productType === "pennilock"
    );
    const breakLockPlan = breakLockPlanId
      ? allPlans.find((p) => p.id === breakLockPlanId)
      : null;
    return (
      <>
        <PenniLockLayout
          plans={pennilockPlans}
          onCreateNew={() => setShowCreateLockModal(true)}
          onBreakLock={(id) => setBreakLockPlanId(id)}
        />
        {showCreateLockModal && (
          <CreatePenniLockModal
            onClose={() => setShowCreateLockModal(false)}
            onSuccess={() => refetch()}
          />
        )}
        {breakLockPlan && (
          <BreakLockModal
            plan={breakLockPlan}
            onClose={() => setBreakLockPlanId(null)}
            onConfirm={() => refetch()}
          />
        )}
      </>
    );
  }

  // TargetSave dedicated layout
  if (typeFilter === "targetsave") {
    const targetsavePlans = allPlans.filter(
      (p) => p.productType === "targetsave"
    );
    return (
      <>
        <TargetSaveLayout
          plans={targetsavePlans}
          onCreateNew={() => setShowCreateTargetModal(true)}
          onAddFunds={() => {}}
          onWithdraw={() => {}}
        />
        {showCreateTargetModal && (
          <CreateTargetSaveModal
            onClose={() => setShowCreateTargetModal(false)}
            onSuccess={() => refetch()}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border text-primary" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{pageTitle}</h2>
          {typeFilter && (
            <Link href="/savings" style={{ fontSize: 13, color: "#64748B" }}>
              View all savings
            </Link>
          )}
        </div>
        <Link href="#" className="quick-action-btn primary" style={{ fontSize: 13, padding: "8px 16px" }}>
          <FontAwesomeIcon icon={faPlus} /> New Plan
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`btn btn-sm ${activeFilter === option.value ? "btn-primary" : "btn-outline-secondary"}`}
            style={{
              borderRadius: 20,
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: 13,
              fontWeight: 600,
              ...(activeFilter === option.value
                ? { backgroundColor: "#EB5310", borderColor: "#EB5310" }
                : {}),
            }}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Savings Plans Cards */}
      {filteredPlans.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>
            No savings plans found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredPlans.map((plan) => {
            const pct = plan.targetAmount > 0
              ? Math.round((plan.currentAmount / plan.targetAmount) * 100)
              : 0;
            const productColor = PRODUCT_COLORS[plan.productType];

            return (
              <div key={plan.id} className="col-md-6">
                <div className="savings-plan-card">
                  {/* Card Header */}
                  <div className="savings-plan-card-header">
                    <div>
                      <span
                        className="savings-product-tag"
                        style={{ background: `${productColor}15`, color: productColor }}
                      >
                        {PRODUCT_LABELS[plan.productType]}
                      </span>
                      <h4 className="savings-plan-name">{plan.name}</h4>
                      {plan.description && (
                        <p className="savings-plan-desc">{plan.description}</p>
                      )}
                    </div>
                    <span className={`status-badge ${plan.status}`}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="savings-plan-balance">
                    <span className="balance-value">{formatNaira(plan.currentAmount, false)}</span>
                    {plan.targetAmount > 0 && (
                      <span className="balance-target"> / {formatNaira(plan.targetAmount, false)}</span>
                    )}
                  </div>

                  {/* Progress */}
                  {plan.targetAmount > 0 && (
                    <>
                      <div className="savings-progress" style={{ marginBottom: 12 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: productColor }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>
                        {pct}% of target reached
                      </span>
                    </>
                  )}

                  {/* Info Tags */}
                  <div className="savings-plan-tags">
                    {plan.hasInterest ? (
                      <span className="savings-tag interest">
                        <FontAwesomeIcon icon={faPercent} />
                        {plan.interestRate}% p.a.
                        {plan.accruedInterest > 0 && (
                          <> &middot; Earned {formatNaira(plan.accruedInterest, false)}</>
                        )}
                      </span>
                    ) : (
                      <span className="savings-tag no-interest">No interest</span>
                    )}
                    <span className={`savings-tag ${plan.isFixedTerm ? "locked" : "flexible"}`}>
                      <FontAwesomeIcon icon={plan.isFixedTerm ? faLock : faUnlock} />
                      {plan.isFixedTerm ? "Fixed term" : "Flexible"}
                    </span>
                    {plan.earlyWithdrawalPenaltyPercent > 0 && (
                      <span className="savings-tag penalty">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        {plan.earlyWithdrawalPenaltyPercent}% early withdrawal penalty
                      </span>
                    )}
                  </div>

                  {/* Details Row */}
                  <div className="savings-plan-details">
                    <div className="detail-item">
                      <span className="detail-label">Frequency</span>
                      <span className="detail-value">
                        {plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contribution</span>
                      <span className="detail-value">{formatNaira(plan.contributionAmount, false)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Started</span>
                      <span className="detail-value">{formatDate(plan.startDate)}</span>
                    </div>
                    {plan.endDate && (
                      <div className="detail-item">
                        <span className="detail-label">{plan.isFixedTerm ? "Unlocks" : "Target Date"}</span>
                        <span className="detail-value">{formatDate(plan.endDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="savings-plan-actions">
                    <Link
                      href={`/savings/${plan.id}`}
                      className="quick-action-btn outline"
                      style={{ fontSize: 13, padding: "6px 16px" }}
                    >
                      View Details
                    </Link>
                    {plan.status === "active" && (
                      <button
                        className="quick-action-btn primary"
                        style={{ fontSize: 13, padding: "6px 16px" }}
                      >
                        {plan.isFixedTerm ? "Top Up" : "Withdraw"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
