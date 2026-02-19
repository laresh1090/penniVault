export default function UserDashboardPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Welcome back, Adebayo!</h2>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Savings", value: "\u20A64,850,000", color: "#059669", bg: "#ECFDF5" },
          { label: "Active Plans", value: "3", color: "#0EA5E9", bg: "#F0F9FF" },
          { label: "Group Memberships", value: "2", color: "#D97706", bg: "#FFFBEB" },
          { label: "Real Wallet", value: "\u20A61,250,000", color: "#EB5310", bg: "#FFF7ED" },
        ].map((stat) => (
          <div key={stat.label} className="col-md-6 col-xl-3">
            <div className="card p-3">
              <p className="mb-1" style={{ fontSize: 13, color: "#64748B" }}>{stat.label}</p>
              <p className="mb-0 fw-bold" style={{ fontSize: 24, color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h5 className="mb-3">Recent Transactions</h5>
        <table className="table table-hover mb-0">
          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Feb 6, 2026</td><td>Deposit to Real Wallet</td><td className="text-success">+{"\u20A6"}200,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
            <tr><td>Feb 5, 2026</td><td>HomeOwners Circle Contribution</td><td className="text-danger">-{"\u20A6"}125,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
            <tr><td>Feb 1, 2026</td><td>Dream Home Fund - Monthly</td><td className="text-danger">-{"\u20A6"}50,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
