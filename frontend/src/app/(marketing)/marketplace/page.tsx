"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLocationDot,
  faHouseChimney,
  faCar,
  faStar,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";

import Pagination from "@/components/ui/Pagination";
import { mockAssets } from "@/data/assets";
import { formatNaira } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";

type CategoryFilter = "all" | "property" | "automotive" | "lifestyle";
type PriceFilter = "all" | "under10m" | "10m-50m" | "50m-100m" | "over100m";
type LocationFilter = "all" | "lagos" | "abuja" | "other";

const ITEMS_PER_PAGE = 8;

function getCategoryIcon(category: string) {
  switch (category) {
    case "property":
      return faHouseChimney;
    case "automotive":
      return faCar;
    default:
      return faStar;
  }
}

function getCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssets = useMemo(() => {
    let result = [...mockAssets];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.vendorName.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      result = result.filter((a) => {
        switch (priceFilter) {
          case "under10m":
            return a.price < 10_000_000;
          case "10m-50m":
            return a.price >= 10_000_000 && a.price <= 50_000_000;
          case "50m-100m":
            return a.price > 50_000_000 && a.price <= 100_000_000;
          case "over100m":
            return a.price > 100_000_000;
          default:
            return true;
        }
      });
    }

    // Location filter
    if (locationFilter !== "all") {
      result = result.filter((a) => {
        const loc = a.location.toLowerCase();
        switch (locationFilter) {
          case "lagos":
            return loc.includes("lagos") || loc.includes("lekki") || loc.includes("ikoyi") || loc.includes("ajah") || loc.includes("victoria island") || loc.includes("banana island");
          case "abuja":
            return loc.includes("abuja");
          case "other":
            return !(
              loc.includes("lagos") ||
              loc.includes("lekki") ||
              loc.includes("ikoyi") ||
              loc.includes("ajah") ||
              loc.includes("victoria island") ||
              loc.includes("banana island") ||
              loc.includes("abuja")
            );
          default:
            return true;
        }
      });
    }

    return result;
  }, [searchQuery, categoryFilter, priceFilter, locationFilter]);

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);

  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(setter: (val: T) => void) => (val: T) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "#F8FAFC", padding: "48px 0 32px" }}>
        <div className="container">
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#1E252F",
              marginBottom: 8,
            }}
          >
            Marketplace
          </h1>
          <p style={{ color: "#64748B", fontSize: "1.0625rem", marginBottom: 0 }}>
            Browse verified property, automotive, and lifestyle listings from
            trusted vendors.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="container" style={{ marginTop: 24 }}>
        <div
          className="marketplace-search-bar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: "20px 24px",
            background: "#FFFFFF",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* Search Input */}
          <div style={{ flex: "1 1 280px", position: "relative" }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                fontSize: 14,
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                paddingLeft: 40,
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                height: 44,
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) =>
              handleFilterChange(setCategoryFilter)(e.target.value as CategoryFilter)
            }
            style={{
              flex: "0 1 180px",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              height: 44,
              color: categoryFilter === "all" ? "#94A3B8" : "#1E252F",
            }}
          >
            <option value="all">All Categories</option>
            <option value="property">Property</option>
            <option value="automotive">Automotive</option>
            <option value="lifestyle">Lifestyle</option>
          </select>

          {/* Price Range */}
          <select
            className="form-select"
            value={priceFilter}
            onChange={(e) =>
              handleFilterChange(setPriceFilter)(e.target.value as PriceFilter)
            }
            style={{
              flex: "0 1 180px",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              height: 44,
              color: priceFilter === "all" ? "#94A3B8" : "#1E252F",
            }}
          >
            <option value="all">Any Price</option>
            <option value="under10m">Under {"\u20A6"}10M</option>
            <option value="10m-50m">{"\u20A6"}10M - {"\u20A6"}50M</option>
            <option value="50m-100m">{"\u20A6"}50M - {"\u20A6"}100M</option>
            <option value="over100m">Over {"\u20A6"}100M</option>
          </select>

          {/* Location Filter */}
          <select
            className="form-select"
            value={locationFilter}
            onChange={(e) =>
              handleFilterChange(setLocationFilter)(e.target.value as LocationFilter)
            }
            style={{
              flex: "0 1 160px",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              height: 44,
              color: locationFilter === "all" ? "#94A3B8" : "#1E252F",
            }}
          >
            <option value="all">All Locations</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {paginatedAssets.length > 0 ? (
          <div className="row g-4">
            {paginatedAssets.map((asset) => (
              <div key={asset.id} className="col-md-6 col-lg-4 col-xl-3">
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  className="marketplace-listing-card"
                >
                  {/* Image Placeholder */}
                  <div
                    style={{
                      height: 200,
                      background: "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={getCategoryIcon(asset.category)}
                      style={{ fontSize: 40, color: "#CBD5E1" }}
                    />
                    {/* Category Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "#EB5310",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {getCategoryLabel(asset.category)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div
                    style={{
                      padding: "16px 16px 20px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "#1E252F",
                        marginBottom: 6,
                        lineHeight: 1.4,
                      }}
                    >
                      {asset.title}
                    </h3>

                    {/* Location */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "#64748B",
                        marginBottom: 10,
                      }}
                    >
                      <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 12 }} />
                      {asset.location}
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 800,
                        color: "#EB5310",
                        marginBottom: 12,
                      }}
                    >
                      {formatNaira(asset.price, false)}
                    </div>

                    {/* Vendor Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "#EFF6FF",
                            color: "#3B82F6",
                            fontSize: 11,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {getInitials(asset.vendorName)}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#475569",
                            fontWeight: 500,
                          }}
                        >
                          {asset.vendorName}
                        </span>
                      </div>

                      {/* Savers Count */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "#059669",
                          fontWeight: 600,
                        }}
                      >
                        <FontAwesomeIcon icon={faPiggyBank} style={{ fontSize: 12 }} />
                        {asset.saversCount} {asset.saversCount === 1 ? "saver" : "savers"}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: "auto",
                      }}
                    >
                      <Link
                        href={`/savings/new?asset=${asset.id}`}
                        className="btn btn-primary btn-sm"
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: "8px 12px",
                        }}
                      >
                        Start Saving
                      </Link>
                      <Link
                        href={`/marketplace/${asset.id}`}
                        className="btn btn-outline-primary btn-sm"
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: "8px 12px",
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "#94A3B8",
            }}
          >
            <p style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8 }}>
              No listings found
            </p>
            <p style={{ marginBottom: 0 }}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        <div style={{ marginTop: 32 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
