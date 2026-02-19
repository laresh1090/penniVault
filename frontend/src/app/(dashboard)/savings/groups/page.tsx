export default function GroupSavingsPage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Group Savings</h2>
      <div className="row g-4">
        {[
          { name: "HomeOwners Circle", members: "8/10", contribution: "\u20A6125,000/mo", round: "3 of 10" },
          { name: "Auto Buyers Club", members: "6/6", contribution: "\u20A6200,000/mo", round: "2 of 6" },
        ].map((group) => (
          <div key={group.name} className="col-md-6">
            <div className="card p-4 h-100">
              <h5 className="mb-3">{group.name}</h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between"><span style={{ color: "#64748B", fontSize: 14 }}>Members</span><span className="fw-bold" style={{ fontSize: 14 }}>{group.members}</span></div>
                <div className="d-flex justify-content-between"><span style={{ color: "#64748B", fontSize: 14 }}>Contribution</span><span className="fw-bold" style={{ fontSize: 14 }}>{group.contribution}</span></div>
                <div className="d-flex justify-content-between"><span style={{ color: "#64748B", fontSize: 14 }}>Current Round</span><span className="fw-bold" style={{ fontSize: 14 }}>{group.round}</span></div>
              </div>
              <a href={`/savings/groups/grp_001`} className="btn btn-outline-primary btn-sm mt-3 w-100">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
