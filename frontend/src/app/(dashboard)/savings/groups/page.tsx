"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { savingsService } from "@/services/savings.service";
import type { GroupSavings } from "@/types";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function GroupSavingsPage() {
  const [groups, setGroups] = useState<GroupSavings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    savingsService.getUserGroupSavings().then((data) => {
      setGroups(data);
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
            const userMember = group.members.find((m) => m.userId === "usr_001");
            const midpoint = Math.ceil(group.totalRounds / 2);

            return (
              <div key={group.id} className="col-md-6">
                <div className="dash-card h-100">
                  {/* Group Name + Status */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{group.name}</h5>
                      <span style={{ fontSize: 13, color: "#64748B" }}>{group.filledSlots} Members</span>
                    </div>
                    <span className={`status-badge ${group.status}`}>
                      {group.status === "active" ? "Active" : group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                    </span>
                  </div>

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
                    <span>Midpoint: Cycle {midpoint}</span>
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
