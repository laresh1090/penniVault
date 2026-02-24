"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowDown,
  faNairaSign,
  faTriangleExclamation,
  faCheck,
  faWallet,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import type { SavingsPlan } from "@/types";

interface WithdrawPenniSaveModalProps {
  plan: SavingsPlan;
  onClose: () => void;
  onSuccess?: () => void;
}

type WithdrawStep = "amount" | "review";

export default function WithdrawPenniSaveModal({
  plan,
  onClose,
  onSuccess,
}: WithdrawPenniSaveModalProps) {
  const [step, setStep] = useState<WithdrawStep>("amount");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const numAmount = Number(amount) || 0;
  const penaltyPercent = plan.earlyWithdrawalPenaltyPercent;
  const penaltyAmount = Math.round(numAmount * (penaltyPercent / 100));
  const netAmount = numAmount - penaltyAmount;

  const handleAmountContinue = () => {
    if (numAmount < 100) {
      setError("Minimum withdrawal is \u20A6100");
      return;
    }
    if (numAmount > plan.currentAmount) {
      setError(
        `Maximum withdrawal is ${formatNaira(plan.currentAmount, false)}`
      );
      return;
    }
    setError("");
    setSubmitError("");
    setStep("review");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await savingsService.withdrawFromSavings(plan.id, {
        amount: numAmount,
        destination: "wallet",
        confirmPenalty: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitError(extractApiError(err));
      setIsSubmitting(false);
      setStep("amount");
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content pennisave-modal">
          {/* Header */}
          <div className="pennisave-modal-header compact">
            <div className="d-flex align-items-center gap-3">
              <div className="pennisave-modal-icon withdraw">
                <FontAwesomeIcon icon={faArrowDown} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Withdraw</h5>
                <p className="pennisave-modal-subtitle">{plan.name}</p>
              </div>
            </div>
            <button
              type="button"
              className="pennisave-modal-close"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="pennisave-modal-body">
            {submitError && (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ fontSize: 14, marginBottom: 16 }}
              >
                {submitError}
              </div>
            )}

            {/* Step 1: Amount */}
            {step === "amount" && (
              <div className="pennisave-step-content">
                <p className="pennisave-quicksave-balance">
                  Available:{" "}
                  <strong>{formatNaira(plan.currentAmount, false)}</strong>
                </p>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Withdrawal Amount <span className="required">*</span>
                  </label>
                  <div className="pennisave-amount-input-wrapper">
                    <span className="pennisave-amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className={`pv-form-input pennisave-amount-input ${
                        error ? "error" : ""
                      }`}
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                      }}
                      max={plan.currentAmount}
                      autoFocus
                    />
                  </div>
                  {error && <div className="pv-form-error">{error}</div>}
                  <button
                    type="button"
                    className="pennisave-withdraw-all-btn"
                    onClick={() => setAmount(String(plan.currentAmount))}
                  >
                    Withdraw all
                  </button>
                </div>

                {/* Live Penalty Preview */}
                {numAmount > 0 && penaltyPercent > 0 && (
                  <div className="pennisave-penalty-preview">
                    <div className="pennisave-penalty-preview-icon">
                      <FontAwesomeIcon icon={faTriangleExclamation} />
                    </div>
                    <div>
                      <p className="pennisave-penalty-preview-title">
                        {penaltyPercent}% Withdrawal Penalty
                      </p>
                      <div className="pennisave-penalty-breakdown">
                        <div className="pennisave-penalty-row">
                          <span>Requested</span>
                          <span>{formatNaira(numAmount, false)}</span>
                        </div>
                        <div className="pennisave-penalty-row penalty">
                          <span>Penalty ({penaltyPercent}%)</span>
                          <span>-{formatNaira(penaltyAmount, false)}</span>
                        </div>
                        <div className="pennisave-penalty-row net">
                          <span>You receive</span>
                          <span>{formatNaira(netAmount, false)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {numAmount > 0 && penaltyPercent === 0 && (
                  <div className="pennisave-penalty-preview free">
                    <p style={{ margin: 0, fontSize: 13 }}>
                      No withdrawal penalty. You receive the full{" "}
                      <strong>{formatNaira(numAmount, false)}</strong>.
                    </p>
                  </div>
                )}

                <div className="pv-form-group mt-3">
                  <label className="pv-form-label">Withdraw To</label>
                  <div className="pennisave-funding-options">
                    <div className="pennisave-funding-option selected">
                      <FontAwesomeIcon
                        icon={faWallet}
                        className="pennisave-funding-icon"
                      />
                      <div>
                        <p className="pennisave-funding-bank">Real Wallet</p>
                        <span className="pennisave-funding-acct">
                          Funds will be sent to your Real Wallet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <div className="pennisave-step-content">
                <div className="pennisave-confirm-summary">
                  <div className="pennisave-confirm-amount withdrawal">
                    {formatNaira(netAmount, false)}
                  </div>
                  <p className="pennisave-confirm-to">
                    Withdrawing from <strong>{plan.name}</strong>
                  </p>
                  {penaltyPercent > 0 && (
                    <p className="pennisave-confirm-penalty">
                      <FontAwesomeIcon icon={faTriangleExclamation} />{" "}
                      {formatNaira(penaltyAmount, false)} penalty deducted
                    </p>
                  )}
                  <div className="pennisave-confirm-from">
                    <FontAwesomeIcon icon={faWallet} />
                    <span>To: Real Wallet</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pennisave-modal-footer">
            {step === "review" && (
              <button
                className="quick-action-btn secondary"
                onClick={() => setStep("amount")}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step === "amount" && (
              <button
                className="quick-action-btn primary"
                onClick={handleAmountContinue}
              >
                Continue
              </button>
            )}
            {step === "review" && (
              <button
                className="quick-action-btn primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
                style={{ background: "#DC2626", borderColor: "#DC2626" }}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isSubmitting
                  ? "Withdrawing..."
                  : `Withdraw ${formatNaira(netAmount, false)}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
