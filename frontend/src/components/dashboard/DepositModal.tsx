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

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "confirm" | "loading" | "success";

const PAYMENT_METHODS = [
  { id: "first-bank", label: "First Bank", account: "****4521" },
  { id: "gtbank", label: "GTBank", account: "****7890" },
];

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; method?: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = useCallback(() => {
    setStep("form");
    setAmount("");
    setPaymentMethod("");
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const validateForm = (): boolean => {
    const newErrors: { amount?: string; method?: string } = {};
    const numericAmount = parseFloat(amount.replace(/,/g, ""));

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (!paymentMethod) {
      newErrors.method = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateForm()) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="pv-modal-backdrop" onClick={handleBackdropClick}>
      <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pv-modal-header">
          <h3>
            {step === "success" ? "Deposit Successful" : "Deposit Funds"}
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
                <label htmlFor="deposit-amount" className="pv-form-label">
                  Amount (NGN)
                </label>
                <div className="pv-input-wrapper">
                  <span className="pv-input-prefix">&#x20A6;</span>
                  <input
                    id="deposit-amount"
                    type="text"
                    className={cn("form-control pv-input-with-prefix", errors.amount && "is-invalid")}
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    inputMode="decimal"
                  />
                </div>
                {errors.amount && (
                  <div className="pv-form-error">{errors.amount}</div>
                )}
                {numericAmount > 0 && (
                  <div className="pv-form-hint">
                    You will deposit {formatNaira(numericAmount)}
                  </div>
                )}
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label">Payment Method</label>
                <div className="pv-radio-group">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "pv-radio-option",
                        paymentMethod === method.id && "selected"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          if (errors.method) {
                            setErrors((prev) => ({ ...prev, method: undefined }));
                          }
                        }}
                      />
                      <span className="pv-radio-label">
                        <strong>{method.label}</strong>
                        <span className="pv-radio-detail">{method.account}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.method && (
                  <div className="pv-form-error">{errors.method}</div>
                )}
              </div>
            </>
          )}

          {step === "confirm" && (
            <div className="pv-confirm-summary">
              <h4>Confirm Deposit</h4>
              <div className="pv-summary-rows">
                <div className="pv-summary-row">
                  <span>Amount</span>
                  <strong>{formatNaira(numericAmount)}</strong>
                </div>
                <div className="pv-summary-row">
                  <span>Payment Method</span>
                  <strong>
                    {selectedMethod?.label} {selectedMethod?.account}
                  </strong>
                </div>
                <div className="pv-summary-row">
                  <span>Destination</span>
                  <strong>Real Wallet</strong>
                </div>
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="pv-loading-state">
              <FontAwesomeIcon icon={faSpinner} spin className="pv-loading-icon" />
              <p>Processing your deposit...</p>
            </div>
          )}

          {step === "success" && (
            <div className="pv-success-state">
              <FontAwesomeIcon icon={faCheckCircle} className="pv-success-icon" />
              <h4>Deposit Successful!</h4>
              <p>
                {formatNaira(numericAmount)} has been deposited to your Real
                Wallet via {selectedMethod?.label} {selectedMethod?.account}.
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

          {step === "confirm" && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setStep("form")}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
              >
                Confirm Deposit
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
