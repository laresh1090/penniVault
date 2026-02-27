"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { savingsService } from "@/services/savings.service";
import { useAuth } from "@/contexts/auth-context";
import type { GroupSavings } from "@/types";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function GroupSavingsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupSavings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    savingsService
      .getUserGroupSavings()
      .then((data) => {
        setGroups(data);
      })
      .catch(() => {
        setGroups([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Group Savings</h2>
        <Link href="#" className="quick-action-btn primary" style={{ fontSize: 13, padding: "8px 16px" }}>
          <FontAwesomeIcon icon={faPeopleGroup} /> Join a Group
        </Link>
      </div>

      {/* Group Cards */}
      <div className="row g-4">
        {groups.length === 0 ? (
          <div className="col-12">
            <div className="dash-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>
                You are not a member of any group savings yet.
              </p>
            </div>
          </div>
        ) : (
          groups.map((group) => {
            const poolSize = group.contributionAmount * group.filledSlots;
            const roundProgress = Math.round((group.currentRound / group.totalRounds) * 100);
            const userMember = group.members.find((m) => m.userId === user?.id);
            return (
              <div key={group.id} className="col-md-6">
                <div className="dash-card h-100">
                  {/* Group Name + Status + Mode */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{group.name}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: 13, color: "#64748B" }}>{group.filledSlots} Members</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: group.mode === "vendor" ? "#EDE9FE" : "#E0F2FE",
                            color: group.mode === "vendor" ? "#7C3AED" : "#0284C7",
                          }}
                        >
                          {group.mode === "vendor" ? "Vendor Ajo" : "Peer Ajo"}
                        </span>
                      </div>
                    </div>
                    <span className={`status-badge ${group.status}`}>
                      {group.status === "active" ? "Active" : group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                    </span>
                  </div>

                  {/* Vendor Product Info */}
                  {group.mode === "vendor" && group.listing && (
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ padding: "8px 12px", background: "#F8FAFC", borderRadius: 8 }}>
                      {group.listing.primaryImage && (
                        <img
                          src={group.listing.primaryImage}
                          alt={group.listing.title}
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
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

                  {/* Description */}
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.5 }}>
                    {group.description}
                  </p>

                  {/* Stats */}
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                    <span style={{ color: "#64748B" }}>Total Pool</span>
                    <strong>{formatNaira(poolSize, false)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                    <span style={{ color: "#64748B" }}>Contribution</span>
                    <strong>{formatNaira(group.contributionAmount, false)}/{group.frequency}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                    <span style={{ color: "#64748B" }}>Next Payout</span>
                    <strong>{formatDate(group.nextPayoutDate)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3" style={{ fontSize: 13 }}>
                    <span style={{ color: "#64748B" }}>Your Position</span>
                    <strong style={{ color: "#EB5310" }}>#{userMember?.position ?? "—"}</strong>
                  </div>

                  {/* Progress Bar */}
                  <div className="savings-progress mb-2">
                    <div className="progress-fill" style={{ width: `${roundProgress}%` }}></div>
                  </div>
                  <div className="d-flex justify-content-between mb-3" style={{ fontSize: 12, color: "#94A3B8" }}>
                    <span>Cycle: {group.currentRound} of {group.totalRounds}</span>
                    <span>Turns begin: Cycle {group.payoutStartRound}</span>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <Link
                      href={`/savings/groups/${group.id}`}
                      className="quick-action-btn primary"
                      style={{ fontSize: 13, padding: "8px 16px", flex: 1, justifyContent: "center" }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
