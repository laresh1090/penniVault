import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashCardProps {
  title?: string;
  actionLabel?: string;
  actionHref?: string;
  noPadding?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function DashCard({
  title,
  actionLabel,
  actionHref,
  noPadding,
  children,
  className,
}: DashCardProps) {
  return (
    <div className={cn("dash-card", className)}>
      {title && (
        <div className="dash-card-header">
          <h3>{title}</h3>
          {actionLabel && actionHref && (
            <Link href={actionHref} className="dash-card-action">
              {actionLabel}
            </Link>
          )}
        </div>
      )}
      <div className={cn("dash-card-body", noPadding && "no-padding")}>
        {children}
      </div>
    </div>
  );
}
