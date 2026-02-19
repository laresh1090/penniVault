import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/formatters";

interface WalletCardProps {
  variant: "real-wallet" | "virtual-wallet" | "total-savings" | "monthly-rate";
  icon: IconDefinition;
  label: string;
  amount: number;
  actionLabel?: string;
  actionHref?: string;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}

export default function WalletCard({
  variant,
  icon,
  label,
  amount,
  actionLabel,
  actionHref,
  trend,
  className,
}: WalletCardProps) {
  return (
    <div className={cn("wallet-card", variant, className)}>
      <div className="wallet-card-top">
        <div className="wallet-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="wallet-card-action">
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="wallet-label">{label}</div>
      <div className="wallet-amount">{formatNaira(amount)}</div>
      {trend && (
        <div className={cn("wallet-trend", trend.direction)}>
          <FontAwesomeIcon
            icon={trend.direction === "up" ? faArrowUp : faArrowDown}
          />
          {trend.value}
        </div>
      )}
    </div>
  );
}
