import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#F8FAFC" }}>
      <div className="container py-5">
        <div className="text-center mb-4">
          <a href="/" className="text-decoration-none">
            <h3 className="pv-text-logo">Penni<span>Vault</span></h3>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
