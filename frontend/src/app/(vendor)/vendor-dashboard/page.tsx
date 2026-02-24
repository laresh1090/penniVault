"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faNairaSign,
  faClock,
  faEye,
  faArrowRight,
  faChartArea,
  faPen,
  faTrash,
  faList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { useVendorListings } from "@/hooks/useVendorListings";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { useWallet } from "@/hooks";
import { useMutateListing } from "@/hooks/useMutateListing";
import { formatNaira, formatDate } from "@/lib/formatters";

type ViewMode = "grid" | "table";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { listings, isLoading: listingsLoading, refetch: refetchListings } = useVendorListings();
  const { orders, isLoading: ordersLoading } = useVendorOrders();
  const { wallet } = useWallet();
  const { deleteListing, isSubmitting } = useMutateListing();

  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === "active").length;
  const totalSalesAmount = orders
    .filter((o) => o.status === "confirmed" || o.status === "delivered")
    .reduce((s, o) => s + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const filteredListings = listings.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
    return true;
  });

  const recentOrders = orders.slice(0, 4);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const ok = await deleteListing(id);
    if (ok) refetchListings();
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "property": return "Property";
      case "automotive": return "Automotive";
      case "agriculture": return "Agriculture";
      default: return "Other";
    }
  };

  if (listingsLoading && ordersLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Row 1: KPI Metric Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="wallet-card real-wallet">
            <div className="wallet-icon" style={{ background: "#FFF3EE", color: "#EB5310" }}>
              <FontAwesomeIcon icon={faGrip} />
            </div>
            <p className="wallet-label">Total Listings</p>
            <p className="wallet-amount">{totalListings}</p>
            <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>
              {activeListings} active
            </span>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="wallet-card monthly-rate">
            <div className="wallet-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>
              <FontAwesomeIcon icon={faNairaSign} />
            </div>
            <p className="wallet-label">Total Sales</p>
            <p className="wallet-amount">{formatNaira(totalSalesAmount, false)}</p>
            <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
              {orders.length} total orders
            </span>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="wallet-card virtual-wallet">
            <div className="wallet-icon" style={{ background: "#FFF8EB", color: "#F59E0B" }}>
              <FontAwesomeIcon icon={faClock} />
            </div>
            <p className="wallet-label">Pending Orders</p>
            <p className="wallet-amount">{pendingOrders}</p>
            <Link href="/vendor/orders" className="wallet-action">
              Review Now <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="wallet-card total-savings">
            <div className="wallet-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
              <FontAwesomeIcon icon={faEye} />
            </div>
            <p className="wallet-label">Wallet Balance</p>
            <p className="wallet-amount">{formatNaira(wallet?.realBalance ?? 0, false)}</p>
            <Link href="/wallet" className="wallet-action">
              Manage <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Analytics Placeholder */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Sales Analytics</h3>
        </div>
        <div
          style={{
            height: 200,
            background: "linear-gradient(180deg, #FFF3EE 0%, #FFFFFF 100%)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94A3B8",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faChartArea}
              style={{ fontSize: 48, marginBottom: 12, display: "block", color: "#CBD5E1" }}
            />
            <p style={{ margin: 0, fontSize: 14 }}>Sales analytics coming soon</p>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Recent Orders</h3>
          <Link href="/vendor/orders" className="card-action">View All</Link>
        </div>
        {ordersLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recentOrders.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>No orders yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const buyerName = order.buyer
                    ? `${order.buyer.firstName} ${order.buyer.lastName?.[0] || ""}.`
                    : "Customer";
                  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                  const statusClass =
                    order.status === "pending" ? "pending"
                    : order.status === "confirmed" || order.status === "delivered" ? "active"
                    : "pending";
                  return (
                    <tr key={order.id}>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{buyerName}</td>
                      <td>{order.listing?.title || "—"}</td>
                      <td><span className={`status-badge ${statusClass}`}>{statusLabel}</span></td>
                      <td><strong>{formatNaira(order.amount, false)}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 4: My Listings */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">My Listings</h3>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <select className="form-select form-select-sm" style={{ width: "auto" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
            </select>
            <select className="form-select form-select-sm" style={{ width: "auto" }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="property">Property</option>
              <option value="automotive">Automotive</option>
              <option value="agriculture">Agriculture</option>
              <option value="other">Other</option>
            </select>
            <div className="btn-group btn-group-sm">
              <button className={`btn btn-outline-secondary${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>
                <FontAwesomeIcon icon={faGrip} />
              </button>
              <button className={`btn btn-outline-secondary${viewMode === "table" ? " active" : ""}`} onClick={() => setViewMode("table")}>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <button className="quick-action-btn primary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => router.push("/vendor/listings/new")}>
              <FontAwesomeIcon icon={faPlus} /> Add Listing
            </button>
          </div>
        </div>

        {listingsLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>No listings match your filters.</p>
        ) : viewMode === "grid" ? (
          <div className="row g-3" style={{ padding: "0 24px 24px" }}>
            {filteredListings.slice(0, 8).map((listing) => (
              <div className="col-xl-3 col-md-4 col-sm-6" key={listing.id}>
                <div className="listing-card">
                  <div className="listing-card-img">
                    {listing.primaryImage ? (
                      <img src={listing.primaryImage} alt={listing.title} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#CBD5E1" }}>
                        {listing.category === "property" ? "\uD83C\uDFE0" : listing.category === "automotive" ? "\uD83D\uDE97" : "\uD83D\uDCE6"}
                      </div>
                    )}
                    <span className={`listing-status-badge ${listing.status === "active" ? "active" : listing.status === "sold" ? "sold" : ""}`} style={listing.status === "draft" ? { background: "rgba(100,116,139,0.9)" } : undefined}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                  <div className="listing-card-body">
                    <h5 className="listing-card-title">{listing.title}</h5>
                    <span className="listing-card-category">{getCategoryLabel(listing.category)}</span>
                    <p className="listing-card-price">{formatNaira(listing.price, false)}</p>
                    <div className="listing-card-actions">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => router.push(`/vendor/listings/${listing.id}/edit`)}>
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(listing.id)} disabled={isSubmitting}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "0 24px 24px" }}>
            <div className="table-responsive">
              <table className="dash-table">
                <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Status</th><th>Stock</th><th>Listed</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id}>
                      <td><strong>{listing.title}</strong></td>
                      <td>{getCategoryLabel(listing.category)}</td>
                      <td>{formatNaira(listing.price, false)}</td>
                      <td><span className={`status-badge ${listing.status}`}>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</span></td>
                      <td>{listing.stockQuantity}</td>
                      <td>{formatDate(listing.createdAt)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => router.push(`/vendor/listings/${listing.id}/edit`)}>
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(listing.id)} disabled={isSubmitting}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Row 5: Wallet Summary */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Wallet &amp; Earnings</h3>
          <Link href="/wallet" className="card-action">Full Details</Link>
        </div>
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center">
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Available Balance</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#1E252F", marginBottom: 8 }}>{formatNaira(wallet?.realBalance ?? 0, false)}</p>
            <Link href="/wallet" className="quick-action-btn primary" style={{ fontSize: 13 }}>Manage Wallet</Link>
          </div>
          <div className="col-md-6 text-center">
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Total Sales Revenue</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#059669", marginBottom: 0 }}>{formatNaira(totalSalesAmount, false)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
