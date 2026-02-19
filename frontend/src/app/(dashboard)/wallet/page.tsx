"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDownload,
  faBuildingColumns,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

import DashCard from "@/components/ui/DashCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import DepositModal from "@/components/dashboard/DepositModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";

import { mockTransactions } from "@/data/transactions";
import { mockPaymentMethods } from "@/data/wallets";
import { mockWalletSummary } from "@/data/dashboard";
import { formatNaira, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type TransactionRow = Record<string, unknown> & {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  balanceAfter: number;
  status: "active" | "pending" | "completed" | "overdue" | "paused" | "draft";
  createdAt: string;
};

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredTransactions: TransactionRow[] = useMemo(() => {
    return mockTransactions
      .filter((txn) => {
        if (typeFilter !== "all") {
          const typeMap: Record<string, string[]> = {
            deposits: ["deposit"],
            withdrawals: ["withdrawal"],
            savings: ["savings_contribution", "savings_payout"],
            group: ["group_contribution", "group_payout"],
          };
          if (typeMap[typeFilter] && !typeMap[typeFilter].includes(txn.type)) {
            return false;
          }
        }
        if (statusFilter !== "all" && txn.status !== statusFilter) {
          return false;
        }
        if (dateFrom) {
          const txnDate = new Date(txn.createdAt);
          const fromDate = new Date(dateFrom);
          if (txnDate < fromDate) return false;
        }
        if (dateTo) {
          const txnDate = new Date(txn.createdAt);
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (txnDate > toDate) return false;
        }
        return true;
      })
      .map((txn) => ({
        ...txn,
        status: txn.status as TransactionRow["status"],
      })) as unknown as TransactionRow[];
  }, [typeFilter, statusFilter, dateFrom, dateTo]);

  const getTypeBadge = (type: string) => {
    const typeStyles: Record<
      string,
      { label: string; bg: string; color: string }
    > = {
      deposit: { label: "Deposit", bg: "#ECFDF5", color: "#059669" },
      withdrawal: { label: "Withdrawal", bg: "#FEF2F2", color: "#DC2626" },
      savings_contribution: {
        label: "Savings",
        bg: "#EFF6FF",
        color: "#2563EB",
      },
      savings_payout: { label: "Payout", bg: "#F0F9FF", color: "#0EA5E9" },
      group_contribution: {
        label: "Group",
        bg: "#FFF8EB",
        color: "#D97706",
      },
      group_payout: {
        label: "Group Payout",
        bg: "#ECFDF5",
        color: "#059669",
      },
      transfer: { label: "Transfer", bg: "#F1F5F9", color: "#64748B" },
      commission: { label: "Commission", bg: "#FFF7ED", color: "#EB5310" },
    };
    const style = typeStyles[type] || {
      label: type,
      bg: "#F1F5F9",
      color: "#64748B",
    };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: "0.75rem",
          fontWeight: 600,
          background: style.bg,
          color: style.color,
        }}
      >
        {style.label}
      </span>
    );
  };

  return (
    <div>
      <h2
        className="mb-4"
        style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E252F" }}
      >
        My Wallet
      </h2>

      {/* Row 1 - Dual Wallet Hero Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={cn("wallet-hero-card", "real")}>
            <p
              className="mb-1"
              style={{ fontSize: 14, opacity: 0.85, fontWeight: 500 }}
            >
              Real Wallet
            </p>
            <p className="mb-1" style={{ fontSize: 36, fontWeight: 800 }}>
              {formatNaira(mockWalletSummary.realBalance, false)}
            </p>
            <p
              className="mb-3"
              style={{ fontSize: 13, opacity: 0.7, marginTop: 0 }}
            >
              Available for withdrawals and payments
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-light btn-sm fw-bold"
                onClick={() => setShowDeposit(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Deposit
              </button>
              <button
                className="btn btn-outline-light btn-sm fw-bold"
                onClick={() => setShowWithdraw(true)}
              >
                <FontAwesomeIcon icon={faDownload} className="me-1" /> Withdraw
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={cn("wallet-hero-card", "virtual")}>
            <p
              className="mb-1"
              style={{ fontSize: 14, opacity: 0.85, fontWeight: 500 }}
            >
              Virtual Wallet
            </p>
            <p className="mb-1" style={{ fontSize: 36, fontWeight: 800 }}>
              {formatNaira(mockWalletSummary.virtualBalance, false)}
            </p>
            <p
              className="mb-3"
              style={{ fontSize: 13, opacity: 0.7, marginTop: 0 }}
            >
              Converts when group savings turn is received
            </p>
            <div className="d-flex gap-2">
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.2)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                <FontAwesomeIcon icon={faCreditCard} className="me-1" />{" "}
                Virtual Balance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 - Payment Methods */}
      <DashCard title="Payment Methods" actionLabel="Add New" actionHref="#">
        {mockPaymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={cn("payment-method-item")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 0",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FontAwesomeIcon
                icon={faBuildingColumns}
                style={{ color: "#64748B", fontSize: "1.125rem" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#1E252F",
                }}
              >
                {pm.bankName}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                {pm.accountName} &middot; {pm.accountNumber}
              </div>
            </div>
            {pm.isDefault && (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "#ECFDF5",
                  color: "#059669",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Default
              </span>
            )}
          </div>
        ))}
      </DashCard>

      {/* Row 3 - Transaction History with Filters */}
      <DashCard title="Transaction History">
        {/* Filter Bar */}
        <div
          className="filter-bar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
            padding: "16px",
            background: "#F8FAFC",
            borderRadius: 8,
          }}
        >
          <div style={{ minWidth: 140 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#64748B",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Type
            </label>
            <select
              className="form-select form-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              <option value="all">All Types</option>
              <option value="deposits">Deposits</option>
              <option value="withdrawals">Withdrawals</option>
              <option value="savings">Savings</option>
              <option value="group">Group</option>
            </select>
          </div>
          <div style={{ minWidth: 140 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#64748B",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Status
            </label>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div style={{ minWidth: 140 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#64748B",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              From
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            />
          </div>
          <div style={{ minWidth: 140 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#64748B",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              To
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ fontSize: "0.875rem" }}
            />
          </div>
        </div>

        {/* Transaction Table */}
        <DataTable<TransactionRow>
          columns={[
            {
              key: "date",
              header: "Date",
              render: (item) => formatDate(item.createdAt),
            },
            {
              key: "description",
              header: "Description",
              render: (item) => item.description as string,
            },
            {
              key: "type",
              header: "Type",
              render: (item) => getTypeBadge(item.type as string),
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
              key: "balanceAfter",
              header: "Balance After",
              render: (item) => formatNaira(item.balanceAfter as number, false),
            },
            {
              key: "status",
              header: "Status",
              render: (item) => <StatusBadge status={item.status} />,
            },
          ]}
          data={filteredTransactions}
          emptyMessage="No transactions match your filters"
        />
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
