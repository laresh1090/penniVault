"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface AuthAlertProps {
  type: "error" | "success" | "warning";
  message: string;
  onClose?: () => void;
  className?: string;
}

const iconMap = {
  error: faExclamationCircle,
  success: faCheckCircle,
  warning: faExclamationTriangle,
} as const;

export default function AuthAlert({
  type,
  message,
  onClose,
  className,
}: AuthAlertProps) {
  return (
    <div className={cn("pv-auth-alert", type, className)}>
      <FontAwesomeIcon icon={iconMap[type]} />
      <span>{message}</span>
      {onClose && (
        <span className="pv-auth-alert-close" onClick={onClose} role="button">
          &times;
        </span>
      )}
    </div>
  );
}
