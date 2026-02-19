import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "pending" | "completed" | "overdue" | "paused" | "draft";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={cn("status-badge", status, className)}>
      {label}
    </span>
  );
}
