"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: IconDefinition;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  error,
  required,
  value,
  onChange,
  disabled,
  className,
  autoComplete,
}: FormInputProps) {
  const inputElement = (
    <input
      className={cn("pv-form-input", error && "error")}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
    />
  );

  return (
    <div className={cn("pv-form-group", className)}>
      <label className="pv-form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      {icon ? (
        <div className="pv-input-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="input-icon" />
          {inputElement}
        </div>
      ) : (
        inputElement
      )}

      {error && (
        <div className="pv-form-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}
    </div>
  );
}
