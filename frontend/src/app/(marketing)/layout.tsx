import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-white border-bottom py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <a href="/" className="text-decoration-none">
            <h3 className="pv-text-logo mb-0">
              Penni<span>Vault</span>
            </h3>
          </a>
          <nav className="d-none d-md-flex gap-4 align-items-center">
            <a href="/" className="text-decoration-none" style={{ color: "#334155", fontWeight: 500 }}>Home</a>
            <a href="/about" className="text-decoration-none" style={{ color: "#334155", fontWeight: 500 }}>About</a>
            <a href="/services" className="text-decoration-none" style={{ color: "#334155", fontWeight: 500 }}>Services</a>
            <a href="/faq" className="text-decoration-none" style={{ color: "#334155", fontWeight: 500 }}>FAQ</a>
            <a href="/contact" className="text-decoration-none" style={{ color: "#334155", fontWeight: 500 }}>Contact</a>
          </nav>
          <div className="d-flex gap-2 align-items-center">
            <a href="/login" className="btn btn-outline-dark btn-sm" style={{ fontWeight: 600 }}>Login</a>
            <a href="/register" className="btn btn-primary btn-sm" style={{ fontWeight: 600 }}>Get Started</a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="pv-text-logo pv-text-logo--white mb-3">Penni<span>Vault</span></h3>
              <p className="text-white-50">PenniVault is Nigeria&apos;s smart asset acquisition platform combining structured savings, group savings, and a vendor marketplace.</p>
            </div>
            <div className="col-lg-2">
              <h6 className="text-uppercase mb-3" style={{ fontSize: "13px", letterSpacing: "1px" }}>Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/about" className="text-white-50 text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="/services" className="text-white-50 text-decoration-none">Services</a></li>
                <li className="mb-2"><a href="/faq" className="text-white-50 text-decoration-none">FAQ</a></li>
                <li className="mb-2"><a href="/contact" className="text-white-50 text-decoration-none">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="text-uppercase mb-3" style={{ fontSize: "13px", letterSpacing: "1px" }}>Services</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/services" className="text-white-50 text-decoration-none">Installment Plans</a></li>
                <li className="mb-2"><a href="/services" className="text-white-50 text-decoration-none">Structured Savings</a></li>
                <li className="mb-2"><a href="/marketplace" className="text-white-50 text-decoration-none">Marketplace</a></li>
                <li className="mb-2"><a href="/services" className="text-white-50 text-decoration-none">Referral System</a></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="text-uppercase mb-3" style={{ fontSize: "13px", letterSpacing: "1px" }}>Contact</h6>
              <ul className="list-unstyled text-white-50">
                <li className="mb-2">42 Marina Road, Victoria Island, Lagos</li>
                <li className="mb-2">hello@pennivault.com</li>
                <li className="mb-2">+234 123 456 7890</li>
              </ul>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <p className="text-white-50 text-center mb-0" style={{ fontSize: "14px" }}>&copy; {new Date().getFullYear()} PenniVault. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
