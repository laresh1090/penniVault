"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCartShopping,
  faEye,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useListings } from "@/hooks/useListings";
import { formatNaira } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import BuyFromWalletModal from "@/components/marketplace/BuyFromWalletModal";
import ListingDetailModal from "@/components/marketplace/ListingDetailModal";
import InstallmentPurchaseModal from "@/components/marketplace/InstallmentPurchaseModal";
import type { Listing, ListingFilters } from "@/types";

function getCategoryBadgeStyle(category: string): React.CSSProperties {
  if (category === "automotive") {
    return { background: "rgba(16, 185, 129, 0.9)" };
  }
  if (category === "agriculture") {
    return { background: "rgba(245, 158, 11, 0.9)" };
  }
  return {};
}

function getCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<ListingFilters["sort"]>("newest");
  const [installmentOnly, setInstallmentOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [buyListing, setBuyListing] = useState<Listing | null>(null);
  const [viewListing, setViewListing] = useState<Listing | null>(null);
  const [installmentListing, setInstallmentListing] = useState<Listing | null>(null);

  const filters = useMemo<ListingFilters>(
    () => ({
      search: searchQuery || undefined,
      category: categoryFilter as ListingFilters["category"],
      sort: sortBy,
      installmentOnly: installmentOnly || undefined,
      page: currentPage,
      perPage: 6,
    }),
    [searchQuery, categoryFilter, sortBy, installmentOnly, currentPage],
  );

  const { listings, meta, isLoading, refetch } = useListings(filters);

  const totalPages = meta?.totalPages ?? 1;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val as ListingFilters["sort"]);
    setCurrentPage(1);
  };

  const handleInstallmentToggle = () => {
    setInstallmentOnly(!installmentOnly);
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVendorName = (listing: Listing) =>
    listing.vendor?.vendorProfile?.businessName
    || (listing.vendor ? `${listing.vendor.firstName} ${listing.vendor.lastName}` : "Vendor");

  return (
    <>
      {/* Page Heading */}
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E252F", marginBottom: 24 }}>
        Marketplace
      </h2>

      {/* Search & Filter Bar */}
      <div className="dash-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 14,
                background: "#F8FAFC",
                transition: "border-color 0.2s",
              }}
            />
          </div>
          <div className="col-md-3">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 14,
                background: "#F8FAFC",
                cursor: "pointer",
              }}
            >
              <option value="all">All Categories</option>
              <option value="property">Property</option>
              <option value="automotive">Automotive</option>
              <option value="agriculture">Agriculture</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-2">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 14,
                background: "#F8FAFC",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price Low to High</option>
              <option value="price_desc">Price High to Low</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              onClick={handleInstallmentToggle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 8,
                border: installmentOnly ? "2px solid #EB5310" : "1px solid #E2E8F0",
                background: installmentOnly ? "rgba(235, 83, 16, 0.08)" : "#F8FAFC",
                color: installmentOnly ? "#EB5310" : "#64748B",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Installment
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
          <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {!isLoading && (
        <div className="row g-4 mb-4">
          {listings.map((listing) => (
            <div key={listing.id} className="col-xl-4 col-md-6">
              <div className="marketplace-card">
                <div className="marketplace-card-img">
                  {listing.primaryImage ? (
                    <img
                      src={listing.primaryImage}
                      alt={listing.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#CBD5E1",
                        fontSize: 40,
                      }}
                    >
                      {listing.category === "property" ? "\uD83C\uDFE0"
                        : listing.category === "automotive" ? "\uD83D\uDE97"
                        : listing.category === "agriculture" ? "\uD83C\uDF3E" : "\uD83D\uDCE6"}
                    </div>
                  )}
                  <span
                    className="marketplace-category-badge"
                    style={getCategoryBadgeStyle(listing.category)}
                  >
                    {getCategoryLabel(listing.category)}
                  </span>
                </div>
                <div className="marketplace-card-body">
                  <h4 className="marketplace-card-title">{listing.title}</h4>
                  <p className="marketplace-card-location">
                    <FontAwesomeIcon icon={faLocationDot} />
                    {" "}{listing.location}
                  </p>
                  <p className="marketplace-card-price">{formatNaira(listing.price, false)}</p>
                  <span
                    className={`marketplace-installment-badge${listing.allowInstallment ? "" : " disabled"}`}
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    {listing.allowInstallment ? " Installment Available" : " No Installment"}
                  </span>
                  <div className="marketplace-card-vendor">
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#EFF6FF",
                        color: "#3B82F6",
                        fontSize: 10,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getInitials(getVendorName(listing))}
                    </span>
                    {getVendorName(listing)}
                  </div>
                  <div className="marketplace-card-actions">
                    <button
                      className="quick-action-btn primary"
                      style={{ fontSize: 13, padding: "8px 12px", flex: 1, justifyContent: "center" }}
                      onClick={() => setBuyListing(listing)}
                      disabled={!listing.inStock}
                    >
                      <FontAwesomeIcon icon={faCartShopping} />{" "}
                      {listing.inStock ? "Buy" : "Out of Stock"}
                    </button>
                    <button
                      className={`quick-action-btn${listing.allowInstallment && listing.inStock ? " installment" : " outline"}`}
                      style={{
                        fontSize: 13,
                        padding: "8px 12px",
                        flex: 1,
                        justifyContent: "center",
                        opacity: listing.allowInstallment && listing.inStock ? 1 : 0.5,
                        cursor: listing.allowInstallment && listing.inStock ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (listing.allowInstallment && listing.inStock) setInstallmentListing(listing);
                      }}
                      disabled={!listing.allowInstallment || !listing.inStock}
                      title={
                        !listing.allowInstallment
                          ? "Vendor does not offer installment for this listing"
                          : !listing.inStock
                            ? "Out of stock"
                            : "Pay in installments"
                      }
                    >
                      <FontAwesomeIcon icon={faCalendarCheck} /> Installment
                    </button>
                    <button
                      className="quick-action-btn outline"
                      style={{ fontSize: 13, padding: "8px 12px" }}
                      onClick={() => setViewListing(listing)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && listings.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            No listings found
          </p>
          <p style={{ marginBottom: 0 }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <nav aria-label="Marketplace pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item${currentPage <= 1 ? " disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
            </li>
            {pageNumbers.map((page) => (
              <li
                key={page}
                className={`page-item${currentPage === page ? " active" : ""}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item${currentPage >= totalPages ? " disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Detail Modal */}
      {viewListing && (
        <ListingDetailModal
          listing={viewListing}
          onClose={() => setViewListing(null)}
          onBuyNow={() => {
            const listing = viewListing;
            setViewListing(null);
            setBuyListing(listing);
          }}
          onInstallment={() => {
            const listing = viewListing;
            setViewListing(null);
            setInstallmentListing(listing);
          }}
        />
      )}

      {/* Buy Modal */}
      {buyListing && (
        <BuyFromWalletModal
          listing={buyListing}
          onClose={() => setBuyListing(null)}
          onSuccess={() => refetch()}
        />
      )}

      {/* Installment Purchase Modal */}
      {installmentListing && (
        <InstallmentPurchaseModal
          listing={installmentListing}
          onClose={() => setInstallmentListing(null)}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}
