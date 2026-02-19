"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEye,
  faEyeSlash,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrength?: boolean;
  className?: string;
  autoComplete?: string;
}

function getPasswordStrength(value: string): {
  level: "weak" | "medium" | "strong";
  label: string;
} {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;

  if (score <= 1) return { level: "weak", label: "Weak" };
  if (score === 2) return { level: "medium", label: "Medium" };
  return { level: "strong", label: "Strong" };
}

export default function PasswordInput({
  label,
  name,
  placeholder,
  error,
  required,
  value,
  onChange,
  showStrength,
  className,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const strength = value ? getPasswordStrength(value) : null;

  return (
    <div className={cn("pv-form-group", className)}>
      <label className="pv-form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <div className="pv-input-icon-wrapper">
        <FontAwesomeIcon icon={faLock} className="input-icon" />
        <div className="pv-password-wrapper">
          <input
            className={cn("pv-form-input", error && "error")}
            name={name}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible((prev) => !prev)}
          >
            <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      {error && (
        <div className="pv-form-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}

      {showStrength && value && strength && (
        <div className="password-strength">
          <div className="strength-bar">
            <div className={cn("strength-fill", strength.level)} />
          </div>
          <span className={cn("strength-text", strength.level)}>
            {strength.label}
          </span>
        </div>
      )}
    </div>
  );
}
