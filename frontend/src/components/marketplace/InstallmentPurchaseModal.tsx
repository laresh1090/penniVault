"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCalendarCheck,
  faWallet,
  faCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { useInstallmentPreview } from "@/hooks/useInstallmentPreview";
import { useInstallmentPurchase } from "@/hooks/useInstallmentPurchase";
import { useWallet } from "@/hooks/useWallet";
import type { Listing } from "@/types";

interface InstallmentPurchaseModalProps {
  listing: Listing;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InstallmentPurchaseModal({
  listing,
  onClose,
  onSuccess,
}: InstallmentPurchaseModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMonths, setSelectedMonths] = useState<6 | 12>(6);

  const { breakdown, isLoading: previewLoading } = useInstallmentPreview(listing.id, selectedMonths);
  const { purchase, isProcessing, error } = useInstallmentPurchase();
  const { wallet } = useWallet();

  // Also fetch the other plan for comparison
  const otherMonths = selectedMonths === 6 ? 12 : 6;
  const { breakdown: otherBreakdown } = useInstallmentPreview(listing.id, otherMonths);

  const plan6 = selectedMonths === 6 ? breakdown : otherBreakdown;
  const plan12 = selectedMonths === 12 ? breakdown : otherBreakdown;

  const walletBalance = wallet ? Number(wallet.realBalance) : 0;
  const upfrontAmount = breakdown?.upfrontAmount ?? 0;
  const hasEnoughBalance = walletBalance >= upfrontAmount;

  const handleConfirm = async () => {
    const result = await purchase(listing.id, selectedMonths);
    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  const vendorName =
    listing.vendor?.vendorProfile?.businessName ||
    (listing.vendor ? `${listing.vendor.firstName} ${listing.vendor.lastName}` : "Vendor");

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
      tabIndex={-1}
      onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content pennisave-modal">
          {/* Header */}
          <div className="pennisave-modal-header compact">
            <div className="d-flex align-items-center gap-3">
              <div
                className="pennisave-modal-icon"
                style={{ background: "rgba(235, 83, 16, 0.12)", color: "#EB5310" }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <div>
                <h5 className="pennisave-modal-title">Pay in Installments</h5>
                <p className="pennisave-modal-subtitle">
                  {step === 1 ? "Choose your plan" : step === 2 ? "Review breakdown" : "Confirm purchase"}
                </p>
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

          {/* Step indicator */}
          <div className="installment-step-bar">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`installment-step-dot ${s <= step ? "active" : ""} ${s === step ? "current" : ""}`}
              />
            ))}
          </div>

          <div className="pennisave-modal-body">
            {error && (
              <div className="alert alert-danger" role="alert" style={{ fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Step 1: Choose Plan */}
            {step === 1 && (
              <div className="pennisave-step-content">
                {/* Item summary */}
                <div className="installment-item-summary">
                  <div className="installment-item-info">
                    <h6>{listing.title}</h6>
                    <p>{vendorName}</p>
                  </div>
                  <span className="installment-item-price">{formatNaira(listing.price, false)}</span>
                </div>

                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
                  Upfront: {listing.minUpfrontPercent}% &middot; Choose 6 or 12 month spread
                </p>

                {/* Plan Cards */}
                <div className="installment-plan-options">
                  {/* 6-month */}
                  <button
                    className={`installment-plan-card ${selectedMonths === 6 ? "selected" : ""}`}
                    onClick={() => setSelectedMonths(6)}
                  >
                    <span className="installment-plan-duration">6 Months</span>
                    {plan6 ? (
                      <>
                        <span className="installment-plan-monthly">
                          {formatNaira(plan6.monthlyAmount, false)}/mo
                        </span>
                        <span className="installment-plan-markup">
                          {plan6.markupPercent > 0 ? `${plan6.markupPercent}% markup` : "0% markup"}
                        </span>
                        <span className="installment-plan-total">
                          Total: {formatNaira(plan6.totalCost, false)}
                        </span>
                      </>
                    ) : (
                      <span className="installment-plan-loading">Calculating...</span>
                    )}
                  </button>

                  {/* 12-month */}
                  <button
                    className={`installment-plan-card ${selectedMonths === 12 ? "selected" : ""}`}
                    onClick={() => setSelectedMonths(12)}
                  >
                    <span className="installment-plan-duration">12 Months</span>
                    {plan12 ? (
                      <>
                        <span className="installment-plan-monthly">
                          {formatNaira(plan12.monthlyAmount, false)}/mo
                        </span>
                        <span className="installment-plan-markup">
                          {plan12.markupPercent > 0 ? `${plan12.markupPercent}% markup` : "0% markup"}
                        </span>
                        <span className="installment-plan-total">
                          Total: {formatNaira(plan12.totalCost, false)}
                        </span>
                      </>
                    ) : (
                      <span className="installment-plan-loading">Calculating...</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && breakdown && (
              <div className="pennisave-step-content">
                <div className="installment-breakdown">
                  <div className="installment-breakdown-row">
                    <span>Item Price</span>
                    <span>{formatNaira(breakdown.itemPrice, false)}</span>
                  </div>
                  <div className="installment-breakdown-row highlight">
                    <span>Upfront Payment ({breakdown.upfrontPercent}%)</span>
                    <span style={{ fontWeight: 700 }}>{formatNaira(breakdown.upfrontAmount, false)}</span>
                  </div>
                  <div className="installment-breakdown-row">
                    <span>Remaining Balance</span>
                    <span>{formatNaira(breakdown.remainingBase, false)}</span>
                  </div>
                  {breakdown.markupPercent > 0 && (
                    <div className="installment-breakdown-row">
                      <span>Markup ({breakdown.markupPercent}%)</span>
                      <span>{formatNaira(breakdown.markupAmount, false)}</span>
                    </div>
                  )}
                  <div className="installment-breakdown-row">
                    <span>Monthly Payment x {breakdown.numberOfPayments}</span>
                    <span>{formatNaira(breakdown.monthlyAmount, false)}</span>
                  </div>
                  <div className="installment-breakdown-row total">
                    <span>Total Cost</span>
                    <span>{formatNaira(breakdown.totalCost, false)}</span>
                  </div>
                </div>

                {/* Wallet check */}
                <div className="installment-funding-source">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faWallet} style={{ color: "#EB5310" }} />
                    <span style={{ fontWeight: 600, color: "#1E252F", fontSize: 14 }}>Funding Source</span>
                  </div>
                  <div className="installment-wallet-row">
                    <span>Wallet Balance</span>
                    <span style={{ fontWeight: 700, color: hasEnoughBalance ? "#059669" : "#EF4444" }}>
                      {formatNaira(walletBalance, false)}
                    </span>
                  </div>
                  <div className="installment-wallet-row">
                    <span>Upfront Due Now</span>
                    <span style={{ fontWeight: 700 }}>{formatNaira(upfrontAmount, false)}</span>
                  </div>
                  {!hasEnoughBalance && (
                    <p className="installment-insufficient">
                      Insufficient balance. Please fund your wallet first.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && breakdown && (
              <div className="pennisave-step-content">
                <div className="pennisave-confirm-summary">
                  <div className="pennisave-confirm-amount">
                    {formatNaira(breakdown.upfrontAmount, false)}
                  </div>
                  <p className="pennisave-confirm-to">
                    Upfront for <strong>{listing.title}</strong>
                  </p>
                  <div className="installment-confirm-details">
                    <div className="installment-confirm-row">
                      <span>Plan</span>
                      <span>{breakdown.numberOfPayments} months</span>
                    </div>
                    <div className="installment-confirm-row">
                      <span>Monthly</span>
                      <span>{formatNaira(breakdown.monthlyAmount, false)}</span>
                    </div>
                    <div className="installment-confirm-row">
                      <span>Total</span>
                      <span>{formatNaira(breakdown.totalCost, false)}</span>
                    </div>
                  </div>
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
            {step > 1 && (
              <button
                className="quick-action-btn secondary"
                onClick={() => setStep((step - 1) as 1 | 2)}
                disabled={isProcessing}
              >
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step === 1 && (
              <button
                className="quick-action-btn primary"
                onClick={() => setStep(2)}
                disabled={!breakdown}
              >
                Review Breakdown <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
            {step === 2 && (
              <button
                className="quick-action-btn primary"
                onClick={() => setStep(3)}
                disabled={!hasEnoughBalance}
              >
                Continue <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
            {step === 3 && (
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
