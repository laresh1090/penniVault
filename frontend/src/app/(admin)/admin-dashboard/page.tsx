"use client";

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
  faTriangleExclamation,
  faCircle,
  faCircleCheck,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import {
  mockAdminRecentUsers,
  mockVendorApprovals,
  mockSystemAlerts,
  mockGrowthChartData,
  mockSavingsVolumeData,
} from "@/data/dashboard";

import { formatNaira, formatDate, formatRelativeTime } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const unresolvedAlerts = mockSystemAlerts.filter((a) => !a.isResolved);

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
            <p className="kpi-value">12,458</p>
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
            <p className="kpi-value">342</p>
            <span className="kpi-sub">
              <span style={{ color: "#D97706", fontWeight: 700 }}>4 pending</span> approval
            </span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#FFF3EE", color: "#EB5310" }}>
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
            <p className="kpi-label">Savings Volume</p>
            <p className="kpi-value">{"\u20A6"}2.8B</p>
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
            <p className="kpi-value">89</p>
            <span className="kpi-sub">1,240 members total</span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#F5F3FF", color: "#7C3AED" }}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
            </div>
            <p className="kpi-label">Transactions</p>
            <p className="kpi-value">45,672</p>
            <span className="kpi-sub">This month</span>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: "#ECFDF5", color: "#059669" }}>
              <FontAwesomeIcon icon={faNairaSign} />
            </div>
            <p className="kpi-label">Platform Revenue</p>
            <p className="kpi-value">{"\u20A6"}42M</p>
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
              <Link href="#" className="card-action">Manage</Link>
            </div>
            <div className="admin-user-list">
              {mockAdminRecentUsers.map((user) => {
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();
                const shortName = `${user.name.split(" ")[0]} ${user.name.split(" ")[1]?.[0] || ""}.`.trim();
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
              <Link href="#" className="card-action">View All</Link>
            </div>

            {mockVendorApprovals.slice(0, 3).map((vendor) => (
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
                  <button className="btn btn-sm btn-success" style={{ fontSize: 12 }}>
                    <FontAwesomeIcon icon={faCheck} /> Approve
                  </button>
                  <button className="btn btn-sm btn-outline-danger" style={{ fontSize: 12 }}>
                    <FontAwesomeIcon icon={faXmark} /> Reject
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: 12 }}>
                    <FontAwesomeIcon icon={faEye} /> Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
              <Link href="#" className="card-action">Monitor</Link>
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
                  <tr>
                    <td style={{ fontSize: 13 }}>Adebayo M.</td>
                    <td className="amount-positive" style={{ fontSize: 13 }}>+{"\u20A6"}500K</td>
                    <td>
                      <span className="status-badge active" style={{ fontSize: 11 }}>Success</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: 13 }}>Chioma O.</td>
                    <td className="amount-negative" style={{ fontSize: 13 }}>-{"\u20A6"}200K</td>
                    <td>
                      <span className="status-badge active" style={{ fontSize: 11 }}>Success</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: 13 }}>Emeka K.</td>
                    <td className="amount-positive" style={{ fontSize: 13 }}>+{"\u20A6"}1.2M</td>
                    <td>
                      <span className="status-badge pending" style={{ fontSize: 11 }}>Pending</span>
                    </td>
                  </tr>
                  <tr style={{ background: "#FEF2F2" }}>
                    <td style={{ fontSize: 13 }}>
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        style={{ color: "#DC2626", marginRight: 4 }}
                      />
                      Unknown ID
                    </td>
                    <td className="amount-negative" style={{ fontSize: 13 }}>-{"\u20A6"}5M</td>
                    <td>
                      <span className="status-badge overdue" style={{ fontSize: 11 }}>Flagged</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: 13 }}>Grace A.</td>
                    <td className="amount-positive" style={{ fontSize: 13 }}>+{"\u20A6"}150K</td>
                    <td>
                      <span className="status-badge active" style={{ fontSize: 11 }}>Success</span>
                    </td>
                  </tr>
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
          <Link href="#" className="card-action">Manage Groups</Link>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Members</th>
                <th>Total Pool</th>
                <th>Current Cycle</th>
                <th>Payout Status</th>
                <th>Health</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>HomeOwners Circle</strong></td>
                <td>20 / 20</td>
                <td>{"\u20A6"}50,000,000</td>
                <td>Cycle 12 of 20</td>
                <td><span className="status-badge active">Payouts Active</span></td>
                <td>
                  <span style={{ color: "#059669", fontWeight: 700 }}>
                    <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> Healthy
                  </span>
                </td>
                <td>Oct 2025</td>
              </tr>
              <tr>
                <td><strong>Car Buyers Club</strong></td>
                <td>10 / 10</td>
                <td>{"\u20A6"}20,000,000</td>
                <td>Cycle 3 of 10</td>
                <td><span className="status-badge pending">Pre-Midpoint</span></td>
                <td>
                  <span style={{ color: "#059669", fontWeight: 700 }}>
                    <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> Healthy
                  </span>
                </td>
                <td>Jan 2026</td>
              </tr>
              <tr>
                <td><strong>Property Investors Pool</strong></td>
                <td>15 / 15</td>
                <td>{"\u20A6"}75,000,000</td>
                <td>Cycle 8 of 15</td>
                <td><span className="status-badge active">Payouts Active</span></td>
                <td>
                  <span style={{ color: "#D97706", fontWeight: 700 }}>
                    <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> At Risk
                  </span>
                </td>
                <td>Aug 2025</td>
              </tr>
              <tr>
                <td><strong>SmartSavers Group A</strong></td>
                <td>12 / 12</td>
                <td>{"\u20A6"}12,000,000</td>
                <td>Completed</td>
                <td><span className="status-badge completed">All Paid</span></td>
                <td>
                  <span style={{ color: "#2563EB", fontWeight: 700 }}>
                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 10 }} /> Completed
                  </span>
                </td>
                <td>Mar 2025</td>
              </tr>
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
