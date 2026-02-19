"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

export default function FormSelect({
  label,
  name,
  options,
  placeholder,
  error,
  required,
  value,
  onChange,
  disabled,
  className,
}: FormSelectProps) {
  return (
    <div className={cn("pv-form-group", className)}>
      <label className="pv-form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <select
        className={cn("pv-form-input", error && "error")}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="pv-form-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}
    </div>
  );
}
