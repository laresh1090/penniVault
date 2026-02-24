"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faLocationDot,
  faUsers,
  faClock,
  faSeedling,
  faBuilding,
  faGlobe,
  faBox,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import { useVendorInvestments } from "@/hooks/useVendorInvestments";
import { useMutateInvestment } from "@/hooks/useMutateInvestment";
import { formatNaira, formatPercentage } from "@/lib/formatters";
import type { InvestmentCategory, InvestmentStatus } from "@/types";

export default function VendorInvestmentsPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<InvestmentCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<InvestmentStatus | "all">("all");

  const { investments, isLoading, refetch } = useVendorInvestments({
    category: categoryFilter,
    status: statusFilter,
  });
  const { deleteInvestment, isSubmitting } = useMutateInvestment();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investment opportunity?")) return;
    const ok = await deleteInvestment(id);
    if (ok) refetch();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "agriculture":
        return faSeedling;
      case "real_estate":
        return faBuilding;
      case "technology":
        return faGlobe;
      default:
        return faBox;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "agriculture":
        return "Agriculture";
      case "real_estate":
        return "Real Estate";
      case "technology":
        return "Technology";
      default:
        return "Other";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return { bg: "#ECFDF5", color: "#059669" };
      case "funded":
        return { bg: "#EFF6FF", color: "#3B82F6" };
      case "in_progress":
        return { bg: "#FFF8EB", color: "#F59E0B" };
      case "matured":
        return { bg: "#F0FDF4", color: "#16A34A" };
      case "cancelled":
        return { bg: "#FEF2F2", color: "#DC2626" };
      default:
        return { bg: "#F1F5F9", color: "#64748B" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "funded":
        return "Funded";
      case "in_progress":
        return "In Progress";
      case "matured":
        return "Matured";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
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

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E252F", marginBottom: 4 }}>
            Investment Opportunities
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Manage your crowd investment listings
          </p>
        </div>
        <button
          className="quick-action-btn primary"
          onClick={() => router.push("/vendor/investments/new")}
        >
          <FontAwesomeIcon icon={faPlus} /> Create Investment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dash-card mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap" style={{ padding: "16px 24px" }}>
          <FontAwesomeIcon icon={faFilter} style={{ color: "#64748B", fontSize: 14 }} />
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as InvestmentCategory | "all")}
          >
            <option value="all">All Categories</option>
            <option value="agriculture">Agriculture</option>
            <option value="real_estate">Real Estate</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvestmentStatus | "all")}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="funded">Funded</option>
            <option value="in_progress">In Progress</option>
            <option value="matured">Matured</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            {investments.length} investment{investments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Investment Cards Grid */}
      {investments.length === 0 ? (
        <div className="dash-card">
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <FontAwesomeIcon
              icon={faSeedling}
              style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16, display: "block" }}
            />
            <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1E252F", marginBottom: 8 }}>
              No investment opportunities yet
            </h4>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
              Create your first crowd investment opportunity to attract investors.
            </p>
            <button
              className="quick-action-btn primary"
              onClick={() => router.push("/vendor/investments/new")}
            >
              <FontAwesomeIcon icon={faPlus} /> Create Investment
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {investments.map((inv) => {
            const progress =
              inv.targetAmount > 0
                ? Math.min((inv.raisedAmount / inv.targetAmount) * 100, 100)
                : 0;
            const statusStyle = getStatusColor(inv.status);

            return (
              <div className="col-xl-4 col-md-6" key={inv.id}>
                <div className="dash-card" style={{ height: "100%" }}>
                  <div style={{ padding: "20px 24px" }}>
                    {/* Title & Category */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#1E252F",
                            marginBottom: 6,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={inv.title}
                        >
                          {inv.title}
                        </h5>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#EB5310",
                            background: "#FFF3EE",
                            padding: "4px 10px",
                            borderRadius: 20,
                          }}
                        >
                          <FontAwesomeIcon icon={getCategoryIcon(inv.category)} />
                          {getCategoryLabel(inv.category)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 20,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}
                      >
                        {getStatusLabel(inv.status)}
                      </span>
                    </div>

                    {/* Location */}
                    <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>
                      <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6 }} />
                      {inv.location}
                    </p>

                    {/* Target & Raised */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between" style={{ fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: "#64748B" }}>
                          Raised: <strong style={{ color: "#1E252F" }}>{formatNaira(inv.raisedAmount, false)}</strong>
                        </span>
                        <span style={{ color: "#64748B" }}>
                          Target: <strong style={{ color: "#1E252F" }}>{formatNaira(inv.targetAmount, false)}</strong>
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 8,
                          background: "#F1F5F9",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: progress >= 100 ? "#059669" : "#EB5310",
                            borderRadius: 4,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, marginBottom: 0 }}>
                        {progress.toFixed(0)}% funded
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        fontSize: 13,
                        color: "#64748B",
                        padding: "12px 0",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9",
                        marginBottom: 16,
                      }}
                    >
                      <span title="Expected ROI">
                        <strong style={{ color: "#059669" }}>{formatPercentage(inv.expectedReturnPercent)}</strong> ROI
                      </span>
                      <span title="Duration">
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: 4 }} />
                        {inv.durationDays} days
                      </span>
                      <span title="Investors">
                        <FontAwesomeIcon icon={faUsers} style={{ marginRight: 4 }} />
                        {inv.investorsCount}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary flex-fill"
                        onClick={() => router.push(`/vendor/investments/${inv.id}/edit`)}
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(inv.id)}
                        disabled={isSubmitting}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
