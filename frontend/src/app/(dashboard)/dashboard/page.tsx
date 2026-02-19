"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faCoins,
  faPiggyBank,
  faMoneyBillWave,
  faPlus,
  faDownload,
  faExchangeAlt,
  faUsers,
  faHouseChimney,
  faCar,
} from "@fortawesome/free-solid-svg-icons";

import WalletCard from "@/components/ui/WalletCard";
import DashCard from "@/components/ui/DashCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import QuickActionBtn from "@/components/ui/QuickActionBtn";
import GroupSavingsStatusCard from "@/components/ui/GroupSavingsStatusCard";
import DepositModal from "@/components/dashboard/DepositModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";

import { mockTransactions } from "@/data/transactions";
import { mockSavingsPlans, mockGroupSavings } from "@/data/savings";
import { mockAssets } from "@/data/assets";
import { mockWalletSummary } from "@/data/dashboard";
import { formatNaira, formatDate } from "@/lib/formatters";

type SavingsRow = Record<string, unknown> & {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  endDate: string;
  status: "active" | "pending" | "completed" | "overdue" | "paused" | "draft";
};

type TransactionRow = Record<string, unknown> & {
  id: string;
  description: string;
  amount: number;
  status: "active" | "pending" | "completed" | "overdue" | "paused" | "draft";
  createdAt: string;
};

export default function UserDashboardPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const activeSavingsPlans: SavingsRow[] = mockSavingsPlans
    .filter((plan) => plan.status === "active")
    .map((plan) => ({
      ...plan,
      status: plan.status as SavingsRow["status"],
    })) as unknown as SavingsRow[];

  const recentTransactions: TransactionRow[] = mockTransactions
    .slice(0, 5)
    .map((txn) => ({
      ...txn,
      status: txn.status as TransactionRow["status"],
    })) as unknown as TransactionRow[];

  return (
    <div>
      <h2
        className="mb-4"
        style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E252F" }}
      >
        Welcome back, Adebayo!
      </h2>

      {/* Row 1 - Wallet Summary */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <WalletCard
            variant="real-wallet"
            icon={faWallet}
            label="Real Wallet"
            amount={mockWalletSummary.realBalance}
            actionLabel="Deposit"
            actionHref="/wallet"
            trend={{ value: "+12.5%", direction: "up" }}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <WalletCard
            variant="virtual-wallet"
            icon={faCoins}
            label="Virtual Wallet"
            amount={mockWalletSummary.virtualBalance}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <WalletCard
            variant="total-savings"
            icon={faPiggyBank}
            label="Total Savings"
            amount={mockWalletSummary.totalSavings}
            trend={{ value: "+8.3%", direction: "up" }}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <WalletCard
            variant="monthly-rate"
            icon={faMoneyBillWave}
            label="Monthly Savings"
            amount={mockWalletSummary.monthlySavingsRate}
          />
        </div>
      </div>

      {/* Row 2 - Active Savings Plans Table */}
      <DashCard
        title="Active Savings Plans"
        actionLabel="View All"
        actionHref="/savings"
      >
        <DataTable<SavingsRow>
          columns={[
            { key: "name", header: "Plan Name" },
            {
              key: "target",
              header: "Target",
              render: (item) => formatNaira(item.targetAmount, false),
            },
            {
              key: "saved",
              header: "Saved",
              render: (item) => formatNaira(item.currentAmount, false),
            },
            {
              key: "progress",
              header: "Progress",
              render: (item) => {
                const pct = Math.round(
                  (item.currentAmount / item.targetAmount) * 100
                );
                return (
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "#F1F5F9",
                        borderRadius: 4,
                        overflow: "hidden",
                        minWidth: 60,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          height: "100%",
                          borderRadius: 4,
                          background:
                            pct >= 75
                              ? "#059669"
                              : pct >= 50
                                ? "#D97706"
                                : "linear-gradient(90deg, #EB5310, #FAA019)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#64748B",
                        minWidth: 36,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              },
            },
            {
              key: "endDate",
              header: "Due Date",
              render: (item) => formatDate(item.endDate as string),
            },
            {
              key: "status",
              header: "Status",
              render: (item) => <StatusBadge status={item.status} />,
            },
          ]}
          data={activeSavingsPlans}
        />
      </DashCard>

      {/* Row 3 - Group Savings Status Cards */}
      <div className="row g-4 mb-4">
        {mockGroupSavings.map((group) => (
          <div key={group.id} className="col-lg-6">
            <GroupSavingsStatusCard
              name={group.name}
              memberCount={`${group.filledSlots}/${group.totalSlots}`}
              poolSize={group.contributionAmount * group.filledSlots}
              contribution={group.contributionAmount}
              frequency={group.frequency}
              position={
                group.members.find((m) => m.userId === "usr_001")?.position ?? 0
              }
              currentRound={`${group.currentRound} of ${group.totalRounds}`}
              progress={(group.currentRound / group.totalRounds) * 100}
              href={`/savings/groups/${group.id}`}
            />
          </div>
        ))}
      </div>

      {/* Row 4 - Split: Recent Transactions + Featured Listings */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <DashCard
            title="Recent Transactions"
            actionLabel="View All"
            actionHref="/transactions"
          >
            <DataTable<TransactionRow>
              columns={[
                {
                  key: "date",
                  header: "Date",
                  render: (item) => formatDate(item.createdAt),
                },
                {
                  key: "desc",
                  header: "Description",
                  render: (item) => item.description as string,
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (item) => {
                    const amt = item.amount as number;
                    return (
                      <span
                        className={
                          amt > 0 ? "amount-positive" : "amount-negative"
                        }
                      >
                        {amt > 0 ? "+" : ""}
                        {formatNaira(Math.abs(amt), false)}
                      </span>
                    );
                  },
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => <StatusBadge status={item.status} />,
                },
              ]}
              data={recentTransactions}
            />
          </DashCard>
        </div>
        <div className="col-lg-5">
          <DashCard
            title="Featured Listings"
            actionLabel="Browse All"
            actionHref="/marketplace"
          >
            {mockAssets.slice(0, 3).map((asset) => (
              <div
                key={asset.id}
                className="d-flex gap-3 align-items-center mb-3 pb-3"
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    background: "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      asset.category === "property" ? faHouseChimney : faCar
                    }
                    style={{ color: "#94A3B8", fontSize: "1.25rem" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1E252F",
                    }}
                  >
                    {asset.title}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                    {asset.location}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "#EB5310",
                    }}
                  >
                    {formatNaira(asset.price, false)}
                  </div>
                </div>
              </div>
            ))}
          </DashCard>
        </div>
      </div>

      {/* Row 5 - Quick Actions */}
      <DashCard title="Quick Actions">
        <div className="quick-actions">
          <QuickActionBtn icon={faPlus} onClick={() => setShowDeposit(true)}>
            Deposit Money
          </QuickActionBtn>
          <QuickActionBtn
            variant="secondary"
            icon={faDownload}
            onClick={() => setShowWithdraw(true)}
          >
            Withdraw
          </QuickActionBtn>
          <QuickActionBtn
            variant="outline"
            icon={faExchangeAlt}
            href="/savings"
          >
            New Savings Plan
          </QuickActionBtn>
          <QuickActionBtn
            variant="outline"
            icon={faUsers}
            href="/savings/groups"
          >
            Join Group
          </QuickActionBtn>
        </div>
      </DashCard>

      {/* Modals */}
      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
      />
      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        maxAmount={mockWalletSummary.realBalance}
      />
    </div>
  );
}
