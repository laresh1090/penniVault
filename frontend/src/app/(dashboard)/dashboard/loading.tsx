export default function DashboardLoading() {
  return (
    <div aria-label="Loading dashboard">
      {/* Balance card skeleton */}
      <div
        className="skeleton-bone"
        style={{ height: 200, borderRadius: 16, marginBottom: 24 }}
      />

      {/* Section title skeleton */}
      <div
        className="skeleton-bone"
        style={{ width: 180, height: 20, borderRadius: 6, marginBottom: 16 }}
      />

      {/* Product grid skeleton (2x2) */}
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-6">
            <div
              className="skeleton-bone"
              style={{ height: 150, borderRadius: 14 }}
            />
          </div>
        ))}
      </div>

      {/* Investments section skeleton */}
      <div
        className="skeleton-bone"
        style={{ height: 20, width: 160, borderRadius: 6, marginBottom: 16 }}
      />
      <div className="row g-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div
              className="skeleton-bone"
              style={{ height: 360, borderRadius: 14 }}
            />
          </div>
        ))}
      </div>

      {/* Transactions section skeleton */}
      <div
        className="skeleton-bone"
        style={{ borderRadius: 12, padding: 24, height: 320 }}
      />
    </div>
  );
}
