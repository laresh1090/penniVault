import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatters";

interface SystemAlertItemProps {
  severity: "high" | "medium" | "low";
  message: string;
  timestamp: string;
}

export default function SystemAlertItem({
  severity,
  message,
  timestamp,
}: SystemAlertItemProps) {
  const icon = severity === "high" ? faExclamationTriangle : faInfoCircle;

  return (
    <div className={cn("system-alert-item", severity)}>
      <div className="system-alert-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="system-alert-content">
        <span className="system-alert-message">{message}</span>
        <span className="system-alert-time">{formatRelativeTime(timestamp)}</span>
      </div>
      <span className={cn("system-alert-severity", severity)}>
        {severity.toUpperCase()}
      </span>
    </div>
  );
}
