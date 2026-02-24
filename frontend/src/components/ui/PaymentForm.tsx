"use client";

import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";
import { formatNaira } from "@/lib/formatters";

// ── Types ──

export interface CardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

interface PaymentFormProps {
  amount: number;
  onSubmit: (card: CardDetails) => Promise<void>;
  isProcessing?: boolean;
  submitLabel?: string;
}

// ── Helpers ──

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function detectCardType(number: string): string {
  const d = number.replace(/\s/g, "");
  if (d.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (d.startsWith("5060") || d.startsWith("6500") || d.startsWith("62")) return "verve";
  return "unknown";
}

const CARD_ICONS: Record<string, typeof faCcVisa> = {
  visa: faCcVisa,
  mastercard: faCcMastercard,
  amex: faCcAmex,
};

// ── Component ──

export default function PaymentForm({
  amount,
  onSubmit,
  isProcessing = false,
  submitLabel = "Pay Now",
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardType = detectCardType(cardNumber);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const rawNumber = cardNumber.replace(/\s/g, "");

    if (rawNumber.length < 13 || rawNumber.length > 16) {
      errs.cardNumber = "Enter a valid card number";
    }
    if (!cardholderName.trim()) {
      errs.cardholderName = "Enter the cardholder name";
    }

    const expiryParts = expiry.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      errs.expiry = "Enter a valid expiry (MM/YY)";
    } else {
      const month = parseInt(expiryParts[0], 10);
      const year = 2000 + parseInt(expiryParts[1], 10);
      const now = new Date();
      if (month < 1 || month > 12) {
        errs.expiry = "Invalid month";
      } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        errs.expiry = "Card has expired";
      }
    }

    if (cvv.length < 3 || cvv.length > 4) {
      errs.cvv = "Enter a valid CVV";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const expiryParts = expiry.split("/");
      const card: CardDetails = {
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiryMonth: expiryParts[0],
        expiryYear: `20${expiryParts[1]}`,
        cvv,
        cardholderName: cardholderName.toUpperCase(),
      };

      await onSubmit(card);
    },
    [cardNumber, expiry, cvv, cardholderName, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Amount display */}
      <div
        style={{
          textAlign: "center",
          padding: "16px",
          background: "#F8FAFC",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#64748B" }}>Amount to pay</span>
        <p style={{ fontSize: "28px", fontWeight: 800, color: "#1E252F", margin: 0 }}>
          {formatNaira(amount, false)}
        </p>
      </div>

      {/* Card Number */}
      <div className="mb-3">
        <label
          className="form-label"
          style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}
        >
          Card Number
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
            placeholder="0000 0000 0000 0000"
            value={formatCardNumber(cardNumber)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
            disabled={isProcessing}
          />
          {cardType !== "unknown" && CARD_ICONS[cardType] && (
            <FontAwesomeIcon
              icon={CARD_ICONS[cardType]}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "24px",
                color: "#94A3B8",
              }}
            />
          )}
          {errors.cardNumber && (
            <div className="invalid-feedback">{errors.cardNumber}</div>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="mb-3">
        <label
          className="form-label"
          style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}
        >
          Cardholder Name
        </label>
        <input
          type="text"
          className={`form-control ${errors.cardholderName ? "is-invalid" : ""}`}
          placeholder="ADEBAYO JOHNSON"
          value={cardholderName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCardholderName(e.target.value.toUpperCase())
          }
          autoComplete="cc-name"
          disabled={isProcessing}
        />
        {errors.cardholderName && (
          <div className="invalid-feedback">{errors.cardholderName}</div>
        )}
      </div>

      {/* Expiry + CVV row */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label
            className="form-label"
            style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}
          >
            Expiry Date
          </label>
          <input
            type="text"
            className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
            placeholder="MM/YY"
            value={expiry}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
              setExpiry(formatExpiry(raw));
            }}
            maxLength={5}
            inputMode="numeric"
            autoComplete="cc-exp"
            disabled={isProcessing}
          />
          {errors.expiry && (
            <div className="invalid-feedback">{errors.expiry}</div>
          )}
        </div>
        <div className="col-6">
          <label
            className="form-label"
            style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}
          >
            CVV
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
              placeholder="***"
              value={cvv}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
              inputMode="numeric"
              autoComplete="cc-csc"
              disabled={isProcessing}
            />
            {errors.cvv && (
              <div className="invalid-feedback">{errors.cvv}</div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn w-100"
        style={{
          background: "#EB5310",
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: "15px",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
        }}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
            Processing...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faLock} className="me-2" />
            {submitLabel} {formatNaira(amount, false)}
          </>
        )}
      </button>

      {/* Security notice */}
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#94A3B8",
          marginTop: "12px",
        }}
      >
        <FontAwesomeIcon icon={faLock} className="me-1" />
        Your payment information is secured with 256-bit encryption
      </p>
    </form>
  );
}
