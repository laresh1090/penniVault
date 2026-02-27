"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faPiggyBank,
  faPeopleGroup,
  faArrowRightArrowLeft,
  faNairaSign,
  faArrowUp,
  faChartLine,
  faChartBar,
  faClock,
  faCheck,
  faXmark,
  faEye,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { adminService } from "@/services/admin.service";
import type { DashboardStats, AdminTransaction, AdminGroupOverview } from "@/services/admin.service";
import type { AdminUser, VendorApproval, SystemAlert } from "@/types/dashboard";
import { formatNaira, formatDate, formatRelativeTime } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [pendingVendors, setPendingVendors] = useState<VendorApproval[]>([]);
  const [recentTxns, setRecentTxns] = useState<AdminTransaction[]>([]);
  const [groupOverview, setGroupOverview] = useState<AdminGroupOverview[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats).catch(() => {});
    adminService.getRecentUsers(5).then(setRecentUsers).catch(() => {});
    adminService.getPendingVendors().then(setPendingVendors).catch(() => {});
    adminService.getRecentTransactions(5).then(setRecentTxns).catch(() => {});
    adminService.getGroupSavingsOverview().then(setGroupOverview).catch(() => {});
    adminService.getSystemAlerts().then(setAlerts).catch(() => {});
  }, []);

  const handleApprove = async (id: string) => {
    await adminService.approveVendor(id);
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleReject = async (id: string) => {
    await adminService.rejectVendor(id);
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const unresolvedAlerts = alerts.filter((a) => !a.isResolved);

  const formatCompact = (n: number): string => {
    if (n >= 1_000_000_000) return `\u20A6${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `\u20A6${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return n.toLocaleString();
    return String(n);
  };

  return (
    <>
      {/* Row 1: Platform KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <p className="kpi-label">Total Users</p>
            <p className="kpi-value">{stats ? stats.totalUsers.toLocaleString() : "—"}</p>
            <span className="kpi-trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> 8.2%
            </span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>
              <FontAwesomeIcon icon={faStore} />
            </div>
            <p className="kpi-label">Total Vendors</p>
            <p className="kpi-value">{stats ? stats.totalVendors.toLocaleString() : "—"}</p>
            <span className="kpi-sub">
              <span style={{ color: "#D97706", fontWeight: 700 }}>{stats?.pendingVendors ?? 0} pending</span> approval
            </span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#FFF3EE", color: "#EB5310" }}>
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
            <p className="kpi-label">Savings Volume</p>
            <p className="kpi-value">{stats ? formatCompact(stats.savingsVolume) : "—"}</p>
            <span className="kpi-trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> 15.4%
            </span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#FFF8EB", color: "#F59E0B" }}>
              <FontAwesomeIcon icon={faPeopleGroup} />
            </div>
            <p className="kpi-label">Active Groups</p>
            <p className="kpi-value">{stats?.activeGroups ?? "—"}</p>
            <span className="kpi-sub">{stats?.groupMembers?.toLocaleString() ?? "0"} members total</span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#F5F3FF", color: "#7C3AED" }}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
            </div>
            <p className="kpi-label">Transactions</p>
            <p className="kpi-value">{stats ? stats.transactionsThisMonth.toLocaleString() : "—"}</p>
            <span className="kpi-sub">This month</span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#ECFDF5", color: "#059669" }}>
              <FontAwesomeIcon icon={faNairaSign} />
            </div>
            <p className="kpi-label">Platform Revenue</p>
            <p className="kpi-value">{stats ? formatCompact(stats.platformRevenue) : "—"}</p>
            <span className="kpi-trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> 22.1%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Platform Growth</h3>
              <select className="form-select form-select-sm" style={{ width: "auto" }}>
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div
              style={{
                height: 260,
                background: "linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", color: "#94A3B8" }}>
                <FontAwesomeIcon
                  icon={faChartLine}
                  style={{ fontSize: 42, color: "#CBD5E1", display: "block", marginBottom: 8 }}
                />
                <p style={{ fontSize: 14, margin: 0 }}>User growth chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Savings Volume</h3>
              <select className="form-select form-select-sm" style={{ width: "auto" }}>
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div
              style={{
                height: 260,
                background: "linear-gradient(180deg, #FFF3EE 0%, #FFFFFF 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", color: "#94A3B8" }}>
                <FontAwesomeIcon
                  icon={faChartBar}
                  style={{ fontSize: 42, color: "#CBD5E1", display: "block", marginBottom: 8 }}
                />
                <p style={{ fontSize: 14, margin: 0 }}>Savings volume chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Users, Vendor Approvals, Transactions */}
      <div className="row g-4 mb-4">
        {/* Recent User Registrations */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">New Users</h3>
              <Link href="/admin/users" className="card-action">Manage</Link>
            </div>
            <div className="admin-user-list">
              {recentUsers.map((user) => {
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();
                const roleLabel = user.role === "vendor" ? "Vendor" : "Regular User";
                const statusClass = user.status === "active" ? "active" : "pending";
                const statusLabel = user.status === "active" ? "Active" : "Pending KYC";
                const dateStr = formatDate(user.joinedAt);

                return (
                  <div className="admin-user-item" key={user.id}>
                    <div
                      className="admin-user-avatar"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#EB5310",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex-grow-1">
                      <p className="admin-user-name">{user.name}</p>
                      <span className="admin-user-meta">
                        {roleLabel} &middot; {dateStr}
                      </span>
                    </div>
                    <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pending Vendor Approvals */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title" style={{ color: "#D97706" }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: 4 }} /> Pending Approvals
              </h3>
              <Link href="/admin/vendors" className="card-action">View All</Link>
            </div>

            {pendingVendors.length === 0 ? (
              <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>
                No pending vendor approvals
              </p>
            ) : (
              pendingVendors.slice(0, 3).map((vendor) => (
                <div className="vendor-approval-item" key={vendor.id}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                        {vendor.businessName}
                      </h6>
                      <span style={{ fontSize: 12, color: "#64748B" }}>
                        {vendor.category} &middot; Applied {formatDate(vendor.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" style={{ fontSize: 12 }} onClick={() => handleApprove(vendor.id)}>
                      <FontAwesomeIcon icon={faCheck} /> Approve
                    </button>
                    <button className="btn btn-sm btn-outline-danger" style={{ fontSize: 12 }} onClick={() => handleReject(vendor.id)}>
                      <FontAwesomeIcon icon={faXmark} /> Reject
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: 12 }}>
                      <FontAwesomeIcon icon={faEye} /> Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
              <Link href="/admin/transactions" className="card-action">Monitor</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxns.map((txn) => (
                    <tr key={txn.id}>
                      <td style={{ fontSize: 13 }}>{txn.userName}</td>
                      <td className={txn.amount >= 0 ? "amount-positive" : "amount-negative"} style={{ fontSize: 13 }}>
                        {txn.amount >= 0 ? "+" : ""}{formatNaira(Math.abs(txn.amount), false)}
                      </td>
                      <td>
                        <span className={`status-badge ${txn.status === "completed" ? "active" : txn.status === "pending" ? "pending" : "overdue"}`} style={{ fontSize: 11 }}>
                          {txn.status === "completed" ? "Success" : txn.status === "pending" ? "Pending" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Group Savings Overview */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Group Savings Overview</h3>
          <Link href="/admin/groups" className="card-action">Manage Groups</Link>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Members</th>
                <th>Total Pool</th>
                <th>Current Cycle</th>
                <th>Status</th>
                <th>Frequency</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {groupOverview.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                    No group savings data available
                  </td>
                </tr>
              ) : (
                groupOverview.map((g) => (
                  <tr key={g.id}>
                    <td><strong>{g.name}</strong></td>
                    <td>{g.members}</td>
                    <td>{formatNaira(g.poolSize, false)}</td>
                    <td>{g.currentRound}</td>
                    <td>
                      <span className={`status-badge ${g.status === "active" ? "active" : g.status === "completed" ? "completed" : "pending"}`}>
                        {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                      </span>
                    </td>
                    <td>{g.frequency}</td>
                    <td>{g.createdBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: System Alerts */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">
            <FontAwesomeIcon icon={faBell} style={{ color: "#D97706", marginRight: 6 }} />
            System Alerts
          </h3>
          <span style={{ fontSize: 13, color: "#64748B" }}>
            {unresolvedAlerts.length} unresolved
          </span>
        </div>

        {unresolvedAlerts.map((alert) => {
          const actionLabel =
            alert.severity === "high"
              ? "Investigate"
              : alert.severity === "medium"
              ? "View Group"
              : "Review Now";

          return (
            <div className={`alert-item ${alert.severity}`} key={alert.id}>
              <div className="alert-priority">{alert.severity.toUpperCase()}</div>
              <div className="alert-content">
                <p className="alert-text">{alert.message}</p>
                <span className="alert-time">{formatRelativeTime(alert.timestamp)}</span>
              </div>
              <div className="alert-actions">
                <button className="btn btn-sm btn-outline-primary">{actionLabel}</button>
                <button className="btn btn-sm btn-outline-secondary">Dismiss</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
