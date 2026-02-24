"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faCalendarCheck,
  faCheck,
  faClock,
  faExclamationTriangle,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { useInstallmentPlan } from "@/hooks/useInstallmentPlan";
import { useInstallmentPayment } from "@/hooks/useInstallmentPayment";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function InstallmentDetailPage() {
  const params = useParams();
  const planId = params.id as string;
  const { plan, isLoading, refetch } = useInstallmentPlan(planId);
  const { pay, isProcessing } = useInstallmentPayment();

  const handlePayNow = async () => {
    const result = await pay(planId);
    if (result) refetch();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h4 style={{ color: "#334155", fontWeight: 700 }}>Plan not found</h4>
        <p style={{ color: "#64748B", fontSize: 14 }}>
          The installment plan you are looking for does not exist.
        </p>
        <Link href="/installments" className="quick-action-btn primary">View All Plans</Link>
      </div>
    );
  }

  const listing = plan.order?.listing;
  const vendor = plan.order?.vendor;
  const isOverdue = plan.status === "overdue";
  const isDone = plan.status === "completed";
  const payments = plan.payments || [];

  function getPaymentStatusIcon(status: string) {
    if (status === "paid") return <FontAwesomeIcon icon={faCheck} style={{ color: "#059669" }} />;
    if (status === "overdue") return <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#EF4444" }} />;
    return <FontAwesomeIcon icon={faClock} style={{ color: "#94A3B8" }} />;
  }

  function getPaymentRowClass(status: string) {
    if (status === "overdue") return "installment-payment-row overdue";
    if (status === "paid") return "installment-payment-row paid";
    return "installment-payment-row";
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="dashboard-breadcrumb">
        <Link href="/dashboard">Dashboard</Link>
        <span className="separator"><FontAwesomeIcon icon={faChevronRight} /></span>
        <Link href="/installments">Installments</Link>
        <span className="separator"><FontAwesomeIcon icon={faChevronRight} /></span>
        <span className="current">{listing?.title || "Plan Details"}</span>
      </div>

      {/* Plan Summary */}
      <div className="dash-card mb-4">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          {/* Image */}
          {listing?.primaryImage && (
            <img
              src={listing.primaryImage}
              alt={listing.title}
              style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 10 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1E252F", margin: 0 }}>
                {listing?.title || "Installment Plan"}
              </h3>
              <span className={`status-badge ${plan.status}`}>
                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
              </span>
            </div>
            {vendor && (
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>
                Sold by {vendor.firstName} {vendor.lastName}
              </p>
            )}
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
              Ref: {plan.order?.reference || "—"} &middot; Started {formatDate(plan.createdAt)}
            </p>
          </div>
          {(plan.status === "active" || plan.status === "overdue") && (
            <button
              className="quick-action-btn primary"
              style={{ flexShrink: 0 }}
              onClick={handlePayNow}
              disabled={isProcessing}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} />{" "}
              {isProcessing ? "Processing..." : "Make Payment"}
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Total Cost</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#1E252F", margin: 0 }}>
              {formatNaira(plan.totalAmount, false)}
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Upfront Paid</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#059669", margin: 0 }}>
              {formatNaira(plan.upfrontAmount, false)}
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Monthly</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#1E252F", margin: 0 }}>
              {formatNaira(plan.monthlyAmount, false)}
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Progress</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: isOverdue ? "#EF4444" : isDone ? "#059669" : "#EB5310", margin: 0 }}>
              {plan.paymentsCompleted}/{plan.numberOfPayments}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="dash-card mb-4">
        <h4 className="card-title" style={{ marginBottom: 16 }}>Payment Progress</h4>
        <div style={{ background: "#F1F5F9", borderRadius: 8, height: 12, overflow: "hidden", marginBottom: 12 }}>
          <div
            style={{
              width: `${plan.progressPercent}%`,
              height: "100%",
              background: isOverdue ? "#EF4444" : isDone ? "#059669" : "#EB5310",
              borderRadius: 8,
              transition: "width 0.3s",
            }}
          />
        </div>
        <div className="d-flex justify-content-between" style={{ fontSize: 13, color: "#64748B" }}>
          <span>{plan.progressPercent}% complete</span>
          <span>{formatNaira(plan.amountRemaining, false)} remaining</span>
        </div>
        {plan.markupPercent > 0 && (
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8, marginBottom: 0 }}>
            Includes {plan.markupPercent}% markup ({formatNaira(plan.markupAmount, false)})
          </p>
        )}
      </div>

      {/* Payment Schedule */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Payment Schedule</h3>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className={getPaymentRowClass(payment.status)}>
                  <td>{payment.paymentNumber}</td>
                  <td style={{ fontWeight: 600 }}>{formatNaira(payment.amount, false)}</td>
                  <td>{formatDate(payment.dueDate)}</td>
                  <td>
                    <span className="d-flex align-items-center gap-1">
                      {getPaymentStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ color: payment.paidAt ? "#1E252F" : "#CBD5E1" }}>
                    {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px 16px", color: "#94A3B8" }}>
                    No payment records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
