export default function WalletPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>My Wallet</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card text-white p-4" style={{ background: "linear-gradient(135deg, #059669, #047857)", borderRadius: 16 }}>
            <p className="mb-1" style={{ fontSize: 14, opacity: 0.75 }}>Real Wallet</p>
            <p className="mb-3" style={{ fontSize: 36, fontWeight: 800 }}>{"\u20A6"}1,250,000</p>
            <div className="d-flex gap-2">
              <button className="btn btn-light btn-sm fw-bold">Deposit</button>
              <button className="btn btn-outline-light btn-sm fw-bold">Withdraw</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white p-4" style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", borderRadius: 16 }}>
            <p className="mb-1" style={{ fontSize: 14, opacity: 0.75 }}>Virtual Wallet</p>
            <p className="mb-3" style={{ fontSize: 36, fontWeight: 800 }}>{"\u20A6"}450,000</p>
            <p className="mb-0" style={{ fontSize: 13, opacity: 0.8 }}>Converts when group savings turn is received</p>
          </div>
        </div>
      </div>
      <div className="card p-4">
        <h5 className="mb-3">Transaction History</h5>
        <table className="table table-hover mb-0">
          <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Feb 6, 2026</td><td>Deposit to Real Wallet</td><td><span className="badge bg-success bg-opacity-10 text-success">Deposit</span></td><td className="text-success fw-bold">+{"\u20A6"}200,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
            <tr><td>Feb 5, 2026</td><td>HomeOwners Circle</td><td><span className="badge bg-warning bg-opacity-10 text-warning">Savings</span></td><td className="text-danger fw-bold">-{"\u20A6"}125,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
