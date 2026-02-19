"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import QuickActionBtn from "@/components/ui/QuickActionBtn";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockGroupSavings } from "@/data/savings";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function GroupSavingsPage() {
  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
          Group Savings
        </h2>
        <QuickActionBtn variant="primary" icon={faUsers} href="/savings/groups/join">
          Join a Group
        </QuickActionBtn>
      </div>

      {/* Group Cards */}
      <div className="row g-4">
        {mockGroupSavings.length === 0 ? (
          <div className="col-12">
            <div
              className="card p-5 text-center"
              style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
            >
              <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>
                You are not a member of any group savings yet.
              </p>
            </div>
          </div>
        ) : (
          mockGroupSavings.map((group) => {
            const poolSize = group.contributionAmount * group.filledSlots;
            const roundProgress = Math.round(
              (group.currentRound / group.totalRounds) * 100
            );
            const statusForBadge = group.status as
              | "active"
              | "completed"
              | "pending"
              | "paused";

            return (
              <div key={group.id} className="col-md-6">
                <div
                  className="card h-100"
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div className="card-body p-4">
                    {/* Group Name + Status */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          margin: 0,
                          color: "#1E293B",
                        }}
                      >
                        {group.name}
                      </h5>
                      <StatusBadge status={statusForBadge} />
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748B",
                        marginBottom: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      {group.description}
                    </p>

                    {/* Stats Grid */}
                    <div
                      className="d-flex gap-3 flex-wrap mb-3"
                      style={{ fontSize: 13 }}
                    >
                      <div
                        style={{
                          flex: "1 1 45%",
                          padding: "8px 12px",
                          backgroundColor: "#F8FAFC",
                          borderRadius: 8,
                        }}
                      >
                        <span style={{ color: "#64748B", display: "block" }}>
                          Members
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#1E293B",
                            fontSize: 15,
                          }}
                        >
                          {group.filledSlots}/{group.totalSlots}
                        </span>
                      </div>
                      <div
                        style={{
                          flex: "1 1 45%",
                          padding: "8px 12px",
                          backgroundColor: "#F8FAFC",
                          borderRadius: 8,
                        }}
                      >
                        <span style={{ color: "#64748B", display: "block" }}>
                          Pool
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#1E293B",
                            fontSize: 15,
                          }}
                        >
                          {formatNaira(poolSize, false)}
                        </span>
                      </div>
                    </div>

                    {/* Contribution & Round */}
                    <div
                      className="d-flex flex-column gap-2 mb-3"
                      style={{ fontSize: 13, color: "#64748B" }}
                    >
                      <div className="d-flex justify-content-between">
                        <span>Contribution</span>
                        <span style={{ fontWeight: 600, color: "#334155" }}>
                          {formatNaira(group.contributionAmount, false)}/
                          {group.frequency}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Round</span>
                        <span style={{ fontWeight: 600, color: "#334155" }}>
                          {group.currentRound} of {group.totalRounds}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Next Payout</span>
                        <span style={{ fontWeight: 600, color: "#334155" }}>
                          {formatDate(group.nextPayoutDate)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div
                        style={{
                          height: 8,
                          backgroundColor: "#E2E8F0",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(roundProgress, 100)}%`,
                            backgroundColor:
                              roundProgress >= 100 ? "#22C55E" : "#EB5310",
                            borderRadius: 4,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <div
                        className="text-end mt-1"
                        style={{ fontSize: 12, color: "#64748B" }}
                      >
                        {roundProgress}% rounds completed
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between gap-2">
                      <Link
                        href={`/savings/groups/${group.id}`}
                        className="btn btn-sm flex-grow-1"
                        style={{
                          backgroundColor: "#EB5310",
                          color: "#fff",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        style={{
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
