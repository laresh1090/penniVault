"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faArrowDown,
  faPercent,
  faCalendar,
  faPause,
  faPlay,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { SavingsPlan } from "@/types";

interface PenniSavePlanCardProps {
  plan: SavingsPlan;
  onQuickSave: () => void;
  onWithdraw: () => void;
}

export default function PenniSavePlanCard({
  plan,
  onQuickSave,
  onWithdraw,
}: PenniSavePlanCardProps) {
  const principal = plan.currentAmount - plan.accruedInterest;
  const hasTarget = plan.targetAmount > 0;
  const pct = hasTarget
    ? Math.min(Math.round((plan.currentAmount / plan.targetAmount) * 100), 100)
    : null;

  return (
    <div className="pennisave-plan-card">
      {/* Card Top */}
      <div className="pennisave-plan-top">
        <div>
          <h4 className="pennisave-plan-name">{plan.name}</h4>
          {plan.description && (
            <p className="pennisave-plan-desc">{plan.description}</p>
          )}
        </div>
        <span className={`status-badge ${plan.status}`}>
          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
        </span>
      </div>

      {/* Balance Section -- principal and interest separated */}
      <div className="pennisave-plan-balance-section">
        <div className="pennisave-plan-principal">
          <span className="pennisave-balance-label">Principal</span>
          <span className="pennisave-balance-amount">
            {formatNaira(principal, false)}
          </span>
        </div>
        {plan.hasInterest && (
          <div className="pennisave-plan-interest">
            <span className="pennisave-balance-label">
              <FontAwesomeIcon icon={faPercent} className="me-1" />
              Interest ({plan.interestRate}% p.a.)
            </span>
            <span className="pennisave-balance-amount interest">
              +{formatNaira(plan.accruedInterest, false)}
            </span>
          </div>
        )}
        <div className="pennisave-plan-total">
          <span className="pennisave-balance-label">Total Balance</span>
          <span className="pennisave-balance-amount total">
            {formatNaira(plan.currentAmount, false)}
          </span>
        </div>
      </div>

      {/* Progress Bar (if target is set) */}
      {hasTarget && pct !== null && (
        <div className="pennisave-plan-progress-section">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="pennisave-progress-label">
              {pct}% of {formatNaira(plan.targetAmount, false)}
            </span>
          </div>
          <div className="savings-progress">
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: "#3B82F6" }}
            />
          </div>
        </div>
      )}

      {/* Info Tags Row */}
      <div className="pennisave-plan-info-row">
        <div className="pennisave-info-tag">
          <FontAwesomeIcon icon={faCalendar} />
          <span>
            {plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1)}{" "}
            &middot; {formatNaira(plan.contributionAmount, false)}
          </span>
        </div>
        {plan.earlyWithdrawalPenaltyPercent > 0 && (
          <div className="pennisave-info-tag penalty">
            <span>{plan.earlyWithdrawalPenaltyPercent}% withdrawal fee</span>
          </div>
        )}
        {plan.earlyWithdrawalPenaltyPercent === 0 && (
          <div className="pennisave-info-tag free">
            <span>Free withdrawals</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pennisave-plan-actions">
        {plan.status === "active" && (
          <>
            <button
              className="pennisave-action-btn quicksave"
              onClick={onQuickSave}
            >
              <FontAwesomeIcon icon={faBoltLightning} /> Quick Save
            </button>
            <button
              className="pennisave-action-btn withdraw"
              onClick={onWithdraw}
            >
              <FontAwesomeIcon icon={faArrowDown} /> Withdraw
            </button>
          </>
        )}
        <Link
          href={`/savings/${plan.id}`}
          className="pennisave-action-btn details"
        >
          Details <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      </div>
    </div>
  );
}
