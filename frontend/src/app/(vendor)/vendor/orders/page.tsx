"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFileInvoice,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";

import { useVendorOrders } from "@/hooks/useVendorOrders";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { OrderStatus } from "@/types";

export default function VendorOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const { orders, isLoading } = useVendorOrders(
    statusFilter !== "all" ? { status: statusFilter } : undefined,
  );

  const getStatusBadge = (status: string) => {
    let bg: string;
    let color: string;
    switch (status) {
      case "pending":
        bg = "#FFF8EB";
        color = "#D97706";
        break;
      case "confirmed":
      case "delivered":
        bg = "#ECFDF5";
        color = "#059669";
        break;
      case "cancelled":
        bg = "#FEF2F2";
        color = "#DC2626";
        break;
      case "refunded":
        bg = "#FFF7ED";
        color = "#EA580C";
        break;
      default:
        bg = "#F1F5F9";
        color = "#64748B";
    }
    return { bg, color };
  };

  if (isLoading) {
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E252F", marginBottom: 4 }}>
            Orders
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Track and manage orders from your listings
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dash-card mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap" style={{ padding: "16px 24px" }}>
          <FontAwesomeIcon icon={faFilter} style={{ color: "#64748B", fontSize: 14 }} />
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">
            <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: 8 }} />
            Order History
          </h3>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <FontAwesomeIcon
              icon={faInbox}
              style={{ fontSize: 48, color: "#CBD5E1", marginBottom: 16, display: "block" }}
            />
            <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1E252F", marginBottom: 8 }}>
              No orders found
            </h4>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
              {statusFilter !== "all"
                ? "No orders match the selected filter. Try a different status."
                : "When customers purchase from your listings, orders will appear here."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Commission (5%)</th>
                  <th>Vendor Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const buyerName = order.buyer
                    ? `${order.buyer.firstName} ${order.buyer.lastName}`
                    : "Customer";
                  const itemTitle = order.listing?.title || "--";
                  const statusLabel =
                    order.status.charAt(0).toUpperCase() + order.status.slice(1);
                  const badge = getStatusBadge(order.status);

                  return (
                    <tr key={order.id}>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 13,
                            color: "#64748B",
                          }}
                        >
                          {order.reference}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "#1E252F" }}>{buyerName}</strong>
                      </td>
                      <td>{itemTitle}</td>
                      <td>
                        <strong>{formatNaira(order.amount, false)}</strong>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 12,
                            background: order.paymentMethod === "installment" ? "#FFF3EE" : "#ECFDF5",
                            color: order.paymentMethod === "installment" ? "#EB5310" : "#059669",
                          }}
                        >
                          {order.paymentMethod === "installment" ? "Installment" : "Full"}
                        </span>
                      </td>
                      <td style={{ color: "#DC2626" }}>
                        -{formatNaira(order.commissionAmount, false)}
                      </td>
                      <td>
                        <strong style={{ color: "#059669" }}>
                          {formatNaira(order.vendorAmount, false)}
                        </strong>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
