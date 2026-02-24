"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faCoins,
  faPlus,
  faArrowDown,
  faDownload,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";

import { useWallet, useTransactions } from "@/hooks";
import { formatNaira, formatDate } from "@/lib/formatters";
import { walletService } from "@/services/wallet.service";
import { extractApiError } from "@/lib/api";

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Deposit modal state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethodId, setDepositMethodId] = useState("");
  const [depositSubmitting, setDepositSubmitting] = useState(false);
  const [depositError, setDepositError] = useState("");

  // Withdraw modal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethodId, setWithdrawMethodId] = useState("");
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  const { wallet, paymentMethods, isLoading: walletLoading, refetch } = useWallet();
  const { transactions: allTransactions, isLoading: txnLoading, refetch: refetchTransactions } = useTransactions();

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      if (typeFilter !== "all") {
        const typeMap: Record<string, string[]> = {
          deposits: ["deposit"],
          withdrawals: ["withdrawal"],
          transfers: ["transfer"],
          savings: ["savings_contribution", "savings_payout", "group_contribution", "group_payout"],
        };
        if (typeMap[typeFilter] && !typeMap[typeFilter].includes(txn.type)) {
          return false;
        }
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
    });
  }, [allTransactions, typeFilter, dateFrom, dateTo]);

  const getTypeBadgeClass = (type: string): string => {
    switch (type) {
      case "deposit":
        return "active";
      case "withdrawal":
        return "overdue";
      case "savings_contribution":
      case "savings_payout":
        return "pending";
      case "group_contribution":
      case "group_payout":
        return "confirmed";
      case "transfer":
        return "paused";
      case "commission":
        return "completed";
      default:
        return "draft";
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "savings_contribution":
        return "Savings";
      case "savings_payout":
        return "Payout";
      case "group_contribution":
        return "Group";
      case "group_payout":
        return "Group Payout";
      case "transfer":
        return "Transfer";
      case "commission":
        return "Commission";
      default:
        return type;
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      case "failed":
        return "overdue";
      default:
        return "draft";
    }
  };

  // Open deposit modal — initialize depositMethodId to first payment method
  const openDepositModal = () => {
    setDepositAmount("");
    setDepositMethodId(paymentMethods[0]?.id ?? "");
    setDepositError("");
    setShowDeposit(true);
  };

  // Open withdraw modal — initialize withdrawMethodId to first payment method
  const openWithdrawModal = () => {
    setWithdrawAmount("");
    setWithdrawMethodId(paymentMethods[0]?.id ?? "");
    setWithdrawError("");
    setShowWithdraw(true);
  };

  const handleDeposit = async () => {
    setDepositError("");
    const amount = Number(depositAmount);
    if (!amount || amount < 100) {
      setDepositError("Minimum deposit amount is \u20A6100.");
      return;
    }
    setDepositSubmitting(true);
    try {
      await walletService.depositToWallet({ amount, channel: "bank_transfer" });
      await Promise.all([refetch(), refetchTransactions()]);
      setShowDeposit(false);
      setDepositAmount("");
      setDepositMethodId("");
    } catch (err) {
      setDepositError(extractApiError(err));
    } finally {
      setDepositSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawError("");
    const amount = Number(withdrawAmount);
    if (!amount || amount < 100) {
      setWithdrawError("Minimum withdrawal amount is \u20A6100.");
      return;
    }
    if (wallet && amount > wallet.realBalance) {
      setWithdrawError("Insufficient balance. You cannot withdraw more than your available balance.");
      return;
    }
    setWithdrawSubmitting(true);
    try {
      await walletService.withdrawFromWallet({ amount, paymentMethodId: withdrawMethodId });
      await Promise.all([refetch(), refetchTransactions()]);
      setShowWithdraw(false);
      setWithdrawAmount("");
      setWithdrawMethodId("");
    } catch (err) {
      setWithdrawError(extractApiError(err));
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  if (walletLoading) {
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
      {/* Page Heading */}
      <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "1.5rem" }}>My Wallet</h2>

      {/* Wallet Cards Row */}
      <div className="row g-4 mb-4">
        {/* Real Wallet */}
        <div className="col-md-6">
          <div className="wallet-detail-card real">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                Real Wallet
              </span>
              <FontAwesomeIcon
                icon={faWallet}
                style={{ fontSize: "32px", color: "rgba(255,255,255,0.3)" }}
              />
            </div>
            <p style={{ fontSize: "36px", fontWeight: 800, color: "#FFFFFF", marginBottom: "20px", lineHeight: 1.1 }}>
              {formatNaira(wallet?.realBalance ?? 0, false)}
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-light btn-sm"
                style={{ fontWeight: 600 }}
                onClick={openDepositModal}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Deposit
              </button>
              <button
                className="btn btn-outline-light btn-sm"
                style={{ fontWeight: 600 }}
                onClick={openWithdrawModal}
              >
                <FontAwesomeIcon icon={faArrowDown} className="me-1" /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Virtual Wallet */}
        <div className="col-md-6">
          <div className="wallet-detail-card virtual">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                Virtual Wallet{" "}
                <span
                  className="info-tooltip"
                  data-tip="Credits from group savings entitlements"
                  style={{ background: "rgba(255,255,255,0.3)", color: "#FFFFFF" }}
                >
                  i
                </span>
              </span>
              <FontAwesomeIcon
                icon={faCoins}
                style={{ fontSize: "32px", color: "rgba(255,255,255,0.3)" }}
              />
            </div>
            <p style={{ fontSize: "36px", fontWeight: 800, color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.1 }}>
              {formatNaira(wallet?.virtualBalance ?? 0, false)}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Converts to real wallet when group savings turn is received
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Payment Methods</h3>
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ fontWeight: 600, borderColor: "#EB5310", color: "#EB5310" }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Account
          </button>
        </div>
        <div className="row g-3" style={{ padding: "24px" }}>
          {paymentMethods.map((pm) => (
            <div className="col-md-4" key={pm.id}>
              <div style={{ border: "1px solid #F1F5F9", borderRadius: "10px", padding: "20px" }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: pm.isDefault ? "#EFF6FF" : "#ECFDF5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBuildingColumns}
                      style={{
                        fontSize: "18px",
                        color: pm.isDefault ? "#3B82F6" : "#10B981",
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#1E252F", margin: 0 }}>
                      {pm.bankName}
                    </p>
                    <span style={{ fontSize: "13px", color: "#64748B" }}>{pm.accountNumber}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: pm.isDefault ? "#059669" : "#94A3B8",
                  }}
                >
                  {pm.isDefault ? "Default" : "Secondary"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Transaction History</h3>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "auto", fontSize: "13px" }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "auto", fontSize: "13px" }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <select
              className="form-select form-select-sm"
              style={{ width: "auto", fontSize: "13px" }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposits">Deposits</option>
              <option value="withdrawals">Withdrawals</option>
              <option value="transfers">Transfers</option>
              <option value="savings">Savings</option>
            </select>
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ fontWeight: 600, fontSize: "13px" }}
            >
              <FontAwesomeIcon icon={faDownload} className="me-1" /> Export
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{formatDate(txn.createdAt)}</td>
                  <td>
                    <strong>{txn.description}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${getTypeBadgeClass(txn.type)}`}>
                      {getTypeLabel(txn.type)}
                    </span>
                  </td>
                  <td>{txn.category}</td>
                  <td className={txn.amount > 0 ? "amount-positive" : "amount-negative"}>
                    {txn.amount > 0 ? "+" : ""}
                    {formatNaira(Math.abs(txn.amount), false)}
                  </td>
                  <td>{formatNaira(txn.balanceAfter, false)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(txn.status)}`}>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px 16px", color: "#94A3B8" }}>
                    No transactions match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== DEPOSIT MODAL ====== */}
      {showDeposit && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
          tabIndex={-1}
          aria-labelledby="depositModalLabel"
          onClick={(e) => {
            if (e.target === e.currentTarget && !depositSubmitting) setShowDeposit(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #F1F5F9", padding: "20px 24px" }}>
                <h5
                  className="modal-title"
                  id="depositModalLabel"
                  style={{ fontWeight: 700, color: "#1E252F" }}
                >
                  Deposit Funds
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowDeposit(false)}
                  disabled={depositSubmitting}
                />
              </div>
              <div className="modal-body" style={{ padding: "24px" }}>
                {depositError && (
                  <div className="alert alert-danger" style={{ fontSize: "14px" }}>
                    {depositError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}>
                    Amount ({"\u20A6"})
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={depositSubmitting}
                    min={100}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}>
                    Payment Method
                  </label>
                  <select
                    className="form-select"
                    value={depositMethodId}
                    onChange={(e) => setDepositMethodId(e.target.value)}
                    disabled={depositSubmitting}
                  >
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.bankName} {pm.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #F1F5F9", padding: "16px 24px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeposit(false)}
                  disabled={depositSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: "#EB5310", borderColor: "#EB5310", fontWeight: 600 }}
                  onClick={handleDeposit}
                  disabled={depositSubmitting}
                >
                  {depositSubmitting ? "Processing..." : "Confirm Deposit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== WITHDRAW MODAL ====== */}
      {showWithdraw && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
          tabIndex={-1}
          aria-labelledby="withdrawModalLabel"
          onClick={(e) => {
            if (e.target === e.currentTarget && !withdrawSubmitting) setShowWithdraw(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #F1F5F9", padding: "20px 24px" }}>
                <h5
                  className="modal-title"
                  id="withdrawModalLabel"
                  style={{ fontWeight: 700, color: "#1E252F" }}
                >
                  Withdraw Funds
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowWithdraw(false)}
                  disabled={withdrawSubmitting}
                />
              </div>
              <div className="modal-body" style={{ padding: "24px" }}>
                {withdrawError && (
                  <div className="alert alert-danger" style={{ fontSize: "14px" }}>
                    {withdrawError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}>
                    Amount ({"\u20A6"})
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    disabled={withdrawSubmitting}
                    min={100}
                  />
                  <small className="text-muted" style={{ fontSize: "13px" }}>
                    Available: {formatNaira(wallet?.realBalance ?? 0, false)}
                  </small>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}>
                    Withdraw To
                  </label>
                  <select
                    className="form-select"
                    value={withdrawMethodId}
                    onChange={(e) => setWithdrawMethodId(e.target.value)}
                    disabled={withdrawSubmitting}
                  >
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.bankName} {pm.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #F1F5F9", padding: "16px 24px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWithdraw(false)}
                  disabled={withdrawSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: "#EB5310", borderColor: "#EB5310", fontWeight: 600 }}
                  onClick={handleWithdraw}
                  disabled={withdrawSubmitting}
                >
                  {withdrawSubmitting ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
