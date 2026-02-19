"use client";

import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  label: React.ReactNode;
  name: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  className,
}: FormCheckboxProps) {
  return (
    <label className={cn("pv-checkbox-wrapper", className)}>
      <input
        className="pv-checkbox"
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="pv-checkbox-visual">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <polyline
            points="20 6 9 17 4 12"
            stroke="currentColor"
            fill="none"
            strokeWidth="3"
          />
        </svg>
      </span>
      <span className="pv-checkbox-label">{label}</span>
    </label>
  );
}
