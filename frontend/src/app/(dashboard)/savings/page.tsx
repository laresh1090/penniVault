export default function SavingsPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Savings Plans</h2>
      <div className="row g-4">
        {[
          { name: "Dream Home Fund", target: "\u20A615,000,000", current: "\u20A64,850,000", pct: 32, status: "Active" },
          { name: "Car Savings", target: "\u20A618,500,000", current: "\u20A65,200,000", pct: 28, status: "Active" },
          { name: "Emergency Fund", target: "\u20A63,000,000", current: "\u20A62,100,000", pct: 70, status: "Active" },
          { name: "Business Capital", target: "\u20A65,000,000", current: "\u20A65,000,000", pct: 100, status: "Completed" },
        ].map((plan) => (
          <div key={plan.name} className="col-md-6">
            <div className="card p-4 h-100">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="mb-0">{plan.name}</h6>
                <span className={`badge ${plan.status === "Active" ? "bg-success" : "bg-secondary"} bg-opacity-10 ${plan.status === "Active" ? "text-success" : "text-secondary"}`}>{plan.status}</span>
              </div>
              <p className="mb-2" style={{ fontSize: 13, color: "#64748B" }}>{plan.current} of {plan.target}</p>
              <div className="progress mb-2" style={{ height: 8 }}>
                <div className="progress-bar" style={{ width: `${plan.pct}%`, background: "#EB5310" }} />
              </div>
              <p className="mb-0 text-end" style={{ fontSize: 12, color: "#64748B" }}>{plan.pct}% complete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
