"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBullseye,
  faArrowRight,
  faArrowLeft,
  faCheck,
  faNairaSign,
  faWallet,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { savingsService } from "@/services/savings.service";
import { extractApiError } from "@/lib/api";
import { useWallet } from "@/hooks";
import type { SavingsFrequency } from "@/types/common";

interface CreateTargetSaveModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
  targetAmount: string;
  targetDate: string;
  enableAutoSave: boolean;
  contributionAmount: string;
  frequency: SavingsFrequency;
  initialDeposit: string;
  startDate: string;
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const STEPS = [
  { number: 1, label: "Goal" },
  { number: 2, label: "Auto-Save" },
  { number: 3, label: "Funding" },
  { number: 4, label: "Review" },
];

export default function CreateTargetSaveModal({
  onClose,
  onSuccess,
}: CreateTargetSaveModalProps) {
  const [step, setStep] = useState(1);
  const { wallet } = useWallet();
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    targetAmount: "",
    targetDate: "",
    enableAutoSave: true,
    contributionAmount: "",
    frequency: "monthly",
    initialDeposit: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Time-to-target calculator
  const getTimeToTarget = (): string | null => {
    const target = Number(form.targetAmount);
    const contribution = Number(form.contributionAmount);
    if (!target || !contribution || contribution <= 0 || !form.enableAutoSave) return null;

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
      if (!form.name.trim()) errs.name = "Goal name is required";
      if (form.name.trim().length > 50) errs.name = "Max 50 characters";
      const target = Number(form.targetAmount);
      if (!target || target < 1000) errs.targetAmount = "Minimum target is ₦1,000";
      if (!form.targetDate) errs.targetDate = "Target date is required";
      else {
        const targetDate = new Date(form.targetDate);
        const now = new Date();
        if (targetDate <= now) errs.targetDate = "Target date must be in the future";
      }
    }
    if (s === 2 && form.enableAutoSave) {
      const amt = Number(form.contributionAmount);
      if (!amt || amt < 100) errs.contributionAmount = "Minimum is ₦100";
    }
    if (s === 3) {
      const deposit = Number(form.initialDeposit);
      const balance = wallet?.realBalance ?? 0;
      if (deposit > 0 && deposit > balance) {
        errs.initialDeposit = "Insufficient wallet balance";
      }
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
        productType: "targetsave",
        targetAmount: Number(form.targetAmount),
        frequency: form.enableAutoSave ? form.frequency : "monthly",
        contributionAmount: form.enableAutoSave ? Number(form.contributionAmount) : 0,
        startDate: form.startDate,
        endDate: form.targetDate,
        hasInterest: false,
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
        <div className="modal-content" style={{ borderRadius: 16, overflow: "hidden" }}>
          {/* Modal Header */}
          <div className="targetsave-modal-header">
            <div className="d-flex align-items-center gap-3">
              <div className="targetsave-modal-icon">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <div>
                <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Create TargetSave</h5>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                  Step {step} of 4 &middot; {STEPS[step - 1].label}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Step Progress */}
          <div className="targetsave-step-progress">
            <div
              className="targetsave-step-progress-fill"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Modal Body */}
          <div style={{ padding: "24px" }}>
            {/* STEP 1: Goal Setup */}
            {step === 1 && (
              <div>
                <h6 className="targetsave-step-title">Set your savings goal</h6>
                <p className="targetsave-step-subtitle">
                  Name your goal, set a target amount, and choose a deadline.
                </p>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Goal Name <span className="required">*</span>
                  </label>
                  <input
                    className={`pv-form-input ${errors.name ? "error" : ""}`}
                    placeholder="e.g. Dream Home Fund, New Car, Wedding"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    maxLength={50}
                  />
                  {errors.name && <div className="pv-form-error">{errors.name}</div>}
                </div>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">Description (optional)</label>
                  <textarea
                    className="pv-form-input"
                    placeholder="What are you saving for?"
                    rows={2}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    maxLength={200}
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="pv-form-group mb-3">
                  <label className="pv-form-label">
                    Target Amount <span className="required">*</span>
                  </label>
                  <div className="targetsave-amount-input">
                    <span className="amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className={`form-control ${errors.targetAmount ? "is-invalid" : ""}`}
                      type="number"
                      placeholder="e.g. 5,000,000"
                      value={form.targetAmount}
                      onChange={(e) => updateField("targetAmount", e.target.value)}
                      min={1000}
                    />
                  </div>
                  {errors.targetAmount && <div className="pv-form-error">{errors.targetAmount}</div>}
                  <div className="targetsave-amount-hints">
                    {[500000, 1000000, 2000000, 5000000, 10000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`targetsave-amount-hint ${Number(form.targetAmount) === amt ? "active" : ""}`}
                        onClick={() => updateField("targetAmount", String(amt))}
                      >
                        {formatNaira(amt, false)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pv-form-group">
                  <label className="pv-form-label">
                    Target Date <span className="required">*</span>
                  </label>
                  <input
                    className={`pv-form-input ${errors.targetDate ? "error" : ""}`}
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => updateField("targetDate", e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  />
                  {errors.targetDate && <div className="pv-form-error">{errors.targetDate}</div>}
                </div>
              </div>
            )}

            {/* STEP 2: Auto-Save */}
            {step === 2 && (
              <div>
                <h6 className="targetsave-step-title">Auto-save settings</h6>
                <p className="targetsave-step-subtitle">
                  Set up automatic contributions to reach your goal faster. You can also save manually.
                </p>

                {/* Toggle */}
                <div className="targetsave-autosave-toggle">
                  <div>
                    <strong style={{ fontSize: 14, color: "#1E252F" }}>Enable Auto-Save</strong>
                    <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                      Automatically save on a schedule
                    </p>
                  </div>
                  <div className="form-check form-switch form-switch-lg">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={form.enableAutoSave}
                      onChange={(e) => updateField("enableAutoSave", e.target.checked)}
                    />
                  </div>
                </div>

                {form.enableAutoSave && (
                  <>
                    <div className="pv-form-group mb-3">
                      <label className="pv-form-label">
                        Amount per contribution <span className="required">*</span>
                      </label>
                      <div className="targetsave-amount-input">
                        <span className="amount-prefix">
                          <FontAwesomeIcon icon={faNairaSign} />
                        </span>
                        <input
                          className={`form-control ${errors.contributionAmount ? "is-invalid" : ""}`}
                          type="number"
                          placeholder="e.g. 50,000"
                          value={form.contributionAmount}
                          onChange={(e) => updateField("contributionAmount", e.target.value)}
                          min={100}
                        />
                      </div>
                      {errors.contributionAmount && (
                        <div className="pv-form-error">{errors.contributionAmount}</div>
                      )}
                      <div className="targetsave-amount-hints">
                        {[5000, 10000, 50000, 100000, 500000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            className={`targetsave-amount-hint ${Number(form.contributionAmount) === amt ? "active" : ""}`}
                            onClick={() => updateField("contributionAmount", String(amt))}
                          >
                            {formatNaira(amt, false)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pv-form-group mb-3">
                      <label className="pv-form-label">Frequency</label>
                      <div className="d-flex gap-2">
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`targetsave-filter-pill ${form.frequency === opt.value ? "active" : ""}`}
                            onClick={() => updateField("frequency", opt.value as SavingsFrequency)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time-to-target estimate */}
                    {getTimeToTarget() && (
                      <div className="targetsave-time-estimate">
                        <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                        At {formatNaira(Number(form.contributionAmount), false)}/{form.frequency},
                        you&apos;ll reach your target in approximately <strong>{getTimeToTarget()}</strong>
                      </div>
                    )}
                  </>
                )}

                {!form.enableAutoSave && (
                  <div className="targetsave-callout info">
                    <strong>Manual savings mode.</strong> You can add funds to this goal anytime using the &ldquo;Add Funds&rdquo; button.
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Funding Source */}
            {step === 3 && (
              <div>
                <h6 className="targetsave-step-title">Funding source</h6>
                <p className="targetsave-step-subtitle">
                  Choose where contributions will be debited from. Optionally make an initial deposit.
                </p>

                <div className="targetsave-funding-options mb-4">
                  <label className="targetsave-funding-option selected">
                    <input type="radio" checked readOnly />
                    <div className="targetsave-funding-info">
                      <strong>
                        <FontAwesomeIcon icon={faWallet} className="me-2" />
                        Real Wallet
                      </strong>
                      <span>
                        Balance: {formatNaira(wallet?.realBalance ?? 0, false)}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pv-form-group">
                  <label className="pv-form-label">Initial Deposit (optional)</label>
                  <div className="targetsave-amount-input">
                    <span className="amount-prefix">
                      <FontAwesomeIcon icon={faNairaSign} />
                    </span>
                    <input
                      className={`form-control ${errors.initialDeposit ? "is-invalid" : ""}`}
                      type="number"
                      placeholder="0"
                      value={form.initialDeposit}
                      onChange={(e) => updateField("initialDeposit", e.target.value)}
                      min={0}
                    />
                  </div>
                  {errors.initialDeposit && (
                    <div className="pv-form-error">{errors.initialDeposit}</div>
                  )}
                  <p style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>
                    Make an initial deposit to kickstart your goal. This is optional.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {step === 4 && (
              <div>
                <h6 className="targetsave-step-title">Review your TargetSave goal</h6>
                <p className="targetsave-step-subtitle">
                  Make sure everything looks right before creating your goal.
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

                <div className="targetsave-review-card">
                  <div className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <div className="targetsave-modal-icon">
                      <FontAwesomeIcon icon={faBullseye} />
                    </div>
                    <div>
                      <h6 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#1E252F" }}>{form.name}</h6>
                      {form.description && (
                        <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>{form.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="targetsave-review-row">
                    <span>Target Amount</span>
                    <strong>{formatNaira(Number(form.targetAmount), false)}</strong>
                  </div>
                  <div className="targetsave-review-row">
                    <span>Target Date</span>
                    <strong>{form.targetDate}</strong>
                  </div>
                  <div className="targetsave-review-row">
                    <span>Auto-Save</span>
                    <strong>
                      {form.enableAutoSave
                        ? `${formatNaira(Number(form.contributionAmount), false)} / ${form.frequency}`
                        : "Manual"}
                    </strong>
                  </div>
                  {getTimeToTarget() && (
                    <div className="targetsave-review-row">
                      <span>Est. Completion</span>
                      <strong style={{ color: "#8B5CF6" }}>{getTimeToTarget()}</strong>
                    </div>
                  )}
                  {Number(form.initialDeposit) > 0 && (
                    <div className="targetsave-review-row">
                      <span>Initial Deposit</span>
                      <strong>{formatNaira(Number(form.initialDeposit), false)}</strong>
                    </div>
                  )}
                  <div className="targetsave-review-row">
                    <span>Funding Source</span>
                    <strong>Real Wallet</strong>
                  </div>
                </div>

                <div className="targetsave-callout info">
                  You can add funds to your goal anytime and withdraw once you reach your target.
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="targetsave-modal-footer d-flex">
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
                className="quick-action-btn primary targetsave-add-funds-btn"
                onClick={goNext}
              >
                Continue <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                type="button"
                className="quick-action-btn primary targetsave-add-funds-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isSubmitting ? "Creating..." : "Create Goal"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
