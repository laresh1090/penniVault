import { cn } from "@/lib/utils";

interface BrandPanelProps {
  className?: string;
}

export default function BrandPanel({ className }: BrandPanelProps) {
  return (
    <div className={cn("pv-auth-brand", className)}>
      <div className="pv-auth-brand-decor" />
      <div className="pv-auth-brand-decor" />
      <div className="pv-auth-brand-decor" />

      <div className="pv-auth-brand-content">
        <div className="brand-logo">
          <span>Penni</span>
          <span className="logo-vault">Vault</span>
        </div>
        <p className="brand-tagline">
          Your money. Your goals. Your vault.
        </p>
        <p className="brand-subtitle">
          PenniVault helps you save smarter, acquire assets faster, and build
          wealth through structured plans and community savings.
        </p>
      </div>

      <div className="pv-auth-brand-accent">
        Powered by Harjota Technologies
      </div>
    </div>
  );
}
