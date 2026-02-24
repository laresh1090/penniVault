// frontend/src/components/savings/CreatePenniLockModal.tsx
"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faShieldHalved,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import {
  PENNILOCK_RATE_TIERS,
  PENNILOCK_MIN_AMOUNT,
  PENNILOCK_MIN_DAYS,
  PENNILOCK_MAX_DAYS,
} from "@/lib/constants";
import { useWallet } from "@/hooks";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import InterestModeToggle from "./InterestModeToggle";

interface CreatePenniLockModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const DURATION_PRESETS = [30, 60, 90, 180, 365];

function getRateForDuration(days: number): number {
  const tier = PENNILOCK_RATE_TIERS.find(
    (t) => days >= t.minDays && days <= t.maxDays
  );
  return tier?.rate ?? 0;
}

function calculateInterest(principal: number, rate: number, days: number): number {
  return Math.round(principal * (rate / 100) * (days / 365));
}

export default function CreatePenniLockModal({ onClose, onSuccess }: CreatePenniLockModalProps) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 5;

  // Form state
  const [durationDays, setDurationDays] = useState(90);
  const [customDuration, setCustomDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [interestMode, setInterestMode] = useState<"upfront" | "maturity">("maturity");
  const [fundingSource, setFundingSource] = useState("wallet");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Real wallet data
  const { wallet, paymentMethods, isLoading: walletLoading } = useWallet();

  // Derived values
  const effectiveDuration = customDuration ? parseInt(customDuration, 10) || 0 : durationDays;
  const rate = getRateForDuration(effectiveDuration);
  const parsedAmount = parseFloat(amount) || 0;
  const projectedInterest = calculateInterest(parsedAmount, rate, effectiveDuration);
  const maturityDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + effectiveDuration);
    return d;
  }, [effectiveDuration]);

  // Step validation
  const isStepValid = (s: number): boolean => {
    switch (s) {
      case 1: return effectiveDuration >= PENNILOCK_MIN_DAYS && effectiveDuration <= PENNILOCK_MAX_DAYS;
      case 2: return parsedAmount >= PENNILOCK_MIN_AMOUNT && name.trim().length >= 3;
      case 3: return true; // toggle always has a value
      case 4: return fundingSource !== "";
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS && isStepValid(step)) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const newPlan = await savingsService.createSavingsPlan({
        name,
        productType: "pennilock",
        targetAmount: parsedAmount,
        frequency: "monthly",
        contributionAmount: parsedAmount,
        startDate: new Date().toISOString().split("T")[0],
        endDate: maturityDate.toISOString().split("T")[0],
        hasInterest: true,
      });
      await savingsService.depositToSavings(newPlan.id, {
        amount: parsedAmount,
        source: "wallet",
      });
      onSuccess?.();
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: 16, border: "none" }}>
          {/* Header */}
          <div className="modal-header pennilock-modal-header">
            <div className="d-flex align-items-center gap-2">
              <div className="pennilock-modal-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div>
                <h5 className="modal-title" style={{ fontWeight: 700, color: "#1E252F", margin: 0 }}>
                  Create PenniLock
                </h5>
                <small className="text-muted">Step {step} of {TOTAL_STEPS}</small>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          {/* Progress Bar */}
          <div className="pennilock-step-progress">
            <div
              className="pennilock-step-progress-fill"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          {/* Body */}
          <div className="modal-body" style={{ padding: 24 }}>
            {/* ── STEP 1: Duration ── */}
            {step === 1 && (
              <div className="pennilock-step">
                <h6 className="pennilock-step-title">
                  <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
                  How long do you want to lock?
                </h6>
                <p className="pennilock-step-subtitle">
                  Choose a duration. Longer locks earn higher rates.
                </p>

                {/* Preset buttons */}
                <div className="pennilock-duration-presets">
                  {DURATION_PRESETS.map((d) => {
                    const tierRate = getRateForDuration(d);
                    const isActive = !customDuration && durationDays === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        className={`pennilock-duration-btn ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setDurationDays(d);
                          setCustomDuration("");
                        }}
                      >
                        <span className="pennilock-duration-days">{d} days</span>
                        <span className="pennilock-duration-rate">{tierRate}% p.a.</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom duration */}
                <div className="mb-3 mt-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                    Or enter custom days
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={`${PENNILOCK_MIN_DAYS} - ${PENNILOCK_MAX_DAYS}`}
                    min={PENNILOCK_MIN_DAYS}
                    max={PENNILOCK_MAX_DAYS}
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                  />
                </div>

                {/* Live Rate Calculator Preview */}
                <div className="pennilock-rate-preview">
                  <div className="pennilock-rate-preview-row">
                    <span>Duration</span>
                    <strong>{effectiveDuration} days</strong>
                  </div>
                  <div className="pennilock-rate-preview-row">
                    <span>Annual Rate</span>
                    <strong className="pennilock-rate-value">{rate}% p.a.</strong>
                  </div>
                  <div className="pennilock-rate-preview-row">
                    <span>Maturity Date</span>
                    <strong>{maturityDate.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}</strong>
                  </div>
                </div>

                {/* Rate Tiers Reference */}
                <div className="pennilock-tiers-table">
                  <p className="pennilock-tiers-heading">Rate Tiers</p>
                  <table>
                    <tbody>
                      {PENNILOCK_RATE_TIERS.map((tier) => (
                        <tr key={tier.minDays} className={rate === tier.rate ? "active-tier" : ""}>
                          <td>{tier.label}+</td>
                          <td className="text-end"><strong>{tier.rate}% p.a.</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── STEP 2: Amount & Title ── */}
            {step === 2 && (
              <div className="pennilock-step">
                <h6 className="pennilock-step-title">How much are you locking?</h6>
                <p className="pennilock-step-subtitle">
                  This amount will be locked for {effectiveDuration} days at {rate}% p.a.
                </p>

                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: 14, color: "#334155" }}>
                    Lock Amount (&#8358;)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="e.g. 500,000"
                    min={PENNILOCK_MIN_AMOUNT}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <small className="text-muted">
                    Minimum: {formatNaira(PENNILOCK_MIN_AMOUNT, false)}
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: 14, color: "#334155" }}>
                    Plan Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Q2 Business Capital"
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Live interest preview */}
                {parsedAmount >= PENNILOCK_MIN_AMOUNT && (
                  <div className="pennilock-interest-preview">
                    <div className="pennilock-interest-preview-row">
                      <span>You lock</span>
                      <strong>{formatNaira(parsedAmount, false)}</strong>
                    </div>
                    <div className="pennilock-interest-preview-row">
                      <span>You earn ({rate}% for {effectiveDuration} days)</span>
                      <strong className="pennilock-interest-value">
                        +{formatNaira(projectedInterest, false)}
                      </strong>
                    </div>
                    <hr style={{ margin: "8px 0", borderColor: "#E2E8F0" }} />
                    <div className="pennilock-interest-preview-row total">
                      <span>At maturity you get</span>
                      <strong>{formatNaira(parsedAmount + projectedInterest, false)}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Interest Mode ── */}
            {step === 3 && (
              <div className="pennilock-step">
                <h6 className="pennilock-step-title">When should interest be paid?</h6>
                <p className="pennilock-step-subtitle">
                  Choose when you want to receive your {formatNaira(projectedInterest, false)} interest.
                </p>

                <InterestModeToggle
                  value={interestMode}
                  onChange={setInterestMode}
                  projectedInterest={projectedInterest}
                  durationDays={effectiveDuration}
                />
              </div>
            )}

            {/* ── STEP 4: Funding Source ── */}
            {step === 4 && (
              <div className="pennilock-step">
                <h6 className="pennilock-step-title">Where should we debit from?</h6>
                <p className="pennilock-step-subtitle">
                  {interestMode === "upfront"
                    ? `${formatNaira(parsedAmount, false)} will be debited. Interest of ${formatNaira(projectedInterest, false)} will be credited to your wallet immediately.`
                    : `${formatNaira(parsedAmount, false)} will be debited and locked for ${effectiveDuration} days.`}
                </p>

                <div className="pennilock-funding-options">
                  {walletLoading ? (
                    <div className="text-center py-3">
                      <span className="spinner-border spinner-border-sm me-2" />
                      Loading payment methods...
                    </div>
                  ) : (
                    <>
                      {/* Wallet option */}
                      <label
                        className={`pennilock-funding-option ${fundingSource === "wallet" ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="fundingSource"
                          value="wallet"
                          checked={fundingSource === "wallet"}
                          onChange={() => setFundingSource("wallet")}
                        />
                        <div className="pennilock-funding-info">
                          <strong>Real Wallet</strong>
                          <span>Balance: {formatNaira(wallet?.realBalance ?? 0, false)}</span>
                        </div>
                        {wallet && parsedAmount > wallet.realBalance && (
                          <span className="pennilock-funding-insufficient">Insufficient</span>
                        )}
                      </label>

                      {/* Bank accounts */}
                      {paymentMethods.map((pm) => (
                        <label
                          key={pm.id}
                          className={`pennilock-funding-option ${fundingSource === pm.id ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="fundingSource"
                            value={pm.id}
                            checked={fundingSource === pm.id}
                            onChange={() => setFundingSource(pm.id)}
                          />
                          <div className="pennilock-funding-info">
                            <strong>{pm.bankName}</strong>
                            <span>{pm.accountNumber}</span>
                          </div>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 5: Review & Authorize ── */}
            {step === 5 && (
              <div className="pennilock-step">
                <h6 className="pennilock-step-title">
                  <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
                  Review & Lock Funds
                </h6>

                <div className="pennilock-review-card">
                  <div className="pennilock-review-row">
                    <span>Plan Name</span>
                    <strong>{name}</strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Lock Amount</span>
                    <strong>{formatNaira(parsedAmount, false)}</strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Duration</span>
                    <strong>{effectiveDuration} days</strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Interest Rate</span>
                    <strong>{rate}% p.a.</strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Interest Mode</span>
                    <strong>{interestMode === "upfront" ? "Upfront (paid now)" : "At Maturity"}</strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Projected Interest</span>
                    <strong className="pennilock-interest-value">
                      +{formatNaira(projectedInterest, false)}
                    </strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Maturity Date</span>
                    <strong>
                      {maturityDate.toLocaleDateString("en-NG", {
                        weekday: "short", year: "numeric", month: "short", day: "numeric",
                      })}
                    </strong>
                  </div>
                  <div className="pennilock-review-row">
                    <span>Funded From</span>
                    <strong>
                      {fundingSource === "wallet"
                        ? "Real Wallet"
                        : paymentMethods.find((p) => p.id === fundingSource)?.bankName ?? fundingSource}
                    </strong>
                  </div>
                  <hr />
                  <div className="pennilock-review-row total">
                    <span>At maturity you receive</span>
                    <strong>{formatNaira(parsedAmount + projectedInterest, false)}</strong>
                  </div>
                </div>

                {interestMode === "upfront" && (
                  <div className="pennilock-callout warning">
                    <strong>No early withdrawal.</strong> Upfront-interest locks cannot be broken before maturity.
                  </div>
                )}
                {interestMode === "maturity" && (
                  <div className="pennilock-callout info">
                    You can break this lock after 30 days, but you will forfeit all accrued interest and pay a 5% penalty on principal.
                  </div>
                )}

                {submitError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {submitError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer pennilock-modal-footer">
            {step > 1 ? (
              <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
              </button>
            ) : (
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn pennilock-btn-primary"
                disabled={!isStepValid(step)}
                onClick={handleNext}
              >
                Next <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
              </button>
            ) : (
              <button
                type="button"
                className="btn pennilock-btn-primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Locking...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} className="me-1" /> Lock Funds
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
