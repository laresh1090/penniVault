import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex min-vh-100">
      <aside
        className="bg-dark text-white d-none d-lg-flex flex-column"
        style={{ width: 260, minHeight: "100vh", position: "sticky", top: 0 }}
      >
        <div className="p-3 border-bottom border-secondary">
          <h3 className="pv-text-logo pv-text-logo--white mb-0" style={{ fontSize: "1.25rem" }}>
            Penni<span>Vault</span>
          </h3>
          <span className="badge bg-danger mt-1" style={{ fontSize: "10px" }}>Admin</span>
        </div>
        <nav className="flex-grow-1 p-3">
          <a href="/admin-dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Dashboard</a>
          <a href="/admin-dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Users</a>
          <a href="/admin-dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Vendors</a>
          <a href="/admin-dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Assets</a>
          <a href="/admin-dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Reports</a>
        </nav>
      </aside>
      <main className="flex-grow-1" style={{ background: "#F8FAFC" }}>
        <header className="bg-white border-bottom px-4 py-3">
          <h1 className="h5 mb-0 fw-bold" style={{ color: "#1E252F" }}>Admin Dashboard</h1>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
