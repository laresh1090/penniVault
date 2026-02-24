"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPiggyBank,
  faPercent,
  faCalendar,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";

interface PenniSaveSummaryCardProps {
  totalBalance: number;
  totalInterest: number;
  activePlanCount: number;
  nextAutoSaveDate: string | null;
}

export default function PenniSaveSummaryCard({
  totalBalance,
  totalInterest,
  activePlanCount,
  nextAutoSaveDate,
}: PenniSaveSummaryCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="pennisave-summary-card">
      {/* Decorative circle (matches balance-hero-card pattern) */}
      <div className="pennisave-summary-decoration" />

      <div className="row g-0">
        {/* Left: Balance */}
        <div className="col-md-7">
          <div className="pennisave-summary-left">
            <div className="pennisave-summary-label">
              <FontAwesomeIcon icon={faPiggyBank} className="me-2" />
              Total PenniSave Balance
              <button
                className="pennisave-balance-toggle"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Hide balance" : "Show balance"}
              >
                <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
              </button>
            </div>
            <p className="pennisave-summary-amount">
              {visible ? formatNaira(totalBalance, false) : "********"}
            </p>
            <p className="pennisave-summary-plans">
              {activePlanCount} active plan{activePlanCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="col-md-5">
          <div className="pennisave-summary-stats">
            <div className="pennisave-stat-item">
              <div className="pennisave-stat-icon interest">
                <FontAwesomeIcon icon={faPercent} />
              </div>
              <div>
                <span className="pennisave-stat-label">Interest Earned</span>
                <span className="pennisave-stat-value">
                  {visible ? formatNaira(totalInterest, false) : "****"}
                </span>
              </div>
            </div>
            <div className="pennisave-stat-item">
              <div className="pennisave-stat-icon autosave">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div>
                <span className="pennisave-stat-label">Next Auto-Save</span>
                <span className="pennisave-stat-value">
                  {nextAutoSaveDate ? formatDate(nextAutoSaveDate) : "No active plans"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
