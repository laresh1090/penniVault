// frontend/src/components/savings/PenniLockPlanCard.tsx
"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { SavingsPlan } from "@/types";

interface PenniLockPlanCardProps {
  plan: SavingsPlan;
  onBreakLock: () => void;
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTotalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getElapsedDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function PenniLockPlanCard({ plan, onBreakLock }: PenniLockPlanCardProps) {
  const isCompleted = plan.status === "completed";
  const daysRemaining = plan.endDate ? getDaysRemaining(plan.endDate) : 0;
  const totalDays = plan.endDate ? getTotalDays(plan.startDate, plan.endDate) : 1;
  const elapsed = getElapsedDays(plan.startDate);
  const progressPct = Math.min(100, Math.round((elapsed / totalDays) * 100));
  const isMature = daysRemaining === 0;
  const canBreak = plan.status === "active" && elapsed >= 30;
  // Determine interest mode from mock data hint
  // If earlyWithdrawalPenaltyPercent === 0, it's upfront (unbreakable)
  const isUpfront = plan.earlyWithdrawalPenaltyPercent === 0;

  return (
    <div className={`pennilock-card ${isCompleted ? "completed" : ""} ${isMature ? "mature" : ""}`}>
      {/* Top: name + status */}
      <div className="pennilock-card-header">
        <div>
          <span className="pennilock-product-tag">PenniLock</span>
          <h4 className="pennilock-card-name">{plan.name}</h4>
        </div>
        <span className={`status-badge ${plan.status}`}>
          {isMature && plan.status === "active" ? "Matured" : plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
        </span>
      </div>

      {/* Locked Amount */}
      <div className="pennilock-card-balance">
        <span className="pennilock-locked-label">
          <FontAwesomeIcon icon={faLock} className="me-1" />
          Locked
        </span>
        <span className="pennilock-locked-value">
          {formatNaira(plan.currentAmount, false)}
        </span>
      </div>

      {/* Rate Badge + Interest Earned */}
      <div className="d-flex align-items-center gap-2 mb-3">
        {plan.hasInterest && plan.interestRate && (
          <span className="pennilock-rate-badge">
            {plan.interestRate}% p.a.
          </span>
        )}
        {plan.accruedInterest > 0 && (
          <span className="pennilock-interest-earned">
            +{formatNaira(plan.accruedInterest, false)} earned
          </span>
        )}
        {isUpfront && (
          <span className="pennilock-mode-badge upfront">Upfront</span>
        )}
        {!isUpfront && plan.hasInterest && (
          <span className="pennilock-mode-badge maturity">At Maturity</span>
        )}
      </div>

      {/* Maturity Countdown Progress Bar */}
      <div className="pennilock-maturity-section">
        <div className="d-flex justify-content-between" style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
          <span>{formatDate(plan.startDate)}</span>
          <span>{plan.endDate ? formatDate(plan.endDate) : "No end"}</span>
        </div>
        <div className="pennilock-progress">
          <div
            className="pennilock-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="pennilock-countdown">
          {isMature ? (
            <span className="pennilock-countdown-mature">
              <FontAwesomeIcon icon={faCheck} className="me-1" />
              Matured! Funds ready for withdrawal.
            </span>
          ) : (
            <span className="pennilock-countdown-days">
              <FontAwesomeIcon icon={faClock} className="me-1" />
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pennilock-card-actions">
        <Link
          href={`/savings/${plan.id}`}
          className="quick-action-btn outline"
          style={{ fontSize: 13, padding: "6px 16px" }}
        >
          View Details
        </Link>
        {isMature && plan.status === "active" && (
          <button
            className="quick-action-btn primary pennilock-withdraw-btn"
            style={{ fontSize: 13, padding: "6px 16px" }}
          >
            <FontAwesomeIcon icon={faLockOpen} className="me-1" />
            Withdraw
          </button>
        )}
        {!isMature && !isUpfront && canBreak && plan.status === "active" && (
          <button
            className="quick-action-btn danger"
            style={{ fontSize: 13, padding: "6px 16px" }}
            onClick={onBreakLock}
          >
            Break Lock
          </button>
        )}
      </div>
    </div>
  );
}
