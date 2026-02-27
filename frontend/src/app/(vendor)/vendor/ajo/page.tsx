"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPeopleGroup,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import { vendorService } from "@/services/vendor.service";
import { formatNaira } from "@/lib/formatters";
import type { GroupSavings, GroupSavingsStatus } from "@/types";

export default function VendorAjoPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupSavings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<GroupSavingsStatus | "all">("all");

  useEffect(() => {
    vendorService
      .getMyVendorAjoGroups()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = statusFilter === "all" ? groups : groups.filter((g) => g.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "#ECFDF5", color: "#059669" };
      case "pending":
        return { bg: "#FFF8EB", color: "#F59E0B" };
      case "completed":
        return { bg: "#EFF6FF", color: "#3B82F6" };
      default:
        return { bg: "#F1F5F9", color: "#64748B" };
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
            PenniAjo Groups
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Manage your vendor ajo groups linked to your listings
          </p>
        </div>
        <button
          className="quick-action-btn primary"
          onClick={() => router.push("/vendor/ajo/new")}
        >
          <FontAwesomeIcon icon={faPlus} /> Create Ajo
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dash-card mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap" style={{ padding: "16px 24px" }}>
          <FontAwesomeIcon icon={faFilter} style={{ color: "#64748B", fontSize: 14 }} />
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as GroupSavingsStatus | "all")}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            {filtered.length} group{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Group Cards */}
      {filtered.length === 0 ? (
        <div className="dash-card">
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <FontAwesomeIcon
              icon={faPeopleGroup}
              style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16, display: "block" }}
            />
            <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1E252F", marginBottom: 8 }}>
              No ajo groups yet
            </h4>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
              Create your first vendor ajo to help customers save towards your products.
            </p>
            <button
              className="quick-action-btn primary"
              onClick={() => router.push("/vendor/ajo/new")}
            >
              <FontAwesomeIcon icon={faPlus} /> Create Ajo
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((group) => {
            const slotProgress = Math.round((group.filledSlots / group.totalSlots) * 100);
            const statusStyle = getStatusColor(group.status);

            return (
              <div className="col-xl-4 col-md-6" key={group.id}>
                <div className="dash-card" style={{ height: "100%" }}>
                  <div style={{ padding: "20px 24px" }}>
                    {/* Name & Status */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#1E252F",
                          marginBottom: 0,
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={group.name}
                      >
                        {group.name}
                      </h5>
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
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </span>
                    </div>

                    {/* Linked Product */}
                    {group.listing && (
                      <div className="d-flex align-items-center gap-2 mb-3" style={{ padding: "8px 12px", background: "#F8FAFC", borderRadius: 8 }}>
                        {group.listing.primaryImage && (
                          <img
                            src={group.listing.primaryImage}
                            alt={group.listing.title}
                            style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#1E252F", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {group.listing.title}
                          </p>
                          <p style={{ fontSize: 12, color: "#EB5310", fontWeight: 600, margin: 0 }}>
                            {formatNaira(group.listing.price, false)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                      <span style={{ color: "#64748B" }}>Contribution</span>
                      <strong>{formatNaira(group.contributionAmount, false)}/{group.frequency}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                      <span style={{ color: "#64748B" }}>Slots</span>
                      <strong>{group.filledSlots} / {group.totalSlots}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: 13 }}>
                      <span style={{ color: "#64748B" }}>Cycle</span>
                      <strong>{group.currentRound} of {group.totalRounds}</strong>
                    </div>

                    {/* Slot Progress */}
                    <div
                      style={{
                        width: "100%",
                        height: 6,
                        background: "#F1F5F9",
                        borderRadius: 3,
                        overflow: "hidden",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: `${slotProgress}%`,
                          height: "100%",
                          background: slotProgress >= 100 ? "#059669" : "#EB5310",
                          borderRadius: 3,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>
                      {slotProgress}% slots filled
                    </p>

                    {/* Action */}
                    <Link
                      href={`/savings/groups/${group.id}`}
                      className="quick-action-btn primary d-flex justify-content-center"
                      style={{ fontSize: 13, padding: "8px 16px", width: "100%" }}
                    >
                      View Details
                    </Link>
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
