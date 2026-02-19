import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  variant?: "primary" | "success" | "warning";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  variant = "primary",
  showLabel,
  label,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn("savings-progress", className)}>
      <div className="progress-bar-wrapper">
        <div
          className={cn("progress-bar-fill", variant)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
    </div>
  );
}
