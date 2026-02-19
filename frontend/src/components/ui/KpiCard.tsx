import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  trend?: { value: string; direction: "up" | "down" };
  variant?: "centered" | "horizontal";
  className?: string;
}

export default function KpiCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  trend,
  variant = "centered",
  className,
}: KpiCardProps) {
  if (variant === "horizontal") {
    return (
      <div className={cn("admin-stat-card", className)}>
        <div
          className="stat-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="stat-content">
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
          {trend && (
            <div className={cn("stat-trend", trend.direction)}>
              <FontAwesomeIcon
                icon={trend.direction === "up" ? faArrowUp : faArrowDown}
              />
              {trend.value}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("kpi-card", className)}>
      <div
        className="kpi-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {trend && (
        <div className={cn("kpi-trend", trend.direction)}>
          <FontAwesomeIcon
            icon={trend.direction === "up" ? faArrowUp : faArrowDown}
          />
          {trend.value}
        </div>
      )}
    </div>
  );
}
