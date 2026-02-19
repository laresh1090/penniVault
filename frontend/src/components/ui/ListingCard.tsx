"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/formatters";

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  status: "active" | "sold" | "draft";
  views?: number;
  saves?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function ListingCard({
  id,
  title,
  category,
  price,
  imageUrl,
  status,
  views,
  saves,
  onEdit,
  onDelete,
  className,
}: ListingCardProps) {
  return (
    <div className={cn("listing-card", className)}>
      <div className="listing-img">
        <img src={imageUrl} alt={title} />
        <span className={cn("listing-status", status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="listing-body">
        <div className="listing-title">{title}</div>
        <div className="listing-category">{category}</div>
        <div className="listing-price">{formatNaira(price)}</div>
        {(views !== undefined || saves !== undefined) && (
          <div className="listing-stats">
            {views !== undefined && (
              <>
                <FontAwesomeIcon icon={faEye} />
                {views}
              </>
            )}
            {saves !== undefined && (
              <>
                <FontAwesomeIcon icon={faHeart} />
                {saves}
              </>
            )}
          </div>
        )}
        <div className="listing-actions">
          <button type="button" onClick={onEdit}>
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
          <button type="button" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
