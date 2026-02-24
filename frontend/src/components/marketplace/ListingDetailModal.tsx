"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faLocationDot,
  faCartShopping,
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
  faBox,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formatNaira } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import type { Listing } from "@/types";

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
  onBuyNow: () => void;
  onInstallment: () => void;
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    property: "Property",
    automotive: "Automotive",
    agriculture: "Agriculture",
    other: "Other",
  };
  return labels[category] || category;
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    property: "#EB5310",
    automotive: "#10B981",
    agriculture: "#F59E0B",
    other: "#6366F1",
  };
  return colors[category] || "#64748B";
}

export default function ListingDetailModal({
  listing,
  onClose,
  onBuyNow,
  onInstallment,
}: ListingDetailModalProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = listing.images?.length ? listing.images : [listing.primaryImage || ""];
  const hasMultipleImages = images.length > 1;

  const vendorName =
    listing.vendor?.vendorProfile?.businessName ||
    (listing.vendor ? `${listing.vendor.firstName} ${listing.vendor.lastName}` : "Vendor");

  // Calculate a simple monthly installment preview
  const canInstallment = listing.allowInstallment && listing.inStock;
  const upfrontAmount = listing.price * (listing.minUpfrontPercent / 100);
  const remainBase = listing.price - upfrontAmount;
  const markup6 = remainBase * (listing.installmentMarkup6m / 100);
  const monthly6 = (remainBase + markup6) / 6;

  // Build metadata display items
  const metaItems: { label: string; value: string }[] = [];
  if (listing.metadata) {
    const meta = listing.metadata as Record<string, unknown>;
    if (meta.bedrooms) metaItems.push({ label: "Bedrooms", value: String(meta.bedrooms) });
    if (meta.bathrooms) metaItems.push({ label: "Bathrooms", value: String(meta.bathrooms) });
    if (meta.sqm) metaItems.push({ label: "Size", value: `${meta.sqm} sqm` });
    if (meta.property_type) metaItems.push({ label: "Type", value: String(meta.property_type) });
    if (meta.make) metaItems.push({ label: "Make", value: String(meta.make) });
    if (meta.model) metaItems.push({ label: "Model", value: String(meta.model) });
    if (meta.year) metaItems.push({ label: "Year", value: String(meta.year) });
    if (meta.mileage) metaItems.push({ label: "Mileage", value: String(meta.mileage) });
    if (meta.condition) metaItems.push({ label: "Condition", value: String(meta.condition) });
    if (meta.transmission) metaItems.push({ label: "Transmission", value: String(meta.transmission) });
    if (meta.land_size) metaItems.push({ label: "Land Size", value: String(meta.land_size) });
    if (meta.type) metaItems.push({ label: "Type", value: String(meta.type) });
    if (meta.brand) metaItems.push({ label: "Brand", value: String(meta.brand) });
    if (meta.capacity) metaItems.push({ label: "Capacity", value: String(meta.capacity) });
    if (meta.warranty) metaItems.push({ label: "Warranty", value: String(meta.warranty) });
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: 16, overflow: "hidden", border: "none" }}>
          <div className="row g-0">
            {/* Left: Image Gallery */}
            <div className="col-md-6">
              <div className="listing-detail-gallery">
                {images[imgIdx] ? (
                  <img
                    src={images[imgIdx]}
                    alt={listing.title}
                    className="listing-detail-img"
                  />
                ) : (
                  <div className="listing-detail-img-placeholder">
                    {listing.category === "property" ? "\uD83C\uDFE0"
                      : listing.category === "automotive" ? "\uD83D\uDE97"
                      : listing.category === "agriculture" ? "\uD83C\uDF3E" : "\uD83D\uDCE6"}
                  </div>
                )}
                {hasMultipleImages && (
                  <>
                    <button
                      className="listing-gallery-nav prev"
                      onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      className="listing-gallery-nav next"
                      onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <div className="listing-gallery-dots">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`listing-gallery-dot ${i === imgIdx ? "active" : ""}`}
                          onClick={() => setImgIdx(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Category badge */}
                <span
                  className="listing-detail-category"
                  style={{ background: getCategoryColor(listing.category) }}
                >
                  {getCategoryLabel(listing.category)}
                </span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="col-md-6">
              <div className="listing-detail-info">
                {/* Close button */}
                <button
                  className="listing-detail-close"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

                <h3 className="listing-detail-title">{listing.title}</h3>

                <p className="listing-detail-price">{formatNaira(listing.price, false)}</p>

                <p className="listing-detail-location">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {" "}{listing.location}
                </p>

                {/* Vendor */}
                <div className="listing-detail-vendor">
                  <span className="listing-detail-vendor-avatar">
                    {getInitials(vendorName)}
                  </span>
                  <div>
                    <span className="listing-detail-vendor-name">{vendorName}</span>
                    <span className="listing-detail-vendor-label">Seller</span>
                  </div>
                </div>

                {/* Description */}
                <p className="listing-detail-desc">{listing.description}</p>

                {/* Metadata */}
                {metaItems.length > 0 && (
                  <div className="listing-detail-meta-grid">
                    {metaItems.map((item) => (
                      <div key={item.label} className="listing-detail-meta-item">
                        <span className="listing-detail-meta-label">{item.label}</span>
                        <span className="listing-detail-meta-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stock */}
                <div className="listing-detail-stock">
                  <FontAwesomeIcon icon={faBox} style={{ marginRight: 6 }} />
                  {listing.inStock ? (
                    <span style={{ color: "#059669" }}>In Stock ({listing.stockQuantity} available)</span>
                  ) : (
                    <span style={{ color: "#EF4444" }}>Out of Stock</span>
                  )}
                </div>

                {/* Installment Section — always visible */}
                <div className={`listing-detail-installment-section${canInstallment ? "" : " disabled"}`}>
                  <div className="listing-detail-installment-header">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    <strong>Installment Payments</strong>
                  </div>
                  {canInstallment ? (
                    <div className="listing-detail-installment-body">
                      <p className="listing-detail-installment-preview">
                        From <strong>{formatNaira(monthly6, false)}/month</strong> (6 months)
                        {listing.installmentMarkup6m === 0 && listing.installmentMarkup12m === 0
                          ? " — 0% markup"
                          : ` — ${listing.installmentMarkup6m}% markup`}
                      </p>
                      <ul className="listing-detail-installment-steps">
                        <li>Pay {listing.minUpfrontPercent}% upfront ({formatNaira(upfrontAmount, false)})</li>
                        <li>Spread remaining balance over 6 or 12 months</li>
                        <li>Monthly auto-debit from your PenniVault wallet</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="listing-detail-installment-body">
                      <p className="listing-detail-installment-unavailable">
                        {!listing.inStock
                          ? "Installment payments are not available for out-of-stock items."
                          : "This vendor does not offer installment payments for this listing. You can purchase this item outright using your wallet."}
                      </p>
                      <p className="listing-detail-installment-hint">
                        Installment payments let you spread the cost over 6 or 12 months with a small markup set by the vendor.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="listing-detail-actions">
                  <button
                    className="quick-action-btn primary listing-detail-buy-btn"
                    onClick={onBuyNow}
                    disabled={!listing.inStock}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    {" "}{listing.inStock ? "Buy Now" : "Out of Stock"}
                  </button>
                  <button
                    className={`quick-action-btn listing-detail-installment-btn${canInstallment ? " outline" : ""}`}
                    onClick={canInstallment ? onInstallment : undefined}
                    disabled={!canInstallment}
                    title={
                      !listing.allowInstallment
                        ? "Vendor does not offer installments"
                        : !listing.inStock
                          ? "Out of stock"
                          : "Pay in installments"
                    }
                    style={{
                      opacity: canInstallment ? 1 : 0.45,
                      cursor: canInstallment ? "pointer" : "not-allowed",
                    }}
                  >
                    <FontAwesomeIcon icon={faTag} />
                    {" "}Pay in Installments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
