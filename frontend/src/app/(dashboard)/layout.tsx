"use client";

import { SidebarProvider } from "@/contexts/sidebar-context";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="d-flex min-vh-100">
        <aside
          className="bg-dark text-white d-none d-lg-flex flex-column"
          style={{ width: 260, minHeight: "100vh", position: "sticky", top: 0 }}
        >
          <div className="p-3 border-bottom border-secondary">
            <h3 className="pv-text-logo pv-text-logo--white mb-0" style={{ fontSize: "1.25rem" }}>
              Penni<span>Vault</span>
            </h3>
          </div>
          <nav className="flex-grow-1 p-3">
            <p className="text-uppercase text-white-50 mb-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>Main</p>
            <a href="/dashboard" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Dashboard</a>
            <a href="/wallet" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>My Wallet</a>
            <a href="/savings" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Savings Plans</a>
            <a href="/savings/groups" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Group Savings</a>
            <a href="/marketplace" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Marketplace</a>
            <p className="text-uppercase text-white-50 mb-2 mt-3" style={{ fontSize: "11px", letterSpacing: "1px" }}>Account</p>
            <a href="/transactions" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Transactions</a>
            <a href="/profile" className="d-block text-white-50 text-decoration-none py-2 px-3 rounded mb-1" style={{ fontSize: "14px" }}>Profile & Settings</a>
          </nav>
          <div className="p-3 border-top border-secondary">
            <a href="/login" className="d-block text-white-50 text-decoration-none py-2 px-3" style={{ fontSize: "14px" }}>Logout</a>
          </div>
        </aside>
        <main className="flex-grow-1" style={{ background: "#F8FAFC" }}>
          <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h1 className="h5 mb-0 fw-bold" style={{ color: "#1E252F" }}>Dashboard</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="position-relative" style={{ cursor: "pointer" }}>
                <span style={{ fontSize: "18px", color: "#64748B" }}>&#128276;</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>3</span>
              </span>
              <div className="rounded-circle bg-secondary" style={{ width: 36, height: 36 }} />
            </div>
          </header>
          <div className="p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
