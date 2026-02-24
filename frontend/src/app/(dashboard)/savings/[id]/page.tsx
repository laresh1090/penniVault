"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPlus,
  faPause,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useSavingsPlan } from "@/hooks";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function SavingsPlanDetailPage() {
  const params = useParams();
  const planId = params.id as string;

  const { plan, isLoading } = useSavingsPlan(planId);

  // Cast to include optional detail fields that may not exist on SavingsPlan
  const planDetail = plan as (typeof plan & {
    linkedAsset?: { title: string; category: string; vendorName: string; price: number; imageUrl?: string };
    transactions?: { id: string; date: string; amount: number; type: string }[];
  }) | null;

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border text-primary" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!planDetail) {
    return (
      <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h4 style={{ color: "#334155", fontWeight: 700 }}>Plan not found</h4>
        <p style={{ color: "#64748B", fontSize: 14 }}>
          The savings plan you are looking for does not exist or has been removed.
        </p>
        <Link href="/savings" className="quick-action-btn primary">View All Plans</Link>
      </div>
    );
  }

  const percentage = planDetail.targetAmount > 0
    ? Math.min(100, Math.round((planDetail.currentAmount / planDetail.targetAmount) * 100))
    : 0;

  const isTargetSave = planDetail.productType === "targetsave";
  const isPenniLock = planDetail.productType === "pennilock";
  const isPenniSave = planDetail.productType === "pennisave";

  const productLabels: Record<string, string> = {
    pennisave: "PenniSave",
    pennilock: "PenniLock",
    targetsave: "TargetSave",
    penniajo: "PenniAjo",
  };
  const productColors: Record<string, string> = {
    pennisave: "#3B82F6",
    pennilock: "#10B981",
    targetsave: "#8B5CF6",
    penniajo: "#EB5310",
  };
  const accentColor = productColors[planDetail.productType] ?? "#EB5310";

  const daysRemaining = planDetail.endDate
    ? Math.max(0, Math.ceil((new Date(planDetail.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="dashboard-breadcrumb">
        <Link href="/dashboard">Dashboard</Link>
        <span className="separator"><FontAwesomeIcon icon={faChevronRight} /></span>
        <Link href={`/savings?type=${planDetail.productType}`}>
          {productLabels[planDetail.productType] ?? "Savings Plans"}
        </Link>
        <span className="separator"><FontAwesomeIcon icon={faChevronRight} /></span>
        <span className="current">{planDetail.name}</span>
      </div>

      {/* Plan Header Card */}
      <div className="dash-card mb-4">
        <div className="plan-header">
          <div className="plan-header-info">
            <h2 className="plan-title">
              {planDetail.name}
              <span className={`status-badge ${planDetail.status}`}>
                {planDetail.status.charAt(0).toUpperCase() + planDetail.status.slice(1)}
              </span>
            </h2>
            <p className="plan-desc">
              {productLabels[planDetail.productType] ?? "Savings"} &middot; Started {formatDate(planDetail.startDate)}
              {isTargetSave && daysRemaining !== null && daysRemaining > 0 && (
                <> &middot; {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} to target date</>
              )}
            </p>
          </div>
          <div className="plan-header-actions">
            {(isTargetSave || isPenniSave) && planDetail.status === "active" && (
              <button className="quick-action-btn primary" style={{ background: accentColor, borderColor: accentColor }}>
                <FontAwesomeIcon icon={faPlus} /> Add Funds
              </button>
            )}
            {isPenniSave && planDetail.status === "active" && (
              <button className="quick-action-btn secondary">
                <FontAwesomeIcon icon={faPause} /> Pause
              </button>
            )}
            {!isPenniLock && planDetail.status === "active" && (
              <button className="quick-action-btn outline">
                <FontAwesomeIcon icon={faPenToSquare} /> Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row: Progress, Details, Saving Towards */}
      <div className="row g-4 mb-4">
        {/* Col 1: Progress Circle */}
        <div className="col-md-4">
          <div className="dash-card" style={{ textAlign: "center" }}>
            <h3 className="card-title" style={{ marginBottom: 20 }}>Progress</h3>
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(${accentColor} 0% ${percentage}%, #E2E8F0 ${percentage}% 100%)`,
              }}
            >
              <div className="progress-circle-inner">
                <span className="percent">{percentage}%</span>
                <span className="label">Completed</span>
              </div>
            </div>
            <div className="progress-amounts">
              <p className="saved">{formatNaira(planDetail.currentAmount, false)}</p>
              <p className="target">of {formatNaira(planDetail.targetAmount, false)}</p>
            </div>
          </div>
        </div>

        {/* Col 2: Plan Details */}
        <div className="col-md-4">
          <div className="dash-card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Plan Details</h3>
            <div className="detail-row">
              <span className="detail-label">Plan Type</span>
              <span className="detail-value" style={{ color: accentColor, fontWeight: 700 }}>
                {productLabels[planDetail.productType] ?? "Savings"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Target Amount</span>
              <span className="detail-value">{formatNaira(planDetail.targetAmount, false)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{planDetail.frequency} Contribution</span>
              <span className="detail-value">{formatNaira(planDetail.contributionAmount, false)}</span>
            </div>
            {planDetail.interestRate !== undefined && (
              <div className="detail-row">
                <span className="detail-label">Interest Option</span>
                <span className="detail-value" style={{ color: "#059669" }}>
                  Enabled {planDetail.interestRate}% p.a.
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Start Date</span>
              <span className="detail-value">{formatDate(planDetail.startDate)}</span>
            </div>
            {planDetail.endDate && (
            <div className="detail-row">
              <span className="detail-label">
                {isTargetSave ? "Target Date" : isPenniLock ? "Maturity Date" : "End Date"}
              </span>
              <span className="detail-value">
                {formatDate(planDetail.endDate)}
                {daysRemaining !== null && daysRemaining > 0 && (
                  <span style={{ color: "#64748B", fontSize: 12, marginLeft: 6 }}>
                    ({daysRemaining}d left)
                  </span>
                )}
              </span>
            </div>
            )}
          </div>
        </div>

        {/* Col 3: Saving Towards / Plan Info */}
        <div className="col-md-4">
          <div className="dash-card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              {isTargetSave ? "Saving Towards" : "Summary"}
            </h3>
            {isTargetSave && planDetail.linkedAsset ? (
              <>
                <img
                  src={planDetail.linkedAsset.imageUrl || "/images/listings/property-1.jpg"}
                  alt={planDetail.linkedAsset.title}
                  className="saving-towards-img"
                />
                <p className="saving-towards-title">{planDetail.linkedAsset.title}</p>
                <p className="saving-towards-meta">
                  {planDetail.linkedAsset.category} &middot; Listed by {planDetail.linkedAsset.vendorName}
                </p>
                <p className="saving-towards-price">{formatNaira(planDetail.linkedAsset.price, false)}</p>
              </>
            ) : (
              <div style={{ padding: "16px 0" }}>
                {planDetail.description && (
                  <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16, lineHeight: 1.6 }}>
                    {planDetail.description}
                  </p>
                )}
                {planDetail.accruedInterest > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Interest Earned</span>
                    <span className="detail-value" style={{ color: "#059669", fontWeight: 700 }}>
                      +{formatNaira(planDetail.accruedInterest, false)}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Total Balance</span>
                  <span className="detail-value" style={{ fontWeight: 800, fontSize: 16 }}>
                    {formatNaira(planDetail.currentAmount + planDetail.accruedInterest, false)}
                  </span>
                </div>
                {isTargetSave && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#94A3B8", fontSize: 13 }}>
                    <p style={{ margin: 0 }}>No linked marketplace item</p>
                    <Link href="/marketplace" style={{ color: accentColor, fontWeight: 600, fontSize: 13 }}>
                      Browse marketplace
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Transactions */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Plan Transactions</h3>
          <a href="#" className="card-action">View All</a>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {planDetail.transactions ? planDetail.transactions.map((txn) => {
                const typeLabel = txn.type
                  .split("_")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                return (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.date)}</td>
                    <td>{typeLabel}</td>
                    <td className="amount-positive">+{formatNaira(txn.amount, false)}</td>
                    <td>{formatNaira(txn.amount, false)}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px 16px", color: "#94A3B8" }}>
                    No transactions yet
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
