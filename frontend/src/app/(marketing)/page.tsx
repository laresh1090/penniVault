import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PenniVault \u2014 Asset Acquisition Infrastructure",
  description: "PenniVault helps partner brands digitize and manage high-ticket asset acquisition.",
};

export default function HomePage() {
  return (
    <section className="py-5" style={{ background: "linear-gradient(135deg, #1E252F 0%, #2d3748 100%)", minHeight: "60vh" }}>
      <div className="container text-center text-white py-5">
        <p className="text-uppercase mb-3" style={{ letterSpacing: "2px", fontSize: "14px", color: "#EB5310" }}>
          Asset Acquisition Infrastructure
        </p>
        <h1 className="display-4 fw-bold mb-3">
          Save Smarter. <span style={{ color: "#EB5310" }}>Grow Faster.</span> Live Better.
        </h1>
        <p className="lead mx-auto mb-4" style={{ maxWidth: 600, color: "rgba(255,255,255,0.7)" }}>
          PenniVault helps you build disciplined savings habits with goal-based plans, group savings, and a vendor marketplace.
        </p>
        <a href="/register" className="btn btn-primary btn-lg px-5">Get Started</a>
      </div>
    </section>
  );
}
