export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Admin Dashboard</h2>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Users", value: "1,250", color: "#0EA5E9" },
          { label: "Total Vendors", value: "48", color: "#059669" },
          { label: "Platform Volume", value: "\u20A6850M", color: "#EB5310" },
          { label: "Active Groups", value: "32", color: "#7C3AED" },
        ].map((s) => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="card p-3"><p className="mb-1" style={{ fontSize: 13, color: "#64748B" }}>{s.label}</p><p className="mb-0 fw-bold" style={{ fontSize: 24, color: s.color }}>{s.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
