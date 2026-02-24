"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCalendarDays,
  faCircle,
  faArrowUp,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { savingsService } from "@/services/savings.service";
import type { GroupSavingsDetail } from "@/types/dashboard";
import { formatNaira } from "@/lib/formatters";

export default function GroupSavingsDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupSavingsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    savingsService
      .getGroupSavingsDetail(groupId)
      .then(setGroup)
      .catch(() => setGroup(null))
      .finally(() => setIsLoading(false));
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h4 style={{ color: "#334155", fontWeight: 700 }}>Group not found</h4>
        <p style={{ color: "#64748B", fontSize: 14 }}>
          The group savings you are looking for does not exist or has been removed.
        </p>
        <Link href="/savings/groups" className="quick-action-btn primary">View All Groups</Link>
      </div>
    );
  }

  const poolTarget = group.contributionAmount * group.totalSlots * group.totalRounds;
  const collected = group.contributionAmount * group.filledSlots * group.currentRound;
  const poolProgress = Math.round((collected / poolTarget) * 100);
  const midpoint = Math.ceil(group.totalRounds / 2);

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol className="breadcrumb" style={{ background: "none", padding: 0, margin: 0, fontSize: 14 }}>
          <li className="breadcrumb-item">
            <Link href="/dashboard" style={{ color: "#EB5310", textDecoration: "none" }}>Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/savings/groups" style={{ color: "#EB5310", textDecoration: "none" }}>Group Savings</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page" style={{ color: "#64748B" }}>
            {group.name}
          </li>
        </ol>
      </nav>

      {/* Group Header Card */}
      <div className="dash-card mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1E252F", marginBottom: 8 }}>{group.name}</h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0, maxWidth: 600 }}>
              {group.description}
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <a href="#" className="quick-action-btn primary">
              <FontAwesomeIcon icon={faPlus} /> Make Contribution
            </a>
            <a href="#" className="quick-action-btn secondary">
              <FontAwesomeIcon icon={faCalendarDays} /> View Schedule
            </a>
          </div>
        </div>
      </div>

      {/* Row: Pool Progress + Group Info */}
      <div className="row g-4 mb-4">
        {/* Col 1: Pool Progress */}
        <div className="col-md-8">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Pool Progress</h3>
            </div>

            {/* Amount Summary */}
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <span style={{ fontSize: 13, color: "#64748B" }}>Total Collected</span>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#1E252F", margin: 0 }}>
                  {formatNaira(collected, false)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Target Pool</span>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#64748B", margin: 0 }}>
                  {formatNaira(poolTarget, false)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="savings-progress mb-2" style={{ height: 12 }}>
              <div className="progress-fill" style={{ width: `${poolProgress}%` }}></div>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#EB5310", marginBottom: 24 }}>
              {poolProgress}% Complete
            </p>

            {/* Savings Timeline */}
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1E252F", marginBottom: 16 }}>Savings Timeline</h4>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {Array.from({ length: group.totalRounds }, (_, i) => {
                const cycle = i + 1;
                let className = "cycle-block";
                if (cycle < group.currentRound) className += " completed";
                else if (cycle === group.currentRound) className += " current";
                else if (cycle === midpoint) className += " midpoint";
                return (
                  <div key={cycle} className={className}>{cycle}</div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="d-flex align-items-center gap-4" style={{ fontSize: 12, color: "#64748B" }}>
              <span>
                <FontAwesomeIcon icon={faCircle} style={{ color: "#059669", fontSize: 8, marginRight: 4 }} /> Start
              </span>
              <span>
                <FontAwesomeIcon icon={faArrowUp} style={{ color: "#D97706", fontSize: 10, marginRight: 4 }} />
                <span style={{ color: "#D97706", fontWeight: 600 }}>Midpoint (Turns Begin)</span>
              </span>
              <span>
                <FontAwesomeIcon icon={faCircle} style={{ color: "#94A3B8", fontSize: 8, marginRight: 4 }} /> End
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: Group Info */}
        <div className="col-md-4">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">Group Info</h3>
            </div>
            <div className="detail-row">
              <span className="detail-label">Members</span>
              <span className="detail-value">{group.filledSlots} / {group.totalSlots}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contribution</span>
              <span className="detail-value">{formatNaira(group.contributionAmount, false)}/cycle</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payout Per Turn</span>
              <span className="detail-value" style={{ color: "#EB5310" }}>
                {formatNaira(group.poolSize, false)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Current Cycle</span>
              <span className="detail-value">{group.currentRound} of {group.totalRounds}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Midpoint</span>
              <span className="detail-value">Cycle {midpoint}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Your Turn</span>
              <span className="detail-value" style={{ color: "#EB5310", fontWeight: 700 }}>
                Position #{group.members.find((m) => m.isCurrentTurn)?.position ?? "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Your Status</span>
              <span className="detail-value" style={{ color: "#059669" }}>Up to date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Turn Order Table */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Turn Order</h3>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Turn</th>
                <th>Member</th>
                <th>Expected Cycle</th>
                <th>Payout Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {group.currentRound < midpoint && (
                <tr style={{ opacity: 0.6 }}>
                  <td colSpan={5} style={{ textAlign: "center", fontStyle: "italic", fontSize: 13, color: "#64748B" }}>
                    Turns begin at Cycle {midpoint} (midpoint). Currently at Cycle {group.currentRound}.
                  </td>
                </tr>
              )}
              {group.payoutSchedule.slice(0, 4).map((payout) => {
                const currentUser = group.members.find((m) => m.isCurrentTurn);
                const isYou = currentUser ? payout.recipientName === currentUser.name : false;
                return (
                  <tr key={payout.round} style={isYou ? { background: "#FFF3EE" } : undefined}>
                    <td><strong>#{payout.round}</strong></td>
                    <td>{isYou ? <strong>You ({payout.recipientName})</strong> : payout.recipientName}</td>
                    <td>Cycle {midpoint + payout.round - 1}</td>
                    <td>{formatNaira(payout.amount, false)}</td>
                    <td>
                      {payout.status === "completed" ? (
                        <span className="status-badge completed">Completed</span>
                      ) : payout.status === "current" ? (
                        <span className="status-badge" style={{ background: "#EB5310", color: "#FFFFFF" }}>Your Turn</span>
                      ) : (
                        <span className="status-badge pending">Upcoming</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members Grid */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Members</h3>
        </div>
        <div className="row g-3">
          {group.members.slice(0, 4).map((member, i) => (
            <div key={member.userId} className="col-md-3 col-sm-6">
              <div className={`member-card${member.isCurrentTurn ? " highlight" : ""}`}>
                <img src={`/img/member-${i + 1}.jpg`} alt={member.name} className="member-avatar" />
                <p className="member-name">{member.isCurrentTurn ? "You" : member.name.split(" ")[0] + " " + member.name.split(" ")[1]?.[0] + "."}</p>
                <span className={`member-status ${member.hasPaidCurrentRound ? "paid" : "overdue"}`}>
                  {member.hasPaidCurrentRound ? "Paid" : "Overdue"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Discussion Placeholder */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Group Discussion</h3>
        </div>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <FontAwesomeIcon icon={faComments} style={{ fontSize: 48, color: "#E2E8F0", marginBottom: 16, display: "block" }} />
          <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>Group chat will be available with backend integration</p>
        </div>
      </div>
    </>
  );
}
