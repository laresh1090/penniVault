"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faBullseye,
  faChartLine,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";

interface TargetSaveSummaryCardProps {
  totalSaved: number;
  activeGoals: number;
  averageProgress: number;
}

export default function TargetSaveSummaryCard({
  totalSaved,
  activeGoals,
  averageProgress,
}: TargetSaveSummaryCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="targetsave-summary-card">
      <div className="row g-0 align-items-center">
        {/* Left: Total Saved */}
        <div className="col-md-5">
          <div className="summary-label">
            <FontAwesomeIcon icon={faBullseye} className="me-2" />
            Total Saved Toward Goals
            <button
              className="btn btn-link p-0 ms-2"
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide balance" : "Show balance"}
            >
              <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
            </button>
          </div>
          <p className="summary-value" style={{ margin: 0 }}>
            {visible ? formatNaira(totalSaved, false) : "********"}
          </p>
        </div>

        {/* Right: Stats */}
        <div className="col-md-7">
          <div className="d-flex gap-4 justify-content-md-end">
            <div>
              <div className="summary-label">
                <FontAwesomeIcon icon={faFlag} className="me-1" />
                Active Goals
              </div>
              <p className="summary-stat" style={{ margin: 0 }}>
                {activeGoals}
              </p>
            </div>
            <div>
              <div className="summary-label">
                <FontAwesomeIcon icon={faChartLine} className="me-1" />
                Avg. Progress
              </div>
              <p className="summary-stat" style={{ margin: 0 }}>
                {averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
