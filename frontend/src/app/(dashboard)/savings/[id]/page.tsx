"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faArrowUp,
  faPause,
  faEdit,
  faHouseChimney,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import DashCard from "@/components/ui/DashCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressCircle from "@/components/ui/ProgressCircle";
import DetailRow from "@/components/ui/DetailRow";
import DataTable from "@/components/ui/DataTable";
import { mockSavingsPlanDetail } from "@/data/dashboard";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function SavingsPlanDetailPage() {
  const params = useParams();
  const planId = params.id as string;

  // Check if the plan exists
  const plan = mockSavingsPlanDetail.id === planId ? mockSavingsPlanDetail : null;

  if (!plan) {
    return (
      <div>
        <Link
          href="/savings"
          className="d-inline-flex align-items-center gap-2 mb-4"
          style={{
            color: "#EB5310",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 12 }} />
          Back to Savings Plans
        </Link>
        <div
          className="card p-5 text-center"
          style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
        >
          <h4 style={{ color: "#334155", fontWeight: 700 }}>Plan not found</h4>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            The savings plan you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/savings"
            className="btn btn-sm"
            style={{
              backgroundColor: "#EB5310",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              display: "inline-block",
              width: "auto",
              margin: "0 auto",
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            View All Plans
          </Link>
        </div>
      </div>
    );
  }

  const percentage = Math.round(
    (plan.currentAmount / plan.targetAmount) * 100
  );

  const statusForBadge = plan.status as
    | "active"
    | "completed"
    | "paused"
    | "pending";

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "property":
        return faHouseChimney;
      case "automotive":
        return faCar;
      default:
        return faHouseChimney;
    }
  };

  const transactionColumns = [
    {
      key: "date",
      header: "Date",
      render: (item: Record<string, unknown>) =>
        formatDate(item.date as string),
    },
    {
      key: "type",
      header: "Type",
      render: (item: Record<string, unknown>) => {
        const type = item.type as string;
        const label = type
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        const colorMap: Record<string, string> = {
          contribution: "#3B82F6",
          bonus_deposit: "#22C55E",
          interest: "#F59E0B",
          withdrawal: "#EF4444",
        };
        const bgMap: Record<string, string> = {
          contribution: "#EFF6FF",
          bonus_deposit: "#F0FDF4",
          interest: "#FFFBEB",
          withdrawal: "#FEF2F2",
        };
        return (
          <span
            style={{
              backgroundColor: bgMap[type] || "#F1F5F9",
              color: colorMap[type] || "#64748B",
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: Record<string, unknown>) => (
        <span style={{ fontWeight: 600, color: "#22C55E" }}>
          +{formatNaira(item.amount as number, false)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Record<string, unknown>) => {
        const status = item.status as string;
        return (
          <StatusBadge
            status={status as "active" | "completed" | "pending" | "paused"}
          />
        );
      },
    },
  ];

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/savings"
        className="d-inline-flex align-items-center gap-2 mb-4"
        style={{
          color: "#EB5310",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 12 }} />
        Back to Savings Plans
      </Link>

      {/* Plan Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            {plan.name}
          </h2>
          <StatusBadge status={statusForBadge} />
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: "#EB5310",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: 6 }} />
            Add Funds
          </button>
          {plan.status === "active" && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
            >
              <FontAwesomeIcon icon={faPause} style={{ marginRight: 6 }} />
              Pause
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
          >
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: 6 }} />
            Edit
          </button>
        </div>
      </div>

      {/* Description */}
      {plan.description && (
        <p
          style={{
            fontSize: 14,
            color: "#64748B",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {plan.description}
        </p>
      )}

      {/* Three-column Layout */}
      <div className="row g-4 mb-4">
        {/* Col 1: Progress Circle */}
        <div className="col-lg-4">
          <div
            className="card h-100"
            style={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
            }}
          >
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
              <ProgressCircle
                percentage={percentage}
                size={160}
                strokeWidth={10}
                color={percentage >= 100 ? "#22C55E" : "#EB5310"}
                label="saved"
              />
              <div className="text-center mt-3">
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1E293B",
                    margin: 0,
                  }}
                >
                  {formatNaira(plan.currentAmount, false)}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    margin: 0,
                  }}
                >
                  of {formatNaira(plan.targetAmount, false)} target
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Plan Details */}
        <div className="col-lg-4">
          <div
            className="card h-100"
            style={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
            }}
          >
            <div className="card-body p-4">
              <h6
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1E293B",
                  marginBottom: 16,
                }}
              >
                Plan Details
              </h6>
              <div className="d-flex flex-column gap-2">
                <DetailRow label="Frequency" value={plan.frequency} />
                <DetailRow
                  label="Contribution Amount"
                  value={formatNaira(plan.contributionAmount, false)}
                />
                {plan.interestRate !== undefined && (
                  <DetailRow
                    label="Interest Rate"
                    value={`${plan.interestRate}%`}
                  />
                )}
                <DetailRow
                  label="Start Date"
                  value={formatDate(plan.startDate)}
                />
                <DetailRow
                  label="End Date"
                  value={formatDate(plan.endDate)}
                />
                <DetailRow
                  label="Total Contributed"
                  value={formatNaira(plan.currentAmount, false)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Linked Asset */}
        <div className="col-lg-4">
          {plan.linkedAsset ? (
            <div
              className="card h-100 linked-asset-card"
              style={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 140,
                  backgroundColor: "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={getCategoryIcon(plan.linkedAsset.category)}
                  style={{ fontSize: 48, color: "#94A3B8" }}
                />
              </div>
              <div className="card-body p-4">
                <h6
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1E293B",
                    marginBottom: 4,
                  }}
                >
                  {plan.linkedAsset.title}
                </h6>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    marginBottom: 12,
                  }}
                >
                  by {plan.linkedAsset.vendorName}
                </p>
                <div className="d-flex flex-column gap-2">
                  <DetailRow
                    label="Price"
                    value={formatNaira(plan.linkedAsset.price, false)}
                  />
                  <DetailRow
                    label="Category"
                    value={plan.linkedAsset.category}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card h-100"
              style={{
                borderRadius: 12,
                border: "1px dashed #CBD5E1",
              }}
            >
              <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
                <FontAwesomeIcon
                  icon={faHouseChimney}
                  style={{ fontSize: 36, color: "#CBD5E1", marginBottom: 12 }}
                />
                <p
                  style={{
                    fontSize: 14,
                    color: "#94A3B8",
                    margin: 0,
                  }}
                >
                  No linked asset
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#CBD5E1",
                    marginTop: 4,
                  }}
                >
                  Link an asset from the marketplace to track your goal
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Transactions Table */}
      <DashCard title="Plan Transactions">
        <DataTable
          columns={transactionColumns}
          data={
            plan.transactions as unknown as Record<string, unknown>[]
          }
          emptyMessage="No transactions yet for this plan."
        />
      </DashCard>
    </div>
  );
}
