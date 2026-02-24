"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPiggyBank,
  faArrowRight,
  faArrowLeft,
  faCheck,
  faNairaSign,
  faPercent,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import type { SavingsFrequency } from "@/types/common";

interface CreatePenniSaveModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
  contributionAmount: string;
  frequency: SavingsFrequency;
  targetAmount: string;
  startDate: string;
  enableInterest: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const INTEREST_RATES: Record<SavingsFrequency, number> = {
  daily: 5,
  weekly: 6,
  biweekly: 7,
  monthly: 8,
};

const STEPS = [
  { number: 1, label: "Name" },
  { number: 2, label: "Auto-Save" },
  { number: 3, label: "Interest" },
  { number: 4, label: "Review" },
];

export default function CreatePenniSaveModal({
  onClose,
  onSuccess,
}: CreatePenniSaveModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    contributionAmount: "",
    frequency: "daily",
    targetAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    enableInterest: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const interestRate = INTEREST_RATES[form.frequency];

  // Time-to-target calculator
  const getTimeToTarget = (): string | null => {
    const target = Number(form.targetAmount);
    const contribution = Number(form.contributionAmount);
    if (!target || !contribution || contribution <= 0) return null;

    const intervals = Math.ceil(target / contribution);
    const freqDays: Record<string, number> = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
    };
    const totalDays = intervals * (freqDays[form.frequency] ?? 30);

    if (totalDays < 30) return `~${totalDays} day${totalDays !== 1 ? "s" : ""}`;
    if (totalDays < 365) {
      const months = Math.round(totalDays / 30);
      return `~${months} month${months !== 1 ? "s" : ""}`;
    }
    const years = (totalDays / 365).toFixed(1);
    return `~${years} year${Number(years) !== 1 ? "s" : ""}`;
  };

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // -- Validation per step --
  const validateStep = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};

    if (s === 1) {
      if (!form.name.trim()) errs.name = "Plan name is required";
      if (form.name.trim().length > 50) errs.name = "Max 50 characters";
    }
    if (s === 2) {
      const amt = Number(form.contributionAmount);
      if (!amt || amt < 100) errs.contributionAmount = "Minimum amount is \u20A6100";
      if (!form.startDate) errs.startDate = "Start date is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await savingsService.createSavingsPlan({
        name: form.name,
        description: form.description || undefined,
        productType: "pennisave",
        targetAmount: Number(form.targetAmount) || 0,
        frequency: form.frequency,
        contributionAmount: Number(form.contributionAmount),
        startDate: form.startDate,
        hasInterest: form.enableInterest,
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content pennisave-modal">
          {/* Modal Header */}
          <div className="pennisave-modal-header">
            <div className="d-flex align-items-center gap-3">
              <div className="pennisave-modal-icon">
                <FontAwesomeIcon icon={faPiggyBank} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Create PenniSave</h5>
                <p className="pennisave-modal-subtitle">
                  Step {step} of 4 &middot; {STEPS[step - 1].label}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="pennisave-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="pennisave-step-bar">
            {STEPS.map((s) => (
              <div
                key={s.number}
                className={`pennisave-step-dot ${
                  s.number < step
                    ? "completed"
                    : s.number === step
                    ? "active"
                    : ""
                }`}
              >
                {s.number < step ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  s.number
                )}
              </div>
            ))}
            <div className="pennisave-step-line">
              <div
                className="pennisave-step-line-fill"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="pennisave-modal-body">
            {/* STEP 1: Name */}
            {step === 1 && (
              <div className="pennisave-step-content">
                <h6 className="pennisave-step-title">Name your PenniSave plan</h6>
                <p className="pennisave-step-desc">
                  Give your savings plan a memorable name so you can easily identify it.
                </p>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Plan Name <span className="required">*</span>
                  </label>
                  <input
                    className={`pv-form-input ${errors.name ? "error" : ""}`}
                    placeholder="e.g. Emergency Fund, Rainy Day Stash"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    maxLength={50}
                  />
                  {errors.name && (
                    <div className="pv-form-error">{errors.name}</div>
                  )}
                </div>

                <div className="pv-form-group">
                  <label className="pv-form-label">Description (optional)</label>
                  <textarea
                    className="pv-form-input"
                    placeholder="What are you saving for?"
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    maxLength={200}
                    style={{ resize: "none" }}
                  />
                  <span className="pennisave-char-count">
                    {form.description.length}/200
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: Auto-Save Settings */}
            {step === 2 && (
              <div className="pennisave-step-content">
                <h6 className="pennisave-step-title">Set up auto-save</h6>
                <p className="pennisave-step-desc">
                  Choose how much and how often you want to save automatically.
                </p>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Amount per contribution <span className="required">*</span>
                  </label>
                  <div className="pennisave-amount-input-wrapper">
                    <span className="pennisave-amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className={`pv-form-input pennisave-amount-input ${
                        errors.contributionAmount ? "error" : ""
                      }`}
                      type="number"
                      placeholder="5,000"
                      value={form.contributionAmount}
                      onChange={(e) =>
                        updateField("contributionAmount", e.target.value)
                      }
                      min={100}
                    />
                  </div>
                  {errors.contributionAmount && (
                    <div className="pv-form-error">{errors.contributionAmount}</div>
                  )}
                  <div className="pennisave-amount-hints">
                    {[1000, 2000, 5000, 10000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="pennisave-amount-chip"
                        onClick={() =>
                          updateField("contributionAmount", String(amt))
                        }
                      >
                        {formatNaira(amt, false)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">Frequency</label>
                  <div className="pennisave-frequency-options">
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`pennisave-frequency-btn ${
                          form.frequency === opt.value ? "selected" : ""
                        }`}
                        onClick={() =>
                          updateField("frequency", opt.value as SavingsFrequency)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Target Amount
                    <span
                      className="info-tooltip"
                      data-tip="Set a savings goal and we'll show you when you'll reach it"
                    >
                      i
                    </span>
                  </label>
                  <div className="pennisave-amount-input-wrapper">
                    <span className="pennisave-amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className="pv-form-input pennisave-amount-input"
                      type="number"
                      placeholder="e.g. 500,000"
                      value={form.targetAmount}
                      onChange={(e) => updateField("targetAmount", e.target.value)}
                      min={0}
                    />
                  </div>
                  {getTimeToTarget() && (
                    <div className="pennisave-time-estimate">
                      At {formatNaira(Number(form.contributionAmount), false)}/{form.frequency}, you&apos;ll reach your target in approximately <strong>{getTimeToTarget()}</strong>
                    </div>
                  )}
                </div>

                <div className="pv-form-group">
                  <label className="pv-form-label">Start Date</label>
                  <input
                    className={`pv-form-input ${errors.startDate ? "error" : ""}`}
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                  {errors.startDate && (
                    <div className="pv-form-error">{errors.startDate}</div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Interest & Funding Source */}
            {step === 3 && (
              <div className="pennisave-step-content">
                <h6 className="pennisave-step-title">Interest & Funding</h6>
                <p className="pennisave-step-desc">
                  Opt in to earn interest on your savings and review your funding source.
                </p>

                {/* Interest Toggle */}
                <div className="pennisave-interest-card mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="pennisave-interest-label">Earn Interest</p>
                      <p className="pennisave-interest-desc">
                        Get up to {interestRate}% p.a. on your PenniSave balance
                      </p>
                    </div>
                    <div className="form-check form-switch form-switch-lg">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={form.enableInterest}
                        onChange={(e) =>
                          updateField("enableInterest", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                  {form.enableInterest && (
                    <div className="pennisave-interest-rate-display">
                      <FontAwesomeIcon icon={faPercent} />
                      <span>{interestRate}% per annum</span>
                      <span className="pennisave-interest-note">
                        &middot; Accrued daily, paid monthly
                      </span>
                    </div>
                  )}
                </div>

                {/* Penalty Notice */}
                <div className="pennisave-penalty-notice mb-4">
                  <p className="pennisave-penalty-title">Withdrawal Penalty</p>
                  <p className="pennisave-penalty-desc">
                    {form.enableInterest
                      ? "A 2% penalty applies to withdrawals from interest-earning plans."
                      : "No withdrawal penalty for non-interest plans. Withdraw anytime for free."}
                  </p>
                </div>

                {/* Funding Source */}
                <div className="pv-form-group">
                  <label className="pv-form-label">Funding Source</label>
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

            {/* STEP 4: Review & Confirm */}
            {step === 4 && (
              <div className="pennisave-step-content">
                <h6 className="pennisave-step-title">Review your PenniSave</h6>
                <p className="pennisave-step-desc">
                  Make sure everything looks right before creating your plan.
                </p>

                {submitError && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    style={{ fontSize: 14, marginBottom: 16 }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="pennisave-review-card">
                  <div className="pennisave-review-header">
                    <FontAwesomeIcon
                      icon={faPiggyBank}
                      className="pennisave-review-icon"
                    />
                    <h6 className="pennisave-review-name">{form.name}</h6>
                    {form.description && (
                      <p className="pennisave-review-desc">{form.description}</p>
                    )}
                  </div>

                  <div className="pennisave-review-rows">
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">Contribution</span>
                      <span className="pennisave-review-value">
                        {formatNaira(Number(form.contributionAmount) || 0, false)}{" "}
                        / {form.frequency}
                      </span>
                    </div>
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">Target Amount</span>
                      <span className="pennisave-review-value">
                        {Number(form.targetAmount)
                          ? formatNaira(Number(form.targetAmount), false)
                          : "Flexible (no target)"}
                      </span>
                    </div>
                    {getTimeToTarget() && (
                      <div className="pennisave-review-row">
                        <span className="pennisave-review-label">Est. Completion</span>
                        <span className="pennisave-review-value">
                          {getTimeToTarget()}
                        </span>
                      </div>
                    )}
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">Start Date</span>
                      <span className="pennisave-review-value">
                        {form.startDate}
                      </span>
                    </div>
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">Interest</span>
                      <span className="pennisave-review-value">
                        {form.enableInterest
                          ? `${interestRate}% p.a.`
                          : "Disabled"}
                      </span>
                    </div>
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">
                        Early Withdrawal
                      </span>
                      <span className="pennisave-review-value">
                        {form.enableInterest
                          ? "You may lose accrued interest (2% penalty)"
                          : "No penalty"}
                      </span>
                    </div>
                    <div className="pennisave-review-row">
                      <span className="pennisave-review-label">Funding Source</span>
                      <span className="pennisave-review-value">
                        Real Wallet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pennisave-modal-footer">
            {step > 1 && (
              <button
                type="button"
                className="quick-action-btn secondary"
                onClick={goBack}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 4 ? (
              <button
                type="button"
                className="quick-action-btn primary"
                onClick={goNext}
              >
                Continue <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                type="button"
                className="quick-action-btn primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isSubmitting ? "Creating..." : "Create PenniSave"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
