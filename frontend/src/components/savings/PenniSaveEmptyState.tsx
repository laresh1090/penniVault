import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank, faPlus } from "@fortawesome/free-solid-svg-icons";

interface PenniSaveEmptyStateProps {
  hasAnyPlans: boolean;
  onCreateNew: () => void;
}

export default function PenniSaveEmptyState({
  hasAnyPlans,
  onCreateNew,
}: PenniSaveEmptyStateProps) {
  return (
    <div className="pennisave-empty-state">
      <div className="pennisave-empty-icon">
        <FontAwesomeIcon icon={faPiggyBank} />
      </div>
      <h4 className="pennisave-empty-title">
        {hasAnyPlans
          ? "No plans match this filter"
          : "Start your first PenniSave"}
      </h4>
      <p className="pennisave-empty-desc">
        {hasAnyPlans
          ? "Try a different filter to see your plans."
          : "PenniSave helps you build savings automatically. Set a daily, weekly, or monthly auto-save and watch your money grow."}
      </p>
      {!hasAnyPlans && (
        <button className="quick-action-btn primary" onClick={onCreateNew}>
          <FontAwesomeIcon icon={faPlus} /> Create Your First PenniSave
        </button>
      )}
    </div>
  );
}
