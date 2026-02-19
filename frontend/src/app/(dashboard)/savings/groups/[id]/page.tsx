"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faUsers,
  faCheck,
  faTimes,
  faCircleCheck,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import DashCard from "@/components/ui/DashCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressCircle from "@/components/ui/ProgressCircle";
import DetailRow from "@/components/ui/DetailRow";
import { mockGroupSavingsDetail } from "@/data/dashboard";
import { formatNaira, formatDate, formatRelativeTime } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";

export default function GroupSavingsDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  const group =
    mockGroupSavingsDetail.id === groupId ? mockGroupSavingsDetail : null;

  if (!group) {
    return (
      <div>
        <Link
          href="/savings/groups"
          className="d-inline-flex align-items-center gap-2 mb-4"
          style={{
            color: "#EB5310",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 12 }} />
          Back to Group Savings
        </Link>
        <div
          className="card p-5 text-center"
          style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
        >
          <h4 style={{ color: "#334155", fontWeight: 700 }}>
            Group not found
          </h4>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            The group savings you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/savings/groups"
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
            View All Groups
          </Link>
        </div>
      </div>
    );
  }

  const roundProgress = Math.round(
    (group.currentRound / group.totalRounds) * 100
  );
  const paidCount = group.members.filter(
    (m) => m.hasPaidCurrentRound
  ).length;

  const statusForBadge = group.status as
    | "active"
    | "completed"
    | "pending"
    | "paused";

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/savings/groups"
        className="d-inline-flex align-items-center gap-2 mb-4"
        style={{
          color: "#EB5310",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 12 }} />
        Back to Group Savings
      </Link>

      {/* Group Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            {group.name}
          </h2>
          <StatusBadge status={statusForBadge} />
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
          >
            Leave Group
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: "#64748B",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {group.description}
      </p>

      {/* Three-column Layout */}
      <div className="row g-4 mb-4">
        {/* Col 1: Progress */}
        <div className="col-lg-4">
          <div
            className="card h-100"
            style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
          >
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
              <ProgressCircle
                percentage={roundProgress}
                size={160}
                strokeWidth={10}
                color={roundProgress >= 100 ? "#22C55E" : "#EB5310"}
                label="rounds done"
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
                  Round {group.currentRound} of {group.totalRounds}
                </p>
                <p
                  style={{ fontSize: 13, color: "#64748B", margin: 0 }}
                >
                  {paidCount}/{group.filledSlots} members paid this round
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Group Details */}
        <div className="col-lg-4">
          <div
            className="card h-100"
            style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
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
                Group Details
              </h6>
              <div className="d-flex flex-column gap-2">
                <DetailRow label="Frequency" value={group.frequency} />
                <DetailRow
                  label="Contribution"
                  value={formatNaira(group.contributionAmount, false)}
                />
                <DetailRow
                  label="Pool Size"
                  value={formatNaira(group.poolSize, false)}
                />
                <DetailRow
                  label="Members"
                  value={`${group.filledSlots}/${group.totalSlots}`}
                />
                <DetailRow
                  label="Start Date"
                  value={formatDate(group.startDate)}
                />
                <DetailRow
                  label="Next Payout"
                  value={formatDate(group.nextPayoutDate)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Current Turn */}
        <div className="col-lg-4">
          <div
            className="card h-100"
            style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
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
                Current Payout Recipient
              </h6>
              {(() => {
                const currentRecipient = group.members.find(
                  (m) => m.isCurrentTurn
                );
                if (!currentRecipient) return null;
                return (
                  <div className="text-center">
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "#FFF3EE",
                        color: "#EB5310",
                        fontSize: 22,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      {getInitials(currentRecipient.name)}
                    </div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1E293B",
                        margin: 0,
                      }}
                    >
                      {currentRecipient.name}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748B",
                        marginBottom: 12,
                      }}
                    >
                      Position #{currentRecipient.position}
                    </p>
                    <div
                      style={{
                        background: "#F0FDF4",
                        borderRadius: 8,
                        padding: "12px 16px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: "#059669",
                          margin: 0,
                          fontWeight: 600,
                        }}
                      >
                        Payout Amount
                      </p>
                      <p
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#059669",
                          margin: 0,
                        }}
                      >
                        {formatNaira(group.poolSize, false)}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          margin: 0,
                        }}
                      >
                        on {formatDate(group.nextPayoutDate)}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="mb-4">
        <DashCard title={`Members (${group.filledSlots}/${group.totalSlots})`}>
          <div className="row g-3">
            {group.members.map((member) => (
              <div key={member.userId} className="col-md-6 col-lg-3">
                <div
                  style={{
                    padding: 16,
                    borderRadius: 10,
                    border: member.isCurrentTurn
                      ? "2px solid #EB5310"
                      : "1px solid #E2E8F0",
                    background: member.isCurrentTurn ? "#FFFBF8" : "#FFFFFF",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {member.isCurrentTurn && (
                    <span
                      style={{
                        position: "absolute",
                        top: -10,
                        right: 12,
                        background: "#EB5310",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 10,
                        textTransform: "uppercase",
                      }}
                    >
                      Current Turn
                    </span>
                  )}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: member.hasPaidCurrentRound
                        ? "#ECFDF5"
                        : "#FEF2F2",
                      color: member.hasPaidCurrentRound
                        ? "#059669"
                        : "#EF4444",
                      fontSize: 14,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1E293B",
                      margin: 0,
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#94A3B8",
                      margin: "2px 0 8px",
                    }}
                  >
                    Position #{member.position}
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-center gap-1"
                    style={{ fontSize: 12 }}
                  >
                    <FontAwesomeIcon
                      icon={
                        member.hasPaidCurrentRound ? faCheck : faTimes
                      }
                      style={{
                        color: member.hasPaidCurrentRound
                          ? "#059669"
                          : "#EF4444",
                        fontSize: 11,
                      }}
                    />
                    <span
                      style={{
                        color: member.hasPaidCurrentRound
                          ? "#059669"
                          : "#EF4444",
                        fontWeight: 600,
                      }}
                    >
                      {member.hasPaidCurrentRound ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Payout Schedule */}
      <div className="mb-4">
        <DashCard title="Payout Schedule">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ fontSize: 13, color: "#64748B" }}>
                  <th style={{ fontWeight: 600, border: "none", paddingBottom: 12 }}>Round</th>
                  <th style={{ fontWeight: 600, border: "none", paddingBottom: 12 }}>Recipient</th>
                  <th style={{ fontWeight: 600, border: "none", paddingBottom: 12 }}>Date</th>
                  <th style={{ fontWeight: 600, border: "none", paddingBottom: 12 }}>Amount</th>
                  <th style={{ fontWeight: 600, border: "none", paddingBottom: 12 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {group.payoutSchedule.map((payout) => (
                  <tr
                    key={payout.round}
                    style={{
                      fontSize: 14,
                      background:
                        payout.status === "current" ? "#FFFBF8" : undefined,
                    }}
                  >
                    <td
                      style={{
                        fontWeight: 600,
                        color: "#1E293B",
                        borderColor: "#F1F5F9",
                        padding: "12px 16px",
                      }}
                    >
                      {payout.round}
                    </td>
                    <td
                      style={{
                        color: "#334155",
                        borderColor: "#F1F5F9",
                        padding: "12px 16px",
                      }}
                    >
                      {payout.recipientName}
                    </td>
                    <td
                      style={{
                        color: "#64748B",
                        borderColor: "#F1F5F9",
                        padding: "12px 16px",
                      }}
                    >
                      {formatDate(payout.date)}
                    </td>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "#1E293B",
                        borderColor: "#F1F5F9",
                        padding: "12px 16px",
                      }}
                    >
                      {formatNaira(payout.amount, false)}
                    </td>
                    <td
                      style={{
                        borderColor: "#F1F5F9",
                        padding: "12px 16px",
                      }}
                    >
                      {payout.status === "completed" ? (
                        <span
                          className="d-inline-flex align-items-center gap-1"
                          style={{
                            background: "#ECFDF5",
                            color: "#059669",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ fontSize: 11 }}
                          />
                          Completed
                        </span>
                      ) : payout.status === "current" ? (
                        <span
                          style={{
                            background: "#FFF3EE",
                            color: "#EB5310",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12,
                          }}
                        >
                          Current
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#94A3B8",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12,
                          }}
                        >
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashCard>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <DashCard title="Recent Activity">
          {group.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="d-flex align-items-start gap-3"
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  color: "#3B82F6",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getInitials(activity.memberName)}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#1E293B",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  <strong>{activity.memberName}</strong> {activity.action}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#94A3B8",
                    margin: 0,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faClockRotateLeft}
                    style={{ marginRight: 4, fontSize: 10 }}
                  />
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </DashCard>
      </div>
    </div>
  );
}
