"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFloppyDisk,
  faSpinner,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

import api from "@/lib/api";
import { useMutateListing } from "@/hooks/useMutateListing";
import type { UpdateListingPayload } from "@/services/vendor.service";
import type { Listing } from "@/types";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { updateListing, isSubmitting, error: mutateError } = useMutateListing();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("property");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [imagesInput, setImagesInput] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [allowInstallment, setAllowInstallment] = useState(false);
  const [minUpfrontPercent, setMinUpfrontPercent] = useState("40");
  const [installmentMarkup6m, setInstallmentMarkup6m] = useState("5");
  const [installmentMarkup12m, setInstallmentMarkup12m] = useState("10");

  useEffect(() => {
    async function fetchListing() {
      setIsLoadingData(true);
      setFetchError(null);
      try {
        const { data } = await api.get(`/listings/${id}`);
        const listing: Listing = data.listing ?? data.data ?? data;
        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setCategory(listing.category || "property");
        setPrice(listing.price ? String(listing.price) : "");
        setLocation(listing.location || "");
        setStockQuantity(
          listing.stockQuantity !== undefined
            ? String(listing.stockQuantity)
            : "1",
        );
        setImagesInput(
          listing.images && listing.images.length > 0
            ? listing.images.join(", ")
            : "",
        );
        setStatus(listing.status || "active");
        setAllowInstallment(listing.allowInstallment ?? false);
        setMinUpfrontPercent(String(listing.minUpfrontPercent ?? 40));
        setInstallmentMarkup6m(String(listing.installmentMarkup6m ?? 5));
        setInstallmentMarkup12m(String(listing.installmentMarkup12m ?? 10));
      } catch (err) {
        setFetchError(
          err instanceof Error ? err.message : "Failed to load listing",
        );
      } finally {
        setIsLoadingData(false);
      }
    }

    if (id) fetchListing();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const images = imagesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: UpdateListingPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      location: location.trim(),
      stockQuantity: Number(stockQuantity),
      images,
      status,
      allowInstallment,
      minUpfrontPercent: Number(minUpfrontPercent),
      installmentMarkup6m: Number(installmentMarkup6m),
      installmentMarkup12m: Number(installmentMarkup12m),
    };

    const result = await updateListing(id, payload);
    if (result) {
      router.push("/vendor/listings");
    }
  };

  if (isLoadingData) {
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

  if (fetchError) {
    return (
      <div className="dash-card">
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <p style={{ color: "#EF4444", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Failed to load listing
          </p>
          <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>
            {fetchError}
          </p>
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/vendor/listings")}
            style={{ fontSize: 14, borderRadius: 8 }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const displayError = mutateError;

  return (
    <>
      {/* Page Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => router.push("/vendor/listings")}
          style={{ borderRadius: 8 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1E252F",
              marginBottom: 4,
            }}
          >
            Edit Listing
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Update your listing details
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="dash-card">
        <div style={{ padding: 24 }}>
          {displayError && (
            <div
              className="alert alert-danger"
              style={{ fontSize: 14, marginBottom: 24 }}
            >
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Title */}
              <div className="col-md-8">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Listing Title <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 3 Bedroom Duplex in Lekki"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ fontSize: 14 }}
                />
              </div>

              {/* Category */}
              <div className="col-md-4">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Category <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ fontSize: 14 }}
                >
                  <option value="property">Property</option>
                  <option value="automotive">Automotive</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-12">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Description <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Provide a detailed description of your listing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{ fontSize: 14 }}
                />
              </div>

              {/* Price */}
              <div className="col-md-4">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Price (\u20A6) <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  style={{ fontSize: 14 }}
                />
              </div>

              {/* Location */}
              <div className="col-md-4">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Location <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lekki, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={{ fontSize: 14 }}
                />
              </div>

              {/* Stock Quantity */}
              <div className="col-md-4">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  min={0}
                  style={{ fontSize: 14 }}
                />
              </div>

              {/* Images */}
              <div className="col-12">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{ marginRight: 6, color: "#94A3B8" }}
                  />
                  Image URLs
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Paste image URLs separated by commas"
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  style={{ fontSize: 14 }}
                />
                <small style={{ color: "#94A3B8", fontSize: 12 }}>
                  Separate multiple image URLs with commas
                </small>
              </div>

              {/* Installment Payments */}
              <div className="col-12">
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 2 }}
                      >
                        Allow Installment Payments
                      </label>
                      <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                        Let buyers pay in 6 or 12 monthly installments
                      </p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={allowInstallment}
                        onChange={(e) => setAllowInstallment(e.target.checked)}
                        style={{ width: 44, height: 22 }}
                      />
                    </div>
                  </div>

                  {allowInstallment && (
                    <div className="row g-3 mt-1">
                      <div className="col-md-4">
                        <label
                          className="form-label"
                          style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}
                        >
                          Minimum Upfront (%)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={minUpfrontPercent}
                          onChange={(e) => setMinUpfrontPercent(e.target.value)}
                          min={20}
                          max={60}
                          style={{ fontSize: 13 }}
                        />
                        <small style={{ color: "#94A3B8", fontSize: 11 }}>
                          Range: 20% – 60%
                        </small>
                      </div>
                      <div className="col-md-4">
                        <label
                          className="form-label"
                          style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}
                        >
                          6-Month Markup (%)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={installmentMarkup6m}
                          onChange={(e) => setInstallmentMarkup6m(e.target.value)}
                          min={0}
                          max={50}
                          style={{ fontSize: 13 }}
                        />
                        <small style={{ color: "#94A3B8", fontSize: 11 }}>
                          Set to 0 for interest-free
                        </small>
                      </div>
                      <div className="col-md-4">
                        <label
                          className="form-label"
                          style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}
                        >
                          12-Month Markup (%)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={installmentMarkup12m}
                          onChange={(e) => setInstallmentMarkup12m(e.target.value)}
                          min={0}
                          max={50}
                          style={{ fontSize: 13 }}
                        />
                        <small style={{ color: "#94A3B8", fontSize: 11 }}>
                          Set to 0 for interest-free
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                >
                  Status
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ fontSize: 14 }}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="sold">Sold</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div
              className="d-flex justify-content-end gap-3 mt-4 pt-4"
              style={{ borderTop: "1px solid #E2E8F0" }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.push("/vendor/listings")}
                style={{ fontSize: 14, padding: "10px 24px", borderRadius: 8 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="quick-action-btn primary"
                disabled={isSubmitting}
                style={{ fontSize: 14, padding: "10px 24px" }}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
