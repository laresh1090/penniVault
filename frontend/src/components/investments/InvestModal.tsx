"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChartLine,
  faNairaSign,
  faWallet,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate, formatPercentage } from "@/lib/formatters";
import { useInvest } from "@/hooks/useInvest";
import type { CrowdInvestment } from "@/types";

interface InvestModalProps {
  investment: CrowdInvestment;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InvestModal({
  investment,
  onClose,
  onSuccess,
}: InvestModalProps) {
  const [step, setStep] = useState<"amount" | "confirm">("amount");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { invest, isProcessing, error: submitError } = useInvest();

  const handleContinue = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < investment.minimumInvestment) {
      setError(`Minimum investment is ${formatNaira(investment.minimumInvestment, false)}`);
      return;
    }
    const remaining = investment.targetAmount - investment.raisedAmount;
    if (numAmount > remaining) {
      setError(`Maximum you can invest is ${formatNaira(remaining, false)} (remaining amount)`);
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    const result = await invest(investment.id, { amount: Number(amount) });
    if (result) {
      onSuccess?.();
      onClose();
    } else {
      setStep("amount");
    }
  };

  const expectedReturn = Number(amount) * (1 + investment.expectedReturnPercent / 100);
  const progressPercent = Math.round((investment.raisedAmount / investment.targetAmount) * 100);

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content pennisave-modal">
          {/* Header */}
          <div className="pennisave-modal-header compact">
            <div className="d-flex align-items-center gap-3">
              <div className="pennisave-modal-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3B82F6" }}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Invest</h5>
                <p className="pennisave-modal-subtitle">{investment.title}</p>
              </div>
            </div>
            <button
              type="button"
              className="pennisave-modal-close"
              onClick={onClose}
              disabled={isProcessing}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="pennisave-modal-body">
            {submitError && (
              <div className="alert alert-danger" role="alert" style={{ fontSize: 14, marginBottom: 16 }}>
                {submitError}
              </div>
            )}

            {/* Step 1: Amount */}
            {step === "amount" && (
              <div className="pennisave-step-content">
                {/* Investment summary */}
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Expected Return</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>
                      {formatPercentage(investment.expectedReturnPercent)} p.a.
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Maturity Date</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E252F" }}>
                      {formatDate(investment.maturityDate)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E252F" }}>
                      {progressPercent}% funded
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Min Investment</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E252F" }}>
                      {formatNaira(investment.minimumInvestment, false)}
                    </span>
                  </div>
                </div>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Investment Amount <span className="required">*</span>
                  </label>
                  <div className="pennisave-amount-input-wrapper">
                    <span className="pennisave-amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className={`pv-form-input pennisave-amount-input ${error ? "error" : ""}`}
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                      }}
                      min={investment.minimumInvestment}
                      autoFocus
                    />
                  </div>
                  {error && <div className="pv-form-error">{error}</div>}
                  <div className="pennisave-amount-hints">
                    {[investment.minimumInvestment, investment.minimumInvestment * 2, investment.minimumInvestment * 5].map((amt) => (
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
                      <FontAwesomeIcon icon={faWallet} className="pennisave-funding-icon" />
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
                    Investing in <strong>{investment.title}</strong>
                  </p>
                  <div className="pennisave-confirm-from">
                    <FontAwesomeIcon icon={faWallet} />
                    <span>From: Real Wallet</span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#F0FDF4",
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Amount Invested</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1E252F" }}>
                      {formatNaira(Number(amount), false)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Expected Return</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>
                      {formatNaira(expectedReturn, false)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Return Rate</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>
                      {formatPercentage(investment.expectedReturnPercent)} p.a.
                    </span>
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
                disabled={isProcessing}
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
                disabled={isProcessing}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isProcessing ? "Investing..." : "Confirm Investment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
