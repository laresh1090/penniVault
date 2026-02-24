"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLock,
  faPercent,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";

interface PenniLockSummaryCardProps {
  totalLocked: number;
  totalInterest: number;
  activeLocksCount: number;
}

export default function PenniLockSummaryCard({
  totalLocked,
  totalInterest,
  activeLocksCount,
}: PenniLockSummaryCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="pennilock-summary-card">
      <div className="row g-0 align-items-center">
        {/* Left: Total Locked */}
        <div className="col-md-5">
          <div className="summary-label">
            <FontAwesomeIcon icon={faLock} className="me-2" />
            Total Locked
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
            {visible ? formatNaira(totalLocked, false) : "********"}
          </p>
        </div>

        {/* Right: Stats */}
        <div className="col-md-7">
          <div className="d-flex gap-4 justify-content-md-end">
            <div>
              <div className="summary-label">
                <FontAwesomeIcon icon={faShieldHalved} className="me-1" />
                Active Locks
              </div>
              <p className="summary-stat" style={{ margin: 0 }}>
                {activeLocksCount}
              </p>
            </div>
            <div>
              <div className="summary-label">
                <FontAwesomeIcon icon={faPercent} className="me-1" />
                Interest Earned
              </div>
              <p className="summary-stat" style={{ margin: 0 }}>
                {visible ? formatNaira(totalInterest, false) : "****"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
