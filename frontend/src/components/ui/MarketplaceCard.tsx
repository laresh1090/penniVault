"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/formatters";

interface MarketplaceCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  imageUrl: string;
  vendorName: string;
  vendorInitials: string;
  className?: string;
}

export default function MarketplaceCard({
  id,
  title,
  location,
  price,
  category,
  imageUrl,
  vendorName,
  vendorInitials,
  className,
}: MarketplaceCardProps) {
  return (
    <div className={cn("marketplace-card", className)}>
      <div className="marketplace-card-img">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div style={{ backgroundColor: "#e0e0e0", width: "100%", height: "100%" }} />
        )}
        <span className="category-badge">{category}</span>
      </div>
      <div className="marketplace-card-body">
        <div className="marketplace-title">{title}</div>
        <div className="marketplace-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          {location}
        </div>
        <div className="marketplace-price">{formatNaira(price)}</div>
        <div className="marketplace-vendor">
          <span className="vendor-avatar">{vendorInitials}</span>
          {vendorName}
        </div>
        <div className="marketplace-actions">
          <button className="btn btn-primary btn-sm">Save Towards This</button>
          <Link href={`/marketplace/${id}`} className="btn btn-outline-primary btn-sm">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
