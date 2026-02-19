"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount?: number;
}

type Step = "form" | "pin" | "loading" | "success";

const BANK_ACCOUNTS = [
  { id: "first-bank", label: "First Bank", account: "****4521" },
  { id: "gtbank", label: "GTBank", account: "****7890" },
];

export default function WithdrawModal({
  isOpen,
  onClose,
  maxAmount = 1250000,
}: WithdrawModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<{
    amount?: string;
    bank?: string;
    pin?: string;
  }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = useCallback(() => {
    setStep("form");
    setAmount("");
    setBankAccount("");
    setPin("");
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === bankAccount);

  const validateForm = (): boolean => {
    const newErrors: { amount?: string; bank?: string } = {};

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    } else if (numericAmount > maxAmount) {
      newErrors.amount = `Amount cannot exceed ${formatNaira(maxAmount)}`;
    }

    if (!bankAccount) {
      newErrors.bank = "Please select a bank account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePin = (): boolean => {
    const newErrors: { pin?: string } = {};

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      newErrors.pin = "Please enter a valid 4-digit PIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateForm()) {
      setStep("pin");
    }
  };

  const handleConfirm = async () => {
    if (!validatePin()) return;
    setStep("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(raw);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(raw);
    if (errors.pin) {
      setErrors((prev) => ({ ...prev, pin: undefined }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="pv-modal-backdrop" onClick={handleBackdropClick}>
      <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pv-modal-header">
          <h3>
            {step === "success" ? "Withdrawal Successful" : "Withdraw Funds"}
          </h3>
          <button
            type="button"
            className="pv-modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="pv-modal-body">
          {step === "form" && (
            <>
              <div className="pv-form-group">
                <label htmlFor="withdraw-amount" className="pv-form-label">
                  Amount (NGN)
                </label>
                <div className="pv-input-wrapper">
                  <span className="pv-input-prefix">&#x20A6;</span>
                  <input
                    id="withdraw-amount"
                    type="text"
                    className={cn(
                      "form-control pv-input-with-prefix",
                      errors.amount && "is-invalid"
                    )}
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    inputMode="decimal"
                  />
                </div>
                {errors.amount && (
                  <div className="pv-form-error">{errors.amount}</div>
                )}
                <div className="pv-form-hint">
                  Available balance: {formatNaira(maxAmount)}
                </div>
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label">Bank Account</label>
                <div className="pv-radio-group">
                  {BANK_ACCOUNTS.map((bank) => (
                    <label
                      key={bank.id}
                      className={cn(
                        "pv-radio-option",
                        bankAccount === bank.id && "selected"
                      )}
                    >
                      <input
                        type="radio"
                        name="bankAccount"
                        value={bank.id}
                        checked={bankAccount === bank.id}
                        onChange={(e) => {
                          setBankAccount(e.target.value);
                          if (errors.bank) {
                            setErrors((prev) => ({ ...prev, bank: undefined }));
                          }
                        }}
                      />
                      <span className="pv-radio-label">
                        <strong>{bank.label}</strong>
                        <span className="pv-radio-detail">{bank.account}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.bank && (
                  <div className="pv-form-error">{errors.bank}</div>
                )}
              </div>
            </>
          )}

          {step === "pin" && (
            <div className="pv-pin-section">
              <div className="pv-confirm-summary">
                <h4>Withdrawal Summary</h4>
                <div className="pv-summary-rows">
                  <div className="pv-summary-row">
                    <span>Amount</span>
                    <strong>{formatNaira(numericAmount)}</strong>
                  </div>
                  <div className="pv-summary-row">
                    <span>Bank Account</span>
                    <strong>
                      {selectedBank?.label} {selectedBank?.account}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pv-form-group">
                <label htmlFor="withdraw-pin" className="pv-form-label">
                  Enter 4-digit PIN
                </label>
                <input
                  id="withdraw-pin"
                  type="password"
                  className={cn(
                    "form-control pv-pin-input",
                    errors.pin && "is-invalid"
                  )}
                  placeholder="****"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="off"
                />
                {errors.pin && (
                  <div className="pv-form-error">{errors.pin}</div>
                )}
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="pv-loading-state">
              <FontAwesomeIcon icon={faSpinner} spin className="pv-loading-icon" />
              <p>Processing your withdrawal...</p>
            </div>
          )}

          {step === "success" && (
            <div className="pv-success-state">
              <FontAwesomeIcon icon={faCheckCircle} className="pv-success-icon" />
              <h4>Withdrawal Successful!</h4>
              <p>
                {formatNaira(numericAmount)} is being sent to your{" "}
                {selectedBank?.label} account {selectedBank?.account}. You should
                receive it within a few minutes.
              </p>
            </div>
          )}
        </div>

        <div className="pv-modal-footer">
          {step === "form" && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleProceed}
              >
                Continue
              </button>
            </>
          )}

          {step === "pin" && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setPin("");
                  setErrors({});
                  setStep("form");
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
              >
                Confirm Withdrawal
              </button>
            </>
          )}

          {step === "success" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
