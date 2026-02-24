// frontend/src/components/savings/BreakLockModal.tsx
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import type { SavingsPlan } from "@/types";

interface BreakLockModalProps {
  plan: SavingsPlan;
  onClose: () => void;
  onConfirm?: () => void;
}

function calculateBreakPenalty(plan: SavingsPlan) {
  const principal = plan.currentAmount;
  const accruedInterest = plan.accruedInterest;
  const penaltyPercent = plan.earlyWithdrawalPenaltyPercent;
  const penaltyOnPrincipal = Math.round(principal * (penaltyPercent / 100));
  const totalLoss = accruedInterest + penaltyOnPrincipal;
  const netReceived = principal - penaltyOnPrincipal;
  return { principal, accruedInterest, penaltyPercent, penaltyOnPrincipal, totalLoss, netReceived };
}

export default function BreakLockModal({ plan, onClose, onConfirm }: BreakLockModalProps) {
  const [breakConfirm, setBreakConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const penalty = calculateBreakPenalty(plan);
  const canProceed = breakConfirm.toUpperCase() === "BREAK";

  const handleConfirm = async () => {
    if (!canProceed) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await savingsService.withdrawFromSavings(plan.id, {
        amount: plan.currentAmount,
        destination: "wallet",
        confirmPenalty: true,
      });
      onConfirm?.();
      onClose();
    } catch (err) {
      setSubmitError(extractApiError(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: 16, border: "none" }}>
          {/* Header */}
          <div className="modal-header pennilock-break-header">
            <div className="d-flex align-items-center gap-2">
              <div className="pennilock-break-icon">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div>
                <h5 className="modal-title" style={{ fontWeight: 700, color: "#991B1B", margin: 0 }}>
                  Break PenniLock
                </h5>
                <small style={{ color: "#DC2626" }}>
                  {plan.name}
                </small>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body" style={{ padding: 24 }}>
            <div className="pennilock-break-warning">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <p>
                Breaking this lock will <strong>forfeit all accrued interest</strong> and charge
                a <strong>{penalty.penaltyPercent}% penalty on your principal</strong>. This action cannot be undone.
              </p>
            </div>

            {/* Penalty Breakdown */}
            <div className="pennilock-penalty-breakdown">
              <div className="pennilock-penalty-row">
                <span>Locked Principal</span>
                <strong>{formatNaira(penalty.principal, false)}</strong>
              </div>
              <div className="pennilock-penalty-row loss">
                <span>Forfeited Interest</span>
                <strong>-{formatNaira(penalty.accruedInterest, false)}</strong>
              </div>
              <div className="pennilock-penalty-row loss">
                <span>{penalty.penaltyPercent}% Principal Penalty</span>
                <strong>-{formatNaira(penalty.penaltyOnPrincipal, false)}</strong>
              </div>
              <hr style={{ borderColor: "#FECACA" }} />
              <div className="pennilock-penalty-row total-loss">
                <span>Total You Lose</span>
                <strong>-{formatNaira(penalty.totalLoss, false)}</strong>
              </div>
              <div className="pennilock-penalty-row net">
                <span>You Will Receive</span>
                <strong>{formatNaira(penalty.netReceived, false)}</strong>
              </div>
            </div>

            {/* Type BREAK confirmation */}
            <div className="mt-4">
              <label
                className="form-label"
                style={{ fontWeight: 600, fontSize: 14, color: "#991B1B" }}
              >
                Type <strong>BREAK</strong> to confirm
              </label>
              <input
                type="text"
                className="form-control pennilock-break-input"
                placeholder="Type BREAK here"
                value={breakConfirm}
                onChange={(e) => setBreakConfirm(e.target.value)}
                autoComplete="off"
              />
            </div>

            {submitError && (
              <div className="alert alert-danger mt-3" role="alert">
                {submitError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ borderTop: "1px solid #FEE2E2", padding: "16px 24px" }}>
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={!canProceed || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Breaking...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLockOpen} className="me-1" />
                  Break Lock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
