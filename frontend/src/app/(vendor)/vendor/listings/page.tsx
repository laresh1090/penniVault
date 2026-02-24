"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faMagnifyingGlass,
  faGrip,
  faList,
  faBox,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import { useVendorListings } from "@/hooks/useVendorListings";
import { useMutateListing } from "@/hooks/useMutateListing";
import { formatNaira, formatDate } from "@/lib/formatters";

export default function VendorListingsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { listings, isLoading, refetch } = useVendorListings();
  const { deleteListing, isSubmitting } = useMutateListing();

  const filteredListings = listings.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
    if (
      searchQuery.trim() &&
      !l.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const ok = await deleteListing(id);
    if (ok) refetch();
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "property":
        return "Property";
      case "automotive":
        return "Automotive";
      case "agriculture":
        return "Agriculture";
      default:
        return "Other";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "active";
      case "sold":
        return "sold";
      case "draft":
        return "draft";
      case "archived":
        return "archived";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ padding: "60px 0" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#EB5310" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
      >
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1E252F",
              marginBottom: 4,
            }}
          >
            My Listings
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Manage your marketplace listings
          </p>
        </div>
        <button
          className="quick-action-btn primary"
          style={{ fontSize: 14, padding: "10px 20px" }}
          onClick={() => router.push("/vendor/listings/new")}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Listing
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dash-card mb-4">
        <div
          style={{ padding: "16px 24px" }}
          className="d-flex align-items-center gap-3 flex-wrap"
        >
          <FontAwesomeIcon
            icon={faFilter}
            style={{ color: "#94A3B8", fontSize: 14 }}
          />
          <select
            className="form-select form-select-sm"
            style={{ width: "auto", minWidth: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto", minWidth: 160 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="property">Property</option>
            <option value="automotive">Automotive</option>
            <option value="agriculture">Agriculture</option>
            <option value="other">Other</option>
          </select>
          <div className="position-relative" style={{ flex: "1 1 200px", maxWidth: 320 }}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                fontSize: 13,
              }}
            />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div className="btn-group btn-group-sm ms-auto">
            <button
              className={`btn btn-outline-secondary${viewMode === "grid" ? " active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <FontAwesomeIcon icon={faGrip} />
            </button>
            <button
              className={`btn btn-outline-secondary${viewMode === "table" ? " active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      </div>

      {/* Listings Content */}
      {filteredListings.length === 0 ? (
        <div className="dash-card">
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
            }}
          >
            <FontAwesomeIcon
              icon={faBox}
              style={{
                fontSize: 48,
                color: "#CBD5E1",
                marginBottom: 16,
                display: "block",
              }}
            />
            <h4
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#1E252F",
                marginBottom: 8,
              }}
            >
              No listings found
            </h4>
            <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters or search query."
                : "You haven't created any listings yet. Start by adding your first listing."}
            </p>
            {!searchQuery && statusFilter === "all" && categoryFilter === "all" && (
              <button
                className="quick-action-btn primary"
                style={{ fontSize: 14, padding: "10px 20px" }}
                onClick={() => router.push("/vendor/listings/new")}
              >
                <FontAwesomeIcon icon={faPlus} /> Create Your First Listing
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="row g-3">
          {filteredListings.map((listing) => (
            <div className="col-xl-3 col-md-4 col-sm-6" key={listing.id}>
              <div className="listing-card">
                <div className="listing-card-img">
                  {listing.primaryImage ? (
                    <img src={listing.primaryImage} alt={listing.title} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        color: "#CBD5E1",
                      }}
                    >
                      {listing.category === "property"
                        ? "\uD83C\uDFE0"
                        : listing.category === "automotive"
                          ? "\uD83D\uDE97"
                          : listing.category === "agriculture"
                            ? "\uD83C\uDF31"
                            : "\uD83D\uDCE6"}
                    </div>
                  )}
                  <span
                    className={`listing-status-badge ${getStatusClass(listing.status)}`}
                    style={
                      listing.status === "draft"
                        ? { background: "rgba(100,116,139,0.9)" }
                        : listing.status === "archived"
                          ? { background: "rgba(107,114,128,0.9)" }
                          : undefined
                    }
                  >
                    {listing.status.charAt(0).toUpperCase() +
                      listing.status.slice(1)}
                  </span>
                </div>
                <div className="listing-card-body">
                  <h5 className="listing-card-title">{listing.title}</h5>
                  <span className="listing-card-category">
                    {getCategoryLabel(listing.category)}
                  </span>
                  <p className="listing-card-price">
                    {formatNaira(listing.price, false)}
                  </p>
                  <div className="listing-card-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        router.push(`/vendor/listings/${listing.id}/edit`)
                      }
                    >
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(listing.id)}
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dash-card">
          <div style={{ padding: "0 24px 24px" }}>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Stock</th>
                    <th>Listed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <strong>{listing.title}</strong>
                      </td>
                      <td>{getCategoryLabel(listing.category)}</td>
                      <td>{formatNaira(listing.price, false)}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(listing.status)}`}
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                      </td>
                      <td>{listing.stockQuantity}</td>
                      <td>{formatDate(listing.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() =>
                            router.push(`/vendor/listings/${listing.id}/edit`)
                          }
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(listing.id)}
                          disabled={isSubmitting}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
