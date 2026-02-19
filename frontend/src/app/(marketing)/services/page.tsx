import type { Metadata } from "next";
export const metadata: Metadata = { title: "Services" };
export default function ServicesPage() {
  const services = [
    { title: "Installment Management", desc: "Digitize and structure asset installment sales with payment milestones and automated reminders." },
    { title: "Asset-Linked Savings", desc: "Allow customers to gradually commit funds toward a specific property or vehicle." },
    { title: "Referral & Commission Engine", desc: "Digitize referral-based sales with tracking, automated commission calculation, and reporting." },
    { title: "Management Intelligence", desc: "Provide leadership visibility into completion forecasts, default rates, and sales performance." },
  ];
  return (
    <div className="container py-5">
      <h1 className="mb-2">Our Services</h1>
      <p className="lead mb-5" style={{ color: "#64748B" }}>Comprehensive tools for structured asset acquisition.</p>
      <div className="row g-4">
        {services.map((s) => (
          <div key={s.title} className="col-md-6">
            <div className="card h-100 p-4">
              <h4 className="mb-3">{s.title}</h4>
              <p className="mb-0" style={{ color: "#64748B" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
