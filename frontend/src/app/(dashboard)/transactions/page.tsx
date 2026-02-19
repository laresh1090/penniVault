export default function TransactionsPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Transactions</h2>
      <div className="card p-4">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <select className="form-select form-select-sm" style={{ width: "auto" }}><option>All Types</option><option>Deposits</option><option>Withdrawals</option><option>Savings</option></select>
          <input type="date" className="form-control form-control-sm" style={{ width: "auto" }} />
          <input type="date" className="form-control form-control-sm" style={{ width: "auto" }} />
        </div>
        <table className="table table-hover">
          <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Balance</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Feb 6</td><td>Deposit to Real Wallet</td><td>Deposit</td><td className="text-success">+{"\u20A6"}200,000</td><td>{"\u20A6"}1,250,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
            <tr><td>Feb 5</td><td>HomeOwners Circle</td><td>Group</td><td className="text-danger">-{"\u20A6"}125,000</td><td>{"\u20A6"}1,050,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
            <tr><td>Feb 1</td><td>Dream Home Fund</td><td>Savings</td><td className="text-danger">-{"\u20A6"}50,000</td><td>{"\u20A6"}1,000,000</td><td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
