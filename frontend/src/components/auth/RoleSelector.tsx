"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value?: string;
  onChange?: (role: string) => void;
  error?: string;
  className?: string;
}

const roles = [
  {
    id: "user",
    icon: faUser,
    title: "Save & Invest",
    description: "I want to save towards goals like property, cars, or general savings.",
  },
  {
    id: "vendor",
    icon: faBuilding,
    title: "Sell on PenniVault",
    description: "I want to list property, vehicles, or other products for buyers.",
  },
];

export default function RoleSelector({ value, onChange, error, className }: RoleSelectorProps) {
  return (
    <div className={cn("pv-role-selector", className)} style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
      {roles.map((role) => (
        <div
          key={role.id}
          className={cn("role-option", value === role.id && "selected")}
          onClick={() => onChange?.(role.id)}
          role="radio"
          aria-checked={value === role.id}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onChange?.(role.id);
            }
          }}
        >
          <div className="role-icon">
            <FontAwesomeIcon icon={role.icon} />
          </div>
          <div className="role-title">{role.title}</div>
          <div className="role-desc">{role.description}</div>
        </div>
      ))}
      {error && <div className="pv-form-error" style={{ gridColumn: "1 / -1", marginTop: "8px" }}>{error}</div>}
    </div>
  );
}
