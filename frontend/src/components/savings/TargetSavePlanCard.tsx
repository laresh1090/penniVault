"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faClock,
  faCheck,
  faCalendarDay,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { SavingsPlan } from "@/types";

interface TargetSavePlanCardProps {
  plan: SavingsPlan;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function TargetSavePlanCard({ plan, onAddFunds, onWithdraw }: TargetSavePlanCardProps) {
  const isCompleted = plan.status === "completed";
  const progressPct = plan.targetAmount > 0
    ? Math.min(100, Math.round((plan.currentAmount / plan.targetAmount) * 100))
    : 0;
  const targetReached = progressPct >= 100;
  const daysRemaining = plan.endDate ? getDaysRemaining(plan.endDate) : null;

  return (
    <div className={`targetsave-card ${isCompleted ? "completed" : ""} ${targetReached ? "reached" : ""}`}>
      {/* Top: name + status */}
      <div className="targetsave-card-header">
        <div>
          <span className="targetsave-product-tag">TargetSave</span>
          <h4 className="targetsave-card-name">{plan.name}</h4>
        </div>
        <span className={`status-badge ${plan.status}`}>
          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
        </span>
      </div>

      {/* Saved Amount */}
      <div className="targetsave-card-balance">
        <span className="targetsave-saved-label">
          <FontAwesomeIcon icon={faBullseye} className="me-1" />
          Saved
        </span>
        <span className="targetsave-saved-value">
          {formatNaira(plan.currentAmount, false)}
        </span>
        {plan.targetAmount > 0 && (
          <span className="targetsave-target-value">
            {" "}/ {formatNaira(plan.targetAmount, false)}
          </span>
        )}
      </div>

      {/* Goal Progress Bar */}
      {plan.targetAmount > 0 && (
        <div className="targetsave-goal-section">
          <div className="targetsave-progress">
            <div
              className="targetsave-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="targetsave-progress-label">
            <span>{progressPct}% of target</span>
            <span>{formatNaira(plan.targetAmount - plan.currentAmount, false)} to go</span>
          </div>
        </div>
      )}

      {/* Info Tags */}
      <div className="targetsave-info-tags">
        {plan.frequency && plan.contributionAmount > 0 && (
          <span className="targetsave-info-tag frequency">
            <FontAwesomeIcon icon={faCalendarDay} />
            {formatNaira(plan.contributionAmount, false)}/{plan.frequency}
          </span>
        )}
        {targetReached && (
          <span className="targetsave-info-tag reached-tag">
            <FontAwesomeIcon icon={faCheck} />
            Target Reached
          </span>
        )}
        {plan.hasInterest && plan.interestRate && (
          <span className="targetsave-info-tag interest">
            <FontAwesomeIcon icon={faArrowTrendUp} />
            {plan.interestRate}% p.a.
          </span>
        )}
      </div>

      {/* Target Date Countdown */}
      {plan.endDate && (
        <div className="targetsave-countdown">
          {daysRemaining === 0 ? (
            <span className="targetsave-countdown-reached">
              <FontAwesomeIcon icon={faCheck} className="me-1" />
              Target date reached!
            </span>
          ) : (
            <span className="targetsave-countdown-days">
              <FontAwesomeIcon icon={faClock} className="me-1" />
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} to target date &middot; {formatDate(plan.endDate)}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="targetsave-card-actions">
        <Link
          href={`/savings/${plan.id}`}
          className="quick-action-btn outline"
          style={{ fontSize: 13, padding: "6px 16px" }}
        >
          View Details
        </Link>
        {plan.status === "active" && !targetReached && (
          <button
            className="quick-action-btn primary targetsave-add-funds-btn"
            style={{ fontSize: 13, padding: "6px 16px" }}
            onClick={onAddFunds}
          >
            Add Funds
          </button>
        )}
        {targetReached && plan.status === "active" && (
          <button
            className="quick-action-btn primary targetsave-add-funds-btn"
            style={{ fontSize: 13, padding: "6px 16px" }}
            onClick={onWithdraw}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}
