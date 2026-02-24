"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPlus } from "@fortawesome/free-solid-svg-icons";

interface TargetSaveEmptyStateProps {
  hasAnyPlans: boolean;
  onCreateNew: () => void;
}

export default function TargetSaveEmptyState({
  hasAnyPlans,
  onCreateNew,
}: TargetSaveEmptyStateProps) {
  return (
    <div className="targetsave-empty-state">
      <div className="empty-icon">
        <FontAwesomeIcon icon={faBullseye} />
      </div>
      <h4>
        {hasAnyPlans
          ? "No goals match this filter"
          : "Start your first TargetSave"}
      </h4>
      <p>
        {hasAnyPlans
          ? "Try a different filter to see your goals."
          : "Set a savings goal with a target amount and date. Track your progress and stay motivated to reach your financial targets."}
      </p>
      {!hasAnyPlans && (
        <button className="btn targetsave-btn-primary" onClick={onCreateNew}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Create Your First Goal
        </button>
      )}
    </div>
  );
}
