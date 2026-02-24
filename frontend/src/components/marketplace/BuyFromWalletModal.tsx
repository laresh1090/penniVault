"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCartShopping,
  faWallet,
  faCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { usePurchase } from "@/hooks/usePurchase";
import type { Listing } from "@/types";

interface BuyFromWalletModalProps {
  listing: Listing;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BuyFromWalletModal({
  listing,
  onClose,
  onSuccess,
}: BuyFromWalletModalProps) {
  const [step, setStep] = useState<"review" | "confirm">("review");
  const { purchase, isProcessing, error } = usePurchase();

  const handleConfirm = async () => {
    const order = await purchase(listing.id);
    if (order) {
      onSuccess?.();
      onClose();
    } else {
      setStep("review");
    }
  };

  const vendorName = listing.vendor?.vendorProfile?.businessName
    || (listing.vendor ? `${listing.vendor.firstName} ${listing.vendor.lastName}` : "Vendor");

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content pennisave-modal">
          {/* Header */}
          <div className="pennisave-modal-header compact">
            <div className="d-flex align-items-center gap-3">
              <div className="pennisave-modal-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Buy from Wallet</h5>
                <p className="pennisave-modal-subtitle">Purchase this item directly</p>
              </div>
            </div>
            <button
              type="button"
              className="pennisave-modal-close"
              onClick={onClose}
              disabled={isProcessing}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="pennisave-modal-body">
            {error && (
              <div className="alert alert-danger" role="alert" style={{ fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Step 1: Review */}
            {step === "review" && (
              <div className="pennisave-step-content">
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <h6 style={{ fontWeight: 700, color: "#1E252F", marginBottom: 4 }}>
                    {listing.title}
                  </h6>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>
                    <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 4 }} />
                    {listing.location}
                  </p>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                    Sold by: <strong>{vendorName}</strong>
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#64748B" }}>Item Price</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#1E252F" }}>
                    {formatNaira(listing.price, false)}
                  </span>
                </div>

                <div className="pv-form-group mt-3">
                  <label className="pv-form-label">Pay From</label>
                  <div className="pennisave-funding-options">
                    <div className="pennisave-funding-option selected">
                      <FontAwesomeIcon icon={faWallet} className="pennisave-funding-icon" />
                      <div>
                        <p className="pennisave-funding-bank">Real Wallet</p>
                        <span className="pennisave-funding-acct">
                          Amount will be deducted from your wallet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === "confirm" && (
              <div className="pennisave-step-content">
                <div className="pennisave-confirm-summary">
                  <div className="pennisave-confirm-amount">
                    {formatNaira(listing.price, false)}
                  </div>
                  <p className="pennisave-confirm-to">
                    Purchasing <strong>{listing.title}</strong>
                  </p>
                  <div className="pennisave-confirm-from">
                    <FontAwesomeIcon icon={faWallet} />
                    <span>From: Real Wallet</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pennisave-modal-footer">
            {step === "confirm" && (
              <button
                className="quick-action-btn secondary"
                onClick={() => setStep("review")}
                disabled={isProcessing}
              >
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step === "review" ? (
              <button
                className="quick-action-btn primary"
                onClick={() => setStep("confirm")}
              >
                Continue to Confirm
              </button>
            ) : (
              <button
                className="quick-action-btn primary"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                <FontAwesomeIcon icon={faCheck} />{" "}
                {isProcessing ? "Processing..." : "Confirm Purchase"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
