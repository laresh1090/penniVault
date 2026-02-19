"use client";

import { cn } from "@/lib/utils";

interface AlertItemProps {
  priority: "high" | "medium" | "low";
  text: string;
  time: string;
  onInvestigate?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function AlertItem({
  priority,
  text,
  time,
  onInvestigate,
  onDismiss,
  className,
}: AlertItemProps) {
  return (
    <div className={cn("alert-item", priority, className)}>
      <div className="alert-content">
        <div className="alert-priority">{priority.toUpperCase()}</div>
        <div className="alert-text">{text}</div>
        <div className="alert-time">{time}</div>
      </div>
      <div className="alert-actions">
        <button type="button" className="primary" onClick={onInvestigate}>
          Investigate
        </button>
        <button type="button" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
