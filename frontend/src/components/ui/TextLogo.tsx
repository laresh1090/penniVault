import Link from "next/link";
import { cn } from "@/lib/utils";

interface TextLogoProps {
  variant?: "dark" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function TextLogo({
  variant = "dark",
  size = "md",
  className,
}: TextLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "pv-text-logo",
        `pv-text-logo--${size}`,
        variant === "white" && "pv-text-logo--white",
        className
      )}
    >
      <span className="pv-text-logo-penni">Penni</span>
      <span className="pv-text-logo-vault">Vault</span>
    </Link>
  );
}
