import type { Metadata } from "next";
import BrandPanel from "@/components/auth/BrandPanel";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pv-auth-page">
      <BrandPanel />
      <div className="pv-auth-mobile-brand">
        <div className="mobile-brand-logo">
          Penni<span style={{ color: "#FAA019" }}>Vault</span>
        </div>
        <div className="mobile-brand-tagline">
          Your money. Your goals. Your vault.
        </div>
      </div>
      <div className="pv-auth-form-panel">
        <div className="pv-auth-form-container">
          {children}
        </div>
      </div>
    </div>
  );
}
