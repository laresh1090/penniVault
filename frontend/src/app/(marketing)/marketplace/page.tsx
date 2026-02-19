import type { Metadata } from "next";
export const metadata: Metadata = { title: "Marketplace" };
export default function MarketplacePage() {
  return (
    <div className="container py-5">
      <h1 className="mb-2">Marketplace</h1>
      <p className="lead mb-5" style={{ color: "#64748B" }}>Browse verified property, automotive, and lifestyle listings.</p>
      <div className="row g-4">
        {[
          { title: "3 Bed Apartment, Lekki", price: "\u20A645,000,000", cat: "Property" },
          { title: "Toyota Camry 2024 XSE", price: "\u20A618,500,000", cat: "Automotive" },
          { title: "500sqm Land, Ajah", price: "\u20A625,000,000", cat: "Property" },
          { title: "4 Bed Duplex, Ikoyi", price: "\u20A6120,000,000", cat: "Property" },
        ].map((item) => (
          <div key={item.title} className="col-md-6 col-lg-3">
            <div className="card h-100">
              <div style={{ height: 180, background: "#F1F5F9" }} />
              <div className="card-body">
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2">{item.cat}</span>
                <h6 className="card-title mb-1">{item.title}</h6>
                <p className="fw-bold mb-0" style={{ color: "#EB5310" }}>{item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
