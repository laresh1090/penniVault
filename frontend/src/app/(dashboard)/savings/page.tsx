"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPause, faPlay, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import QuickActionBtn from "@/components/ui/QuickActionBtn";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockSavingsPlans } from "@/data/savings";
import { formatNaira, formatDate, formatPercentage } from "@/lib/formatters";
import type { SavingsStatus } from "@/types/common";

type FilterStatus = "all" | SavingsStatus;

export default function SavingsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filteredPlans = useMemo(() => {
    if (activeFilter === "all") return mockSavingsPlans;
    return mockSavingsPlans.filter((plan) => plan.status === activeFilter);
  }, [activeFilter]);

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Paused", value: "paused" },
  ];

  function getNextContributionDate(plan: typeof mockSavingsPlans[0]): string {
    const start = new Date(plan.startDate);
    const now = new Date();
    const next = new Date(start);

    while (next <= now) {
      switch (plan.frequency) {
        case "daily":
          next.setDate(next.getDate() + 1);
          break;
        case "weekly":
          next.setDate(next.getDate() + 7);
          break;
        case "biweekly":
          next.setDate(next.getDate() + 14);
          break;
        case "monthly":
          next.setMonth(next.getMonth() + 1);
          break;
      }
    }

    return formatDate(next.toISOString());
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Savings Plans</h2>
        <QuickActionBtn variant="primary" icon={faPlus} href="/savings/new">
          New Savings Plan
        </QuickActionBtn>
      </div>

      {/* Filter Bar */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`btn btn-sm ${
              activeFilter === option.value
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            style={{
              borderRadius: 20,
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: 13,
              fontWeight: 600,
              ...(activeFilter === option.value
                ? { backgroundColor: "#EB5310", borderColor: "#EB5310" }
                : {}),
            }}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Plan Cards Grid */}
      <div className="row g-4">
        {filteredPlans.length === 0 ? (
          <div className="col-12">
            <div
              className="card p-5 text-center"
              style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
            >
              <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>
                No savings plans found for the selected filter.
              </p>
            </div>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const percentage = Math.round(
              (plan.currentAmount / plan.targetAmount) * 100
            );
            const statusForBadge = plan.status as
              | "active"
              | "completed"
              | "paused"
              | "pending";

            return (
              <div key={plan.id} className="col-md-6">
                <div
                  className="card h-100"
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div className="card-body p-4">
                    {/* Plan Name + Status */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          margin: 0,
                          color: "#1E293B",
                        }}
                      >
                        {plan.name}
                      </h5>
                      <StatusBadge status={statusForBadge} />
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "#64748B",
                          marginBottom: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {plan.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-2">
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
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor:
                              percentage >= 100 ? "#22C55E" : "#EB5310",
                            borderRadius: 4,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <div
                        className="d-flex justify-content-between mt-1"
                        style={{ fontSize: 12, color: "#64748B" }}
                      >
                        <span>{percentage}% complete</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <p
                      style={{
                        fontSize: 14,
                        color: "#334155",
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      {formatNaira(plan.currentAmount, false)} of{" "}
                      {formatNaira(plan.targetAmount, false)}
                    </p>

                    {/* Detail Rows */}
                    <div
                      className="d-flex gap-3 flex-wrap mb-3"
                      style={{ fontSize: 13, color: "#64748B" }}
                    >
                      <span>
                        <strong style={{ color: "#334155" }}>Frequency:</strong>{" "}
                        {plan.frequency.charAt(0).toUpperCase() +
                          plan.frequency.slice(1)}
                      </span>
                      {plan.interestRate !== undefined && (
                        <span>
                          <strong style={{ color: "#334155" }}>Rate:</strong>{" "}
                          {formatPercentage(plan.interestRate, 0)}
                        </span>
                      )}
                    </div>

                    {/* Next Contribution */}
                    {plan.status === "active" && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "#64748B",
                          marginBottom: 16,
                        }}
                      >
                        Next:{" "}
                        <strong style={{ color: "#334155" }}>
                          {formatNaira(plan.contributionAmount, false)}
                        </strong>{" "}
                        due {getNextContributionDate(plan)}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 flex-wrap">
                      <Link
                        href={`/savings/${plan.id}`}
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
                        View Details
                      </Link>
                      {plan.status === "active" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            style={{
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              style={{ marginRight: 4 }}
                            />
                            Add Funds
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            style={{
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPause}
                              style={{ marginRight: 4 }}
                            />
                            Pause
                          </button>
                        </>
                      )}
                      {plan.status === "paused" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          style={{
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlay}
                            style={{ marginRight: 4 }}
                          />
                          Resume
                        </button>
                      )}
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
