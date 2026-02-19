"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faMoneyBillWave,
  faShoppingCart,
  faEye,
  faTableColumns,
  faGripVertical,
  faPlusCircle,
  faWallet,
  faCoins,
  faHandHoldingDollar,
  faHeart,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import KpiCard from "@/components/ui/KpiCard";
import DashCard from "@/components/ui/DashCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import SalesAnalyticsChart from "@/components/dashboard/SalesAnalyticsChart";
import AddListingModal from "@/components/dashboard/AddListingModal";

import {
  mockVendorOrders,
  mockVendorListings,
  mockSalesChartData,
} from "@/data/dashboard";

import { formatNaira, formatDate, formatCompactNaira } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table";
type StatusFilter = "all" | "active" | "draft" | "sold";

export default function VendorDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAddListing, setShowAddListing] = useState(false);

  const filteredListings = useMemo(() => {
    if (statusFilter === "all") return mockVendorListings;
    return mockVendorListings.filter((l) => l.status === statusFilter);
  }, [statusFilter]);

  const topListings = useMemo(() => {
    return [...mockVendorListings]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, []);

  const orderTableData = useMemo(() => {
    return mockVendorOrders.map((order) => ({
      buyer: order.buyerName,
      asset: order.assetTitle,
      amount: formatNaira(order.amount, false),
      status: order.status,
      date: formatDate(order.createdAt),
      _raw: order,
    })) as Record<string, unknown>[];
  }, []);

  const listingTableData = useMemo(() => {
    return filteredListings.map((listing) => ({
      title: listing.title,
      category: listing.category.charAt(0).toUpperCase() + listing.category.slice(1),
      price: listing.price,
      views: listing.views,
      savers: listing.saversCount,
      status: listing.status,
      id: listing.id,
      _raw: listing,
    })) as Record<string, unknown>[];
  }, [filteredListings]);

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>
        Vendor Dashboard
      </h2>

      {/* Row 1 - KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <KpiCard
            icon={faList}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            value="8"
            label="Total Listings"
            trend={{ value: "+2 this month", direction: "up" }}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <KpiCard
            icon={faMoneyBillWave}
            iconBg="#FFF3EE"
            iconColor="#EB5310"
            value={"\u20A612.5M"}
            label="Total Revenue"
            trend={{ value: "+15.3%", direction: "up" }}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <KpiCard
            icon={faShoppingCart}
            iconBg="#ECFDF5"
            iconColor="#059669"
            value="3"
            label="Pending Orders"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <KpiCard
            icon={faEye}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
            value="1,247"
            label="Views This Month"
            trend={{ value: "+22%", direction: "up" }}
          />
        </div>
      </div>

      {/* Row 2 - Sales Analytics Chart */}
      <div className="mb-4">
        <DashCard title="Sales Analytics">
          <SalesAnalyticsChart data={mockSalesChartData} />
        </DashCard>
      </div>

      {/* Row 3 - Recent Orders + Top Listings */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <DashCard
            title="Recent Orders & Inquiries"
            actionLabel="View All"
            actionHref="/vendor/orders"
          >
            <DataTable
              columns={[
                { key: "buyer", header: "Buyer" },
                { key: "asset", header: "Asset" },
                { key: "amount", header: "Amount" },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => {
                    const status = item.status as string;
                    const statusMap: Record<string, "active" | "pending" | "completed" | "overdue"> = {
                      pending: "pending",
                      confirmed: "active",
                      completed: "completed",
                      cancelled: "overdue",
                    };
                    return <StatusBadge status={statusMap[status] ?? "pending"} />;
                  },
                },
                { key: "date", header: "Date" },
              ]}
              data={orderTableData}
            />
          </DashCard>
        </div>
        <div className="col-lg-5">
          <DashCard title="Top Performing Listings">
            <div className="top-listings-list">
              {topListings.map((listing, idx) => (
                <div key={listing.id} className="top-listing-item">
                  <div className="top-listing-rank">{idx + 1}</div>
                  <div className="top-listing-info">
                    <div className="top-listing-title">{listing.title}</div>
                    <div className="top-listing-meta">
                      <span>
                        <FontAwesomeIcon icon={faEye} style={{ marginRight: 4 }} />
                        {listing.views.toLocaleString()} views
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faHeart} style={{ marginRight: 4 }} />
                        {listing.saversCount} savers
                      </span>
                    </div>
                  </div>
                  <div className="top-listing-price">
                    {formatCompactNaira(listing.price)}
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      </div>

      {/* Row 4 - My Listings with Grid/Table Toggle */}
      <div className="mb-4">
        <div className="dash-card">
          <div className="dash-card-header" style={{ flexWrap: "wrap", gap: 12 }}>
            <h3>My Listings</h3>
            <div className="d-flex align-items-center gap-2 flex-wrap" style={{ marginLeft: "auto" }}>
              {/* Filter Buttons */}
              <div className="btn-group btn-group-sm">
                {(["all", "active", "draft", "sold"] as StatusFilter[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={cn(
                        "btn",
                        statusFilter === filter
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      )}
                      onClick={() => setStatusFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                )}
              </div>

              {/* View Toggle */}
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={cn(
                    "btn",
                    viewMode === "grid"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  )}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <FontAwesomeIcon icon={faGripVertical} />
                </button>
                <button
                  type="button"
                  className={cn(
                    "btn",
                    viewMode === "table"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  )}
                  onClick={() => setViewMode("table")}
                  title="Table view"
                >
                  <FontAwesomeIcon icon={faTableColumns} />
                </button>
              </div>

              {/* Add Listing */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddListing(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: 6 }} />
                Add Listing
              </button>
            </div>
          </div>

          <div className="dash-card-body">
            {filteredListings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#94A3B8" }}>
                <p style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                  No listings found
                </p>
                <p>Try adjusting your filter or add a new listing.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="row g-4">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="col-lg-4 col-md-6">
                    <div className="listing-card">
                      <div className="listing-img">
                        <div
                          style={{
                            width: "100%",
                            height: 180,
                            background: "#F1F5F9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94A3B8",
                            fontSize: 14,
                          }}
                        >
                          {listing.category === "property"
                            ? "Property Image"
                            : listing.category === "automotive"
                            ? "Vehicle Image"
                            : "Product Image"}
                        </div>
                        <span
                          className={cn("listing-status", listing.status)}
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                      </div>
                      <div className="listing-body">
                        <div className="listing-title">{listing.title}</div>
                        <div className="listing-category">
                          {listing.category.charAt(0).toUpperCase() +
                            listing.category.slice(1)}
                        </div>
                        <div className="listing-price">
                          {formatNaira(listing.price, false)}
                        </div>
                        <div className="listing-stats">
                          <span>
                            <FontAwesomeIcon icon={faEye} /> {listing.views}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faHeart} />{" "}
                            {listing.saversCount}
                          </span>
                        </div>
                        <div className="listing-actions">
                          <button type="button">
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                          <button type="button">
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DataTable
                columns={[
                  { key: "title", header: "Title" },
                  { key: "category", header: "Category" },
                  {
                    key: "price",
                    header: "Price",
                    render: (item) =>
                      formatNaira(item.price as number, false),
                  },
                  {
                    key: "views",
                    header: "Views",
                    render: (item) =>
                      (item.views as number).toLocaleString(),
                  },
                  { key: "savers", header: "Savers" },
                  {
                    key: "status",
                    header: "Status",
                    render: (item) => {
                      const s = item.status as string;
                      const map: Record<string, "active" | "draft" | "completed"> = {
                        active: "active",
                        draft: "draft",
                        sold: "completed",
                      };
                      return <StatusBadge status={map[s] ?? "active"} />;
                    },
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: () => (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={listingTableData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Row 5 - Wallet & Earnings Summary */}
      <div className="mb-4">
        <DashCard title="Wallet & Earnings Summary">
          <div className="row g-4">
            <div className="col-md-4">
              <div
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  background: "#F0FDF4",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                    fontSize: 20,
                  }}
                >
                  <FontAwesomeIcon icon={faWallet} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      marginBottom: 2,
                    }}
                  >
                    Available Balance
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#059669",
                    }}
                  >
                    {formatNaira(3450000, false)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  background: "#FFFBEB",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D97706",
                    fontSize: 20,
                  }}
                >
                  <FontAwesomeIcon icon={faCoins} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      marginBottom: 2,
                    }}
                  >
                    Pending Withdrawals
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#D97706",
                    }}
                  >
                    {formatNaira(500000, false)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="d-flex align-items-center gap-3 p-3"
                style={{
                  background: "#EFF6FF",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3B82F6",
                    fontSize: 20,
                  }}
                >
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      marginBottom: 2,
                    }}
                  >
                    Total Earned
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#3B82F6",
                    }}
                  >
                    {formatNaira(12500000, false)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashCard>
      </div>

      {/* Add Listing Modal */}
      <AddListingModal
        isOpen={showAddListing}
        onClose={() => setShowAddListing(false)}
      />
    </div>
  );
}
