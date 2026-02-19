import type { Metadata } from "next";
export const metadata: Metadata = { title: "About Us" };
export default function AboutPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">About PenniVault</h1>
      <p className="lead" style={{ color: "#64748B" }}>Building a Culture of Intentional Savings and Structured Asset Acquisition in Africa.</p>
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card h-100 p-4">
            <h4 style={{ color: "#EB5310" }}>Our Mission</h4>
            <p className="mb-0" style={{ color: "#64748B" }}>Empowering every Nigerian to save intentionally and build lasting wealth through structured asset acquisition.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 p-4">
            <h4 style={{ color: "#EB5310" }}>Our Vision</h4>
            <p className="mb-0" style={{ color: "#64748B" }}>To become Africa&apos;s leading asset acquisition and savings platform for high-ticket purchases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
