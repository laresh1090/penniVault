import Link from "next/link";

export default function CTASection() {
  return (
    <section className="pv-cta-section">
      <div className="container text-center">
        <span className="pv-section-subtitle" style={{ color: "white", opacity: 0.9 }}>
          Ready to Start Saving?
        </span>
        <h2 style={{ color: "white" }}>
          Join 10,000+ Nigerians Building Their Financial Future with PenniVault
        </h2>
        <Link href="/register" className="ul-btn ul-btn-white mt-3">
          Create Free Account
        </Link>
      </div>
    </section>
  );
}
