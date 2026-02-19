"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStore, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value?: string;
  onChange?: (role: string) => void;
  className?: string;
}

const roles = [
  {
    value: "user",
    icon: faUser,
    title: "Individual",
    description: "Save towards your dream assets",
  },
  {
    value: "vendor",
    icon: faStore,
    title: "Vendor",
    description: "List and sell assets on PenniVault",
  },
  {
    value: "agent",
    icon: faUserTie,
    title: "Agent",
    description: "Manage referrals and earn commissions",
  },
] as const;

export default function RoleSelector({
  value,
  onChange,
  className,
}: RoleSelectorProps) {
  return (
    <div className={cn("pv-role-selector", className)}>
      {roles.map((role) => (
        <div
          key={role.value}
          className={cn("role-option", value === role.value && "selected")}
          onClick={() => onChange?.(role.value)}
        >
          <FontAwesomeIcon icon={role.icon} />
          <strong>{role.title}</strong>
          <span>{role.description}</span>
        </div>
      ))}
    </div>
  );
}
