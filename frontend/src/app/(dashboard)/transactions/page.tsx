"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faFilter,
  faDownload,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTransactions } from "@/hooks";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { TransactionType, TransactionStatus } from "@/types/common";

type TypeFilter = "all" | TransactionType;
type StatusFilter = "all" | TransactionStatus;

const ITEMS_PER_PAGE = 8;

function getTypeStyle(type: TransactionType) {
  const map: Record<TransactionType, { bg: string; color: string; label: string }> = {
    deposit: { bg: "#ECFDF5", color: "#059669", label: "Deposit" },
    withdrawal: { bg: "#FEF2F2", color: "#EF4444", label: "Withdrawal" },
    savings_contribution: { bg: "#EFF6FF", color: "#3B82F6", label: "Savings" },
    savings_payout: { bg: "#FFFBEB", color: "#D97706", label: "Savings Payout" },
    group_contribution: { bg: "#F5F3FF", color: "#7C3AED", label: "Group" },
    group_payout: { bg: "#FFF3EE", color: "#EB5310", label: "Group Payout" },
    transfer: { bg: "#F1F5F9", color: "#475569", label: "Transfer" },
    commission: { bg: "#FFFBEB", color: "#D97706", label: "Commission" },
    investment: { bg: "#F5F3FF", color: "#7C3AED", label: "Investment" },
    investment_return: { bg: "#ECFDF5", color: "#059669", label: "Returns" },
    installment_upfront: { bg: "#FFF3EE", color: "#EB5310", label: "Installment Upfront" },
    installment_payment: { bg: "#FFF3EE", color: "#EB5310", label: "Installment Payment" },
  };
  return map[type] ?? { bg: "#F1F5F9", color: "#64748B", label: type };
}

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions: allTransactions, isLoading } = useTransactions();

  const filteredTransactions = useMemo(() => {
    let result = [...allTransactions];

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (dateFrom) {
      result = result.filter(
        (t) => new Date(t.createdAt) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.createdAt) <= endDate);
    }

    return result;
  }, [allTransactions, typeFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const handleTypeChange = (val: TypeFilter) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };
  const handleStatusChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const totalIn = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border text-primary" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Transactions</h2>
        <button type="button" className="quick-action-btn secondary">
          <FontAwesomeIcon icon={faDownload} /> Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="wallet-card total-savings">
            <div className="wallet-icon">
              <FontAwesomeIcon icon={faArrowDown} />
            </div>
            <span className="wallet-label">Money In</span>
            <p className="wallet-amount">{formatNaira(totalIn, false)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="wallet-card monthly-rate">
            <div className="wallet-icon">
              <FontAwesomeIcon icon={faArrowUp} />
            </div>
            <span className="wallet-label">Money Out</span>
            <p className="wallet-amount">{formatNaira(totalOut, false)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="wallet-card virtual-wallet">
            <div className="wallet-icon">
              <FontAwesomeIcon icon={faFilter} />
            </div>
            <span className="wallet-label">Showing</span>
            <p className="wallet-amount">{filteredTransactions.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-card mb-4">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <select
            className="form-select form-select-sm"
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value as TypeFilter)}
            style={{ width: "auto", minWidth: 160, borderRadius: 8, fontSize: 13 }}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="savings_contribution">Savings</option>
            <option value="savings_payout">Savings Payout</option>
            <option value="group_contribution">Group Contribution</option>
            <option value="group_payout">Group Payout</option>
            <option value="transfer">Transfer</option>
            <option value="commission">Commission</option>
          </select>

          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
            style={{ width: "auto", minWidth: 140, borderRadius: 8, fontSize: 13 }}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="date"
            className="form-control form-control-sm"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
            style={{ width: "auto", borderRadius: 8, fontSize: 13 }}
          />

          <input
            type="date"
            className="form-control form-control-sm"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
            style={{ width: "auto", borderRadius: 8, fontSize: 13 }}
          />

          {(typeFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo) && (
            <button
              type="button"
              className="quick-action-btn secondary"
              style={{ fontSize: 12 }}
              onClick={() => {
                setTypeFilter("all");
                setStatusFilter("all");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Transaction History</h3>
          <span className="card-action">{filteredTransactions.length} total</span>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 14 }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => {
                  const isPositive = txn.amount > 0;
                  const typeStyle = getTypeStyle(txn.type);

                  return (
                    <tr key={txn.id}>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(txn.createdAt)}</td>
                      <td><strong>{txn.description}</strong></td>
                      <td>
                        <span
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12,
                          }}
                        >
                          {typeStyle.label}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: isPositive ? "#059669" : "#EF4444", whiteSpace: "nowrap" }}>
                        {isPositive ? "+" : "-"}{formatNaira(Math.abs(txn.amount), false)}
                      </td>
                      <td>
                        <span className={`status-badge ${txn.status === "failed" ? "overdue" : txn.status}`}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center" style={{ padding: "16px 0 0" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Page {currentPage} of {totalPages}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="quick-action-btn secondary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Prev
              </button>
              <button
                type="button"
                className="quick-action-btn secondary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
