"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBoltLightning,
  faNairaSign,
  faCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import type { SavingsPlan } from "@/types";

interface QuickSaveModalProps {
  plan: SavingsPlan;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function QuickSaveModal({
  plan,
  onClose,
  onSuccess,
}: QuickSaveModalProps) {
  const [step, setStep] = useState<"amount" | "confirm">("amount");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleContinue = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      setError("Minimum quick save amount is \u20A6100");
      return;
    }
    setError("");
    setSubmitError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await savingsService.depositToSavings(plan.id, {
        amount: Number(amount),
        source: "wallet",
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
              <div className="pennisave-modal-icon quicksave">
                <FontAwesomeIcon icon={faBoltLightning} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Quick Save</h5>
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
                  Current balance:{" "}
                  <strong>{formatNaira(plan.currentAmount, false)}</strong>
                </p>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Amount <span className="required">*</span>
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
                      min={100}
                      autoFocus
                    />
                  </div>
                  {error && <div className="pv-form-error">{error}</div>}
                  <div className="pennisave-amount-hints">
                    {[1000, 5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="pennisave-amount-chip"
                        onClick={() => setAmount(String(amt))}
                      >
                        {formatNaira(amt, false)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pv-form-group">
                  <label className="pv-form-label">Pay From</label>
                  <div className="pennisave-funding-options">
                    <div className="pennisave-funding-option selected">
                      <FontAwesomeIcon
                        icon={faWallet}
                        className="pennisave-funding-icon"
                      />
                      <div>
                        <p className="pennisave-funding-bank">Real Wallet</p>
                        <span className="pennisave-funding-acct">
                          Funds will be deducted from your Real Wallet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === "confirm" && (
              <div className="pennisave-step-content">
                <div className="pennisave-confirm-summary">
                  <div className="pennisave-confirm-amount">
                    {formatNaira(Number(amount), false)}
                  </div>
                  <p className="pennisave-confirm-to">
                    Saving to <strong>{plan.name}</strong>
                  </p>
                  <div className="pennisave-confirm-from">
                    <FontAwesomeIcon icon={faWallet} />
                    <span>From: Real Wallet</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pennisave-modal-footer">
            {step === "confirm" && (
              <button
                className="quick-action-btn secondary"
                onClick={() => setStep("amount")}
                disabled={isSubmitting}
              >
                Edit
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step === "amount" ? (
              <button
                className="quick-action-btn primary"
                onClick={handleContinue}
              >
                Continue
              </button>
            ) : (
              <button
                className="quick-action-btn primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isSubmitting ? "Saving..." : "Confirm Quick Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
