"use client";

export default function SavingsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-5">
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#EF4444", margin: "0 auto 16px" }} aria-hidden="true">!</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E252F", marginBottom: 8 }}>Savings Failed to Load</h2>
      <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>We could not load your savings data. This might be a temporary issue.</p>
      <button onClick={reset} className="btn" style={{ backgroundColor: "#EB5310", color: "#fff", borderRadius: 8, fontWeight: 600, padding: "10px 24px" }}>Retry</button>
    </div>
  );
}
