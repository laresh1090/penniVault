import "@/styles/template/style.css";
import "@/styles/template/auth.css";
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
        <div className="pv-auth-mobile-brand-inner">
          <h3 className="pv-auth-brand-logo-text">
            Penni<span>Vault</span>
          </h3>
          <p className="pv-auth-brand-tagline">
            Your money. Your goals. Your vault.
          </p>
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
