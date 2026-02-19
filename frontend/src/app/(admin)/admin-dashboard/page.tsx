"use client";

import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faExchangeAlt,
  faChartLine,
  faPiggyBank,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import KpiCard from "@/components/ui/KpiCard";
import DashCard from "@/components/ui/DashCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import AdminUserItem from "@/components/dashboard/AdminUserItem";
import VendorApprovalItem from "@/components/dashboard/VendorApprovalItem";
import SystemAlertItem from "@/components/dashboard/SystemAlertItem";
import PlatformGrowthChart from "@/components/dashboard/PlatformGrowthChart";
import SavingsVolumeChart from "@/components/dashboard/SavingsVolumeChart";

import {
  mockAdminRecentUsers,
  mockVendorApprovals,
  mockSystemAlerts,
  mockGrowthChartData,
  mockSavingsVolumeData,
} from "@/data/dashboard";

import { mockTransactions } from "@/data/transactions";
import { mockGroupSavings } from "@/data/savings";

import { formatNaira, formatCompactNaira } from "@/lib/formatters";
import { capitalize } from "@/lib/utils";

export default function AdminDashboardPage() {
  const transactionTableData = useMemo(() => {
    return mockTransactions.slice(0, 5).map((txn) => ({
      description: txn.description,
      amount: txn.amount,
      status: txn.status,
      id: txn.id,
    })) as Record<string, unknown>[];
  }, []);

  const groupSavingsTableData = useMemo(() => {
    return mockGroupSavings.map((group) => ({
      name: group.name,
      cycle: `Round ${group.currentRound} of ${group.totalRounds}`,
      members: `${group.filledSlots}/${group.totalSlots}`,
      pool: formatCompactNaira(group.contributionAmount * group.filledSlots),
      status: group.status,
      id: group.id,
    })) as Record<string, unknown>[];
  }, []);

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>
        Admin Dashboard
      </h2>

      {/* Row 1 - 6 KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faUsers}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            value="1,250"
            label="Total Users"
            trend={{ value: "+45", direction: "up" }}
          />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faStore}
            iconBg="#ECFDF5"
            iconColor="#059669"
            value="48"
            label="Active Vendors"
            trend={{ value: "+3", direction: "up" }}
          />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faExchangeAlt}
            iconBg="#FFF3EE"
            iconColor="#EB5310"
            value={"\u20A6850M"}
            label="Platform Volume"
            trend={{ value: "+18.5%", direction: "up" }}
          />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faChartLine}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
            value="+12.5%"
            label="Platform Growth"
          />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faPiggyBank}
            iconBg="#FFF8EB"
            iconColor="#D97706"
            value="156"
            label="Active Savings"
          />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <KpiCard
            variant="horizontal"
            icon={faShieldHalved}
            iconBg="#ECFDF5"
            iconColor="#059669"
            value="99.9%"
            label="System Health"
          />
        </div>
      </div>

      {/* Row 2 - Dual Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <DashCard title="Platform Growth">
            <PlatformGrowthChart data={mockGrowthChartData} />
          </DashCard>
        </div>
        <div className="col-lg-6">
          <DashCard title="Savings Volume">
            <SavingsVolumeChart data={mockSavingsVolumeData} />
          </DashCard>
        </div>
      </div>

      {/* Row 3 - Three-Column Management */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <DashCard
            title="New Users"
            actionLabel="View All"
            actionHref="/admin/users"
          >
            {mockAdminRecentUsers.map((user) => (
              <AdminUserItem
                key={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                joinedAt={user.joinedAt}
              />
            ))}
          </DashCard>
        </div>
        <div className="col-lg-4">
          <DashCard
            title="Pending Approvals"
            actionLabel="View All"
            actionHref="/admin/vendors"
          >
            {mockVendorApprovals.map((vendor) => (
              <VendorApprovalItem
                key={vendor.id}
                businessName={vendor.businessName}
                ownerName={vendor.ownerName}
                category={vendor.category}
                submittedAt={vendor.submittedAt}
                onApprove={() => {}}
                onReject={() => {}}
              />
            ))}
          </DashCard>
        </div>
        <div className="col-lg-4">
          <DashCard
            title="Recent Transactions"
            actionLabel="View All"
            actionHref="/admin/transactions"
          >
            <DataTable
              columns={[
                {
                  key: "desc",
                  header: "Description",
                  render: (item) => item.description as string,
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (item) =>
                    formatNaira(Math.abs(item.amount as number), false),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => (
                    <StatusBadge
                      status={
                        item.status as
                          | "active"
                          | "pending"
                          | "completed"
                          | "overdue"
                          | "paused"
                          | "draft"
                      }
                    />
                  ),
                },
              ]}
              data={transactionTableData}
            />
          </DashCard>
        </div>
      </div>

      {/* Row 4 - Group Savings Overview */}
      <div className="mb-4">
        <DashCard
          title="Group Savings Overview"
          actionLabel="Manage"
          actionHref="/admin/groups"
        >
          <DataTable
            columns={[
              { key: "name", header: "Group Name" },
              { key: "cycle", header: "Cycle" },
              { key: "members", header: "Members" },
              { key: "pool", header: "Pool Size" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <StatusBadge
                    status={
                      item.status as
                        | "active"
                        | "pending"
                        | "completed"
                        | "overdue"
                        | "paused"
                        | "draft"
                    }
                  />
                ),
              },
            ]}
            data={groupSavingsTableData}
          />
        </DashCard>
      </div>

      {/* Row 5 - System Alerts */}
      <div className="mb-4">
        <DashCard title="System Alerts">
          {mockSystemAlerts.map((alert) => (
            <SystemAlertItem
              key={alert.id}
              severity={alert.severity}
              message={alert.message}
              timestamp={alert.timestamp}
            />
          ))}
        </DashCard>
      </div>
    </div>
  );
}
