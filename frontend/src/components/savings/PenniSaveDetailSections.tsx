"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPercent,
  faCalendar,
  faBoltLightning,
  faArrowDown,
  faSeedling,
  faGear,
  faPause,
  faBuildingColumns,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { PenniSavePlanDetail } from "@/types/savings";

interface PenniSaveDetailSectionsProps {
  plan: PenniSavePlanDetail;
}

export default function PenniSaveDetailSections({
  plan,
}: PenniSaveDetailSectionsProps) {
  const dailyRate = plan.hasInterest && plan.interestRate
    ? (plan.interestRate / 365)
    : 0;
  const dailyAccrual = (plan.currentAmount - plan.accruedInterest) * (dailyRate / 100);
  const projectedMonthly = dailyAccrual * 30;

  return (
    <>
      {/* Interest Breakdown + Auto-Save Settings -- side by side */}
      <div className="row g-4 mb-4">
        {/* Interest Breakdown */}
        <div className="col-md-6">
          <div className="dash-card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              <FontAwesomeIcon
                icon={faPercent}
                className="me-2"
                style={{ color: "#059669" }}
              />
              Interest Breakdown
            </h3>

            <div className="detail-row">
              <span className="detail-label">Principal</span>
              <span className="detail-value">
                {formatNaira(plan.currentAmount - plan.accruedInterest, false)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Accrued Interest</span>
              <span className="detail-value" style={{ color: "#059669" }}>
                +{formatNaira(plan.accruedInterest, false)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Interest Rate</span>
              <span className="detail-value">
                {plan.hasInterest ? `${plan.interestRate}% p.a.` : "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Daily Accrual</span>
              <span className="detail-value" style={{ color: "#059669" }}>
                ~{formatNaira(Math.round(dailyAccrual), false)}/day
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Projected Monthly</span>
              <span className="detail-value" style={{ color: "#059669" }}>
                ~{formatNaira(Math.round(projectedMonthly), false)}/month
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Save Settings */}
        <div className="col-md-6">
          <div className="dash-card">
            <div className="card-header">
              <h3 className="card-title">
                <FontAwesomeIcon
                  icon={faRotate}
                  className="me-2"
                  style={{ color: "#3B82F6" }}
                />
                Auto-Save Settings
              </h3>
              <a href="#" className="card-action">
                <FontAwesomeIcon icon={faGear} /> Edit
              </a>
            </div>

            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">
                {formatNaira(plan.contributionAmount, false)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Frequency</span>
              <span className="detail-value">
                {plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Next Debit</span>
              <span className="detail-value">
                {plan.nextAutoSaveDate
                  ? formatDate(plan.nextAutoSaveDate)
                  : "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Funding Source</span>
              <span className="detail-value">
                {plan.fundingSource
                  ? `${plan.fundingSource.bankName} ${plan.fundingSource.accountNumber}`
                  : "Wallet"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Auto-Save Limit</span>
              <span className="detail-value">
                {plan.targetAmount > 0
                  ? formatNaira(plan.targetAmount, false)
                  : "No limit"}
              </span>
            </div>

            {plan.status === "active" && (
              <div style={{ marginTop: 16 }}>
                <button
                  className="quick-action-btn secondary"
                  style={{ fontSize: 13, width: "100%", justifyContent: "center" }}
                >
                  <FontAwesomeIcon icon={faPause} /> Pause Auto-Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
