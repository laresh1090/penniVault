"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPlus } from "@fortawesome/free-solid-svg-icons";

interface PenniLockEmptyStateProps {
  hasAnyPlans: boolean;
  onCreateNew: () => void;
}

export default function PenniLockEmptyState({
  hasAnyPlans,
  onCreateNew,
}: PenniLockEmptyStateProps) {
  return (
    <div className="pennilock-empty-state">
      <div className="empty-icon">
        <FontAwesomeIcon icon={faLock} />
      </div>
      <h4>
        {hasAnyPlans
          ? "No locks match this filter"
          : "Start your first PenniLock"}
      </h4>
      <p>
        {hasAnyPlans
          ? "Try a different filter to see your locks."
          : "Lock your funds for a fixed term and earn higher interest rates. The longer you lock, the more you earn."}
      </p>
      {!hasAnyPlans && (
        <button className="btn pennilock-btn-primary" onClick={onCreateNew}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Create Your First PenniLock
        </button>
      )}
    </div>
  );
}
