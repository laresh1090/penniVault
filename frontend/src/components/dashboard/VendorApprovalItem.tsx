"use client";

import { formatDate } from "@/lib/formatters";

interface VendorApprovalItemProps {
  businessName: string;
  ownerName: string;
  category: string;
  submittedAt: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function VendorApprovalItem({
  businessName,
  ownerName,
  category,
  submittedAt,
  onApprove,
  onReject,
}: VendorApprovalItemProps) {
  return (
    <div className="vendor-approval-item">
      <div className="vendor-approval-info">
        <span className="vendor-approval-business">{businessName}</span>
        <span className="vendor-approval-owner">by {ownerName}</span>
        <div className="vendor-approval-meta">
          <span className="vendor-approval-category">{category}</span>
          <span className="vendor-approval-date">
            Submitted {formatDate(submittedAt)}
          </span>
        </div>
      </div>
      <div className="vendor-approval-actions">
        <button
          type="button"
          className="vendor-approval-btn approve"
          onClick={onApprove}
        >
          Approve
        </button>
        <button
          type="button"
          className="vendor-approval-btn reject"
          onClick={onReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
