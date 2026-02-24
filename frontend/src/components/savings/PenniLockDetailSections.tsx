// frontend/src/components/savings/PenniLockDetailSections.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faClock,
  faPercent,
  faShieldHalved,
  faTriangleExclamation,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import {
  PENNILOCK_RATE_TIERS,
  PENNILOCK_BREAK_PENALTY_PERCENT,
  PENNILOCK_MIN_DAYS_BEFORE_BREAK,
} from "@/lib/constants";
import type { SavingsPlanDetail } from "@/types/dashboard";

interface PenniLockDetailSectionsProps {
  plan: SavingsPlanDetail;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function getCountdown(endDate: string): CountdownValues {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

export default function PenniLockDetailSections({ plan }: PenniLockDetailSectionsProps) {
  const [countdown, setCountdown] = useState<CountdownValues>(
    getCountdown(plan.endDate)
  );

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(plan.endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [plan.endDate]);

  const totalDays = Math.ceil(
    (new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const elapsedDays = Math.floor(
    (Date.now() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPct = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
  const rate = plan.interestRate ?? 0;
  const projectedTotal = Math.round(plan.currentAmount * (rate / 100) * (totalDays / 365));
  const earnedSoFar = Math.round(projectedTotal * (elapsedDays / totalDays));
  // Determine interest mode: if plan has 0% penalty, it's upfront
  // In real app this would be a field on the plan; for mock we infer
  const isUpfront = false; // Default to maturity for detail page mock
  const canBreak = !isUpfront && elapsedDays >= PENNILOCK_MIN_DAYS_BEFORE_BREAK;
  const breakPenalty = Math.round(plan.currentAmount * (PENNILOCK_BREAK_PENALTY_PERCENT / 100));

  return (
    <>
      {/* Row 1: Countdown + Interest Breakdown + Lock Info */}
      <div className="row g-4 mb-4">
        {/* Maturity Countdown */}
        <div className="col-md-4">
          <div className="dash-card pennilock-countdown-card">
            <h3 className="card-title" style={{ marginBottom: 20 }}>
              <FontAwesomeIcon icon={faClock} className="me-2" style={{ color: "#10B981" }} />
              Maturity Countdown
            </h3>
            {countdown.isExpired ? (
              <div className="pennilock-countdown-expired">
                <FontAwesomeIcon icon={faCheck} />
                <span>Matured!</span>
                <p>Your funds are ready for withdrawal.</p>
              </div>
            ) : (
              <div className="pennilock-countdown-grid">
                <div className="pennilock-countdown-unit">
                  <span className="pennilock-countdown-number">{countdown.days}</span>
                  <span className="pennilock-countdown-label">Days</span>
                </div>
                <span className="pennilock-countdown-separator">:</span>
                <div className="pennilock-countdown-unit">
                  <span className="pennilock-countdown-number">
                    {String(countdown.hours).padStart(2, "0")}
                  </span>
                  <span className="pennilock-countdown-label">Hours</span>
                </div>
                <span className="pennilock-countdown-separator">:</span>
                <div className="pennilock-countdown-unit">
                  <span className="pennilock-countdown-number">
                    {String(countdown.minutes).padStart(2, "0")}
                  </span>
                  <span className="pennilock-countdown-label">Mins</span>
                </div>
                <span className="pennilock-countdown-separator">:</span>
                <div className="pennilock-countdown-unit">
                  <span className="pennilock-countdown-number">
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                  <span className="pennilock-countdown-label">Secs</span>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div style={{ marginTop: 20 }}>
              <div className="pennilock-progress" style={{ height: 8 }}>
                <div
                  className="pennilock-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: 11, color: "#94A3B8" }}>
                <span>{elapsedDays} days elapsed</span>
                <span>{totalDays} days total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interest Breakdown */}
        <div className="col-md-4">
          <div className="dash-card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              <FontAwesomeIcon icon={faPercent} className="me-2" style={{ color: "#10B981" }} />
              Interest Breakdown
            </h3>
            <div className="detail-row">
              <span className="detail-label">Principal</span>
              <span className="detail-value">{formatNaira(plan.currentAmount, false)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Annual Rate</span>
              <span className="detail-value" style={{ color: "#10B981", fontWeight: 700 }}>
                {rate}% p.a.
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lock Duration</span>
              <span className="detail-value">{totalDays} days</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Earned So Far</span>
              <span className="detail-value" style={{ color: "#10B981" }}>
                +{formatNaira(earnedSoFar, false)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Projected Total</span>
              <span className="detail-value" style={{ fontWeight: 700 }}>
                +{formatNaira(projectedTotal, false)}
              </span>
            </div>
            <hr style={{ borderColor: "#E2E8F0" }} />
            <div className="detail-row">
              <span className="detail-label" style={{ fontWeight: 700 }}>At Maturity</span>
              <span className="detail-value" style={{ fontWeight: 800, fontSize: 16 }}>
                {formatNaira(plan.currentAmount + projectedTotal, false)}
              </span>
            </div>
          </div>
        </div>

        {/* Lock Info */}
        <div className="col-md-4">
          <div className="dash-card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              <FontAwesomeIcon icon={faShieldHalved} className="me-2" style={{ color: "#10B981" }} />
              Lock Info
            </h3>
            <div className="detail-row">
              <span className="detail-label">Interest Mode</span>
              <span className="detail-value">
                {isUpfront ? "Upfront" : "At Maturity"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Can Break Early?</span>
              <span className="detail-value">
                {isUpfront ? (
                  <span style={{ color: "#EF4444" }}>No (upfront interest)</span>
                ) : (
                  <span style={{ color: "#F59E0B" }}>Yes, after 30 days</span>
                )}
              </span>
            </div>
            {!isUpfront && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Break Penalty</span>
                  <span className="detail-value" style={{ color: "#EF4444" }}>
                    Forfeit all interest + 5% of principal
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Penalty Amount</span>
                  <span className="detail-value" style={{ color: "#EF4444", fontWeight: 700 }}>
                    -{formatNaira(earnedSoFar + breakPenalty, false)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">You would receive</span>
                  <span className="detail-value" style={{ fontWeight: 700 }}>
                    {formatNaira(plan.currentAmount - breakPenalty, false)}
                  </span>
                </div>
              </>
            )}
            <div className="detail-row">
              <span className="detail-label">Lock Date</span>
              <span className="detail-value">{formatDate(plan.startDate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Maturity Date</span>
              <span className="detail-value">{formatDate(plan.endDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Lock Transactions</h3>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plan.transactions.map((txn) => {
                const typeLabel = txn.type
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                const isCredit = txn.type === "interest" || txn.type === "contribution" || txn.type === "bonus_deposit";
                return (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.date)}</td>
                    <td>{typeLabel}</td>
                    <td className={isCredit ? "amount-positive" : "amount-negative"}>
                      {isCredit ? "+" : "-"}{formatNaira(txn.amount, false)}
                    </td>
                    <td>
                      <span className={`status-badge ${txn.status}`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
