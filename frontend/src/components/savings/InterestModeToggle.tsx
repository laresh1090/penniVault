// frontend/src/components/savings/InterestModeToggle.tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faCalendarCheck,
  faLock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";

interface InterestModeToggleProps {
  value: "upfront" | "maturity";
  onChange: (mode: "upfront" | "maturity") => void;
  projectedInterest: number;
  durationDays: number;
}

export default function InterestModeToggle({
  value,
  onChange,
  projectedInterest,
  durationDays,
}: InterestModeToggleProps) {
  return (
    <div className="pennilock-interest-mode-toggle">
      {/* Upfront Option */}
      <button
        type="button"
        className={`pennilock-mode-option ${value === "upfront" ? "active" : ""}`}
        onClick={() => onChange("upfront")}
      >
        <div className="pennilock-mode-option-header">
          <FontAwesomeIcon icon={faBoltLightning} className="pennilock-mode-icon" />
          <strong>Upfront</strong>
        </div>
        <p className="pennilock-mode-option-desc">
          Receive <strong>{formatNaira(projectedInterest, false)}</strong> in
          your wallet <strong>immediately</strong> when you lock.
        </p>
        <div className="pennilock-mode-callout upfront">
          <FontAwesomeIcon icon={faLock} className="me-2" />
          <span>
            Lock <strong>cannot be broken</strong> before maturity.
            Your funds are locked for the full {durationDays} days.
          </span>
        </div>
      </button>

      {/* At Maturity Option */}
      <button
        type="button"
        className={`pennilock-mode-option ${value === "maturity" ? "active" : ""}`}
        onClick={() => onChange("maturity")}
      >
        <div className="pennilock-mode-option-header">
          <FontAwesomeIcon icon={faCalendarCheck} className="pennilock-mode-icon" />
          <strong>At Maturity</strong>
        </div>
        <p className="pennilock-mode-option-desc">
          Receive <strong>{formatNaira(projectedInterest, false)}</strong> when
          your lock matures on day {durationDays}.
        </p>
        <div className="pennilock-mode-callout maturity">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          <span>
            Lock <strong>can be broken</strong> after 30 days, but you forfeit
            all interest + 5% penalty on principal.
          </span>
        </div>
      </button>
    </div>
  );
}
