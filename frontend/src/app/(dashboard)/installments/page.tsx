"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faMoneyBillWave,
  faClockRotateLeft,
  faCircleCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useInstallments } from "@/hooks/useInstallments";
import { useInstallmentPayment } from "@/hooks/useInstallmentPayment";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { InstallmentPlanStatus } from "@/types";

type FilterStatus = "all" | InstallmentPlanStatus;

export default function InstallmentsPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const { plans, isLoading, refetch } = useInstallments(
    statusFilter !== "all" ? { status: statusFilter } : undefined,
  );
  const { pay, isProcessing } = useInstallmentPayment();

  const handlePayNow = async (planId: string) => {
    const result = await pay(planId);
    if (result) refetch();
  };

  // Summary stats
  const activePlans = plans.filter((p) => p.status === "active" || p.status === "overdue");
  const totalOwed = activePlans.reduce((sum, p) => sum + p.amountRemaining, 0);
  const nextDue = activePlans
    .filter((p) => p.nextPaymentDueAt)
    .sort((a, b) => new Date(a.nextPaymentDueAt!).getTime() - new Date(b.nextPaymentDueAt!).getTime())[0];

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];

  function getStatusBadgeClass(status: string) {
    if (status === "completed") return "status-badge completed";
    if (status === "overdue" || status === "defaulted") return "status-badge overdue";
    if (status === "cancelled") return "status-badge cancelled";
    return "status-badge active";
  }

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E252F", marginBottom: 24 }}>
        My Installments
      </h2>

      {/* Summary Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#EB5310", marginBottom: 8 }}>
              <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: 22 }} />
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Active Plans</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1E252F", margin: 0 }}>
              {activePlans.length}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#EF4444", marginBottom: 8 }}>
              <FontAwesomeIcon icon={faMoneyBillWave} style={{ fontSize: 22 }} />
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Total Owed</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1E252F", margin: 0 }}>
              {formatNaira(totalOwed, false)}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#F59E0B", marginBottom: 8 }}>
              <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: 22 }} />
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Next Due</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1E252F", margin: 0 }}>
              {nextDue?.nextPaymentDueAt ? formatDate(nextDue.nextPaymentDueAt) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`quick-action-btn ${statusFilter === f.value ? "primary" : "outline"}`}
            style={{ fontSize: 13, padding: "6px 16px" }}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="d-flex justify-content-center" style={{ padding: "60px 0" }}>
          <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Plans */}
      {!isLoading && plans.length > 0 && (
        <div className="row g-4">
          {plans.map((plan) => {
            const listing = plan.order?.listing;
            const vendor = plan.order?.vendor;
            const isOverdue = plan.status === "overdue";
            const isDone = plan.status === "completed";

            return (
              <div key={plan.id} className="col-lg-6">
                <div className={`installment-plan-card-page ${isOverdue ? "overdue" : ""} ${isDone ? "completed" : ""}`}>
                  <div className="d-flex gap-3">
                    {/* Image */}
                    <div className="installment-card-img">
                      {listing?.primaryImage ? (
                        <img src={listing.primaryImage} alt={listing.title} />
                      ) : (
                        <div className="installment-card-img-placeholder">
                          {listing?.category === "property" ? "\uD83C\uDFE0"
                            : listing?.category === "automotive" ? "\uD83D\uDE97" : "\uD83D\uDCE6"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                        <h5 className="installment-card-title">{listing?.title || "Item"}</h5>
                        <span className={getStatusBadgeClass(plan.status)}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>
                      {vendor && (
                        <p style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>
                          {vendor.firstName} {vendor.lastName}
                        </p>
                      )}

                      {/* Progress */}
                      <div className="installment-card-progress">
                        <div className="installment-card-progress-bar">
                          <div
                            className="installment-card-progress-fill"
                            style={{
                              width: `${plan.progressPercent}%`,
                              background: isOverdue ? "#EF4444" : isDone ? "#059669" : "#EB5310",
                            }}
                          />
                        </div>
                        <span className="installment-card-progress-text">
                          {plan.paymentsCompleted}/{plan.numberOfPayments} payments ({plan.progressPercent}%)
                        </span>
                      </div>

                      {/* Amounts */}
                      <div className="installment-card-amounts">
                        <div>
                          <span className="installment-card-amount-label">Monthly</span>
                          <span className="installment-card-amount-value">{formatNaira(plan.monthlyAmount, false)}</span>
                        </div>
                        <div>
                          <span className="installment-card-amount-label">Remaining</span>
                          <span className="installment-card-amount-value">{formatNaira(plan.amountRemaining, false)}</span>
                        </div>
                        {plan.nextPaymentDueAt && !isDone && (
                          <div>
                            <span className="installment-card-amount-label">Next Due</span>
                            <span className={`installment-card-amount-value ${isOverdue ? "text-danger" : ""}`}>
                              {formatDate(plan.nextPaymentDueAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="installment-card-actions">
                        <Link
                          href={`/installments/${plan.id}`}
                          className="quick-action-btn outline"
                          style={{ fontSize: 12, padding: "5px 12px" }}
                        >
                          View Details
                        </Link>
                        {(plan.status === "active" || plan.status === "overdue") && (
                          <button
                            className="quick-action-btn primary"
                            style={{ fontSize: 12, padding: "5px 12px" }}
                            onClick={() => handlePayNow(plan.id)}
                            disabled={isProcessing}
                          >
                            {isOverdue && <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 4 }} />}
                            {isProcessing ? "Processing..." : "Pay Now"}
                          </button>
                        )}
                        {isDone && (
                          <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faCircleCheck} /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && plans.length === 0 && (
        <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FontAwesomeIcon
            icon={faCalendarCheck}
            style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16 }}
          />
          <h4 style={{ color: "#334155", fontWeight: 700, marginBottom: 8 }}>
            No installment plans yet
          </h4>
          <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>
            Browse the marketplace and choose &quot;Pay in Installments&quot; on eligible items.
          </p>
          <Link href="/marketplace" className="quick-action-btn primary">
            Browse Marketplace
          </Link>
        </div>
      )}
    </>
  );
}
