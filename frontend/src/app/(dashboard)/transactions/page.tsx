"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faFilter,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { mockTransactions } from "@/data/transactions";
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
  };
  return map[type] ?? { bg: "#F1F5F9", color: "#64748B", label: type };
}

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    let result = [...mockTransactions];

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
  }, [typeFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when filters change
  const handleTypeChange = (val: TypeFilter) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };
  const handleStatusChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  // Summary stats
  const totalIn = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
          Transactions
        </h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
        >
          <FontAwesomeIcon icon={faDownload} style={{ marginRight: 6 }} />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="d-flex align-items-center gap-3 p-3"
            style={{ background: "#F0FDF4", borderRadius: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#059669",
                fontSize: 18,
              }}
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Money In</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>
                {formatNaira(totalIn, false)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="d-flex align-items-center gap-3 p-3"
            style={{ background: "#FEF2F2", borderRadius: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#FECACA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444",
                fontSize: 18,
              }}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Money Out</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444" }}>
                {formatNaira(totalOut, false)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="d-flex align-items-center gap-3 p-3"
            style={{ background: "#EFF6FF", borderRadius: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#DBEAFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3B82F6",
                fontSize: 18,
              }}
            >
              <FontAwesomeIcon icon={faFilter} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748B" }}>
                Showing
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#3B82F6" }}>
                {filteredTransactions.length} transactions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="d-flex flex-wrap gap-3 mb-4 p-3"
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid #E2E8F0",
        }}
      >
        <select
          className="form-select form-select-sm"
          value={typeFilter}
          onChange={(e) => handleTypeChange(e.target.value as TypeFilter)}
          style={{
            width: "auto",
            minWidth: 160,
            borderRadius: 8,
            fontSize: 13,
            color: typeFilter === "all" ? "#94A3B8" : "#1E252F",
          }}
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
          onChange={(e) =>
            handleStatusChange(e.target.value as StatusFilter)
          }
          style={{
            width: "auto",
            minWidth: 140,
            borderRadius: 8,
            fontSize: 13,
            color: statusFilter === "all" ? "#94A3B8" : "#1E252F",
          }}
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
          onChange={(e) => {
            setDateFrom(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "auto",
            borderRadius: 8,
            fontSize: 13,
          }}
        />

        <input
          type="date"
          className="form-control form-control-sm"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "auto",
            borderRadius: 8,
            fontSize: 13,
          }}
        />

        {(typeFilter !== "all" ||
          statusFilter !== "all" ||
          dateFrom ||
          dateTo) && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
              setDateFrom("");
              setDateTo("");
              setCurrentPage(1);
            }}
            style={{ borderRadius: 8, fontSize: 13 }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr style={{ fontSize: 13, color: "#64748B" }}>
                <th
                  style={{
                    fontWeight: 600,
                    border: "none",
                    padding: "14px 16px",
                    background: "#F8FAFC",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    border: "none",
                    padding: "14px 16px",
                    background: "#F8FAFC",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    border: "none",
                    padding: "14px 16px",
                    background: "#F8FAFC",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    border: "none",
                    padding: "14px 16px",
                    background: "#F8FAFC",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    fontWeight: 600,
                    border: "none",
                    padding: "14px 16px",
                    background: "#F8FAFC",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: "#94A3B8",
                      fontSize: 14,
                    }}
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => {
                  const isPositive = txn.amount > 0;
                  const typeStyle = getTypeStyle(txn.type);
                  const statusMap: Record<
                    string,
                    "active" | "pending" | "completed" | "overdue"
                  > = {
                    completed: "completed",
                    pending: "pending",
                    failed: "overdue",
                  };

                  return (
                    <tr key={txn.id} style={{ fontSize: 14 }}>
                      <td
                        style={{
                          color: "#64748B",
                          borderColor: "#F1F5F9",
                          padding: "14px 16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(txn.createdAt)}
                      </td>
                      <td
                        style={{
                          color: "#1E293B",
                          fontWeight: 500,
                          borderColor: "#F1F5F9",
                          padding: "14px 16px",
                        }}
                      >
                        {txn.description}
                      </td>
                      <td
                        style={{
                          borderColor: "#F1F5F9",
                          padding: "14px 16px",
                        }}
                      >
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
                      <td
                        style={{
                          fontWeight: 700,
                          color: isPositive ? "#059669" : "#EF4444",
                          borderColor: "#F1F5F9",
                          padding: "14px 16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isPositive ? "+" : "-"}
                        {formatNaira(Math.abs(txn.amount), false)}
                      </td>
                      <td
                        style={{
                          borderColor: "#F1F5F9",
                          padding: "14px 16px",
                        }}
                      >
                        <StatusBadge
                          status={statusMap[txn.status] ?? "pending"}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 24 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
