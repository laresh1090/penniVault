export default function VendorDashboardPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Vendor Dashboard</h2>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Listings", value: "8", color: "#0EA5E9" },
          { label: "Active Orders", value: "3", color: "#059669" },
          { label: "Total Revenue", value: "\u20A612.5M", color: "#EB5310" },
          { label: "Active Savers", value: "45", color: "#7C3AED" },
        ].map((s) => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card p-3"><p className="mb-1" style={{ fontSize: 13, color: "#64748B" }}>{s.label}</p><p className="mb-0 fw-bold" style={{ fontSize: 24, color: s.color }}>{s.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
