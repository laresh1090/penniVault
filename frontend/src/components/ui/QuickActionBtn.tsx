"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";

interface QuickActionBtnProps {
  variant?: "primary" | "secondary" | "outline";
  icon?: IconDefinition;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function QuickActionBtn({
  variant = "primary",
  icon,
  children,
  href,
  onClick,
  className,
}: QuickActionBtnProps) {
  const classes = cn("quick-action-btn", variant, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}
