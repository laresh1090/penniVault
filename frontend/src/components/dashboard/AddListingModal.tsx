"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "loading" | "success";

interface FormData {
  title: string;
  category: string;
  price: string;
  location: string;
  description: string;
  status: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  price?: string;
  location?: string;
  description?: string;
}

const INITIAL_FORM: FormData = {
  title: "",
  category: "",
  price: "",
  location: "",
  description: "",
  status: "active",
};

export default function AddListingModal({
  isOpen,
  onClose,
}: AddListingModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = useCallback(() => {
    setStep("form");
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    const numericPrice = parseFloat(form.price.replace(/,/g, ""));
    if (!form.price || isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Please enter a valid price greater than 0";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    updateField("price", raw);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const numericPrice = parseFloat(form.price.replace(/,/g, "")) || 0;

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="pv-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="pv-modal wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pv-modal-header">
          <h3>
            {step === "success" ? "Listing Created" : "Add New Listing"}
          </h3>
          <button
            type="button"
            className="pv-modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit}>
            <div className="pv-modal-body">
              <div className="pv-form-group">
                <label htmlFor="listing-title" className="pv-form-label">
                  Title
                </label>
                <input
                  id="listing-title"
                  type="text"
                  className={cn("form-control", errors.title && "is-invalid")}
                  placeholder="e.g., 3 Bedroom Flat - Lekki Phase 1"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
                {errors.title && (
                  <div className="pv-form-error">{errors.title}</div>
                )}
              </div>

              <div className="pv-form-row">
                <div className="pv-form-group">
                  <label htmlFor="listing-category" className="pv-form-label">
                    Category
                  </label>
                  <select
                    id="listing-category"
                    className={cn("form-select", errors.category && "is-invalid")}
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="Property">Property</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                  {errors.category && (
                    <div className="pv-form-error">{errors.category}</div>
                  )}
                </div>

                <div className="pv-form-group">
                  <label htmlFor="listing-price" className="pv-form-label">
                    Price (NGN)
                  </label>
                  <div className="pv-input-wrapper">
                    <span className="pv-input-prefix">&#x20A6;</span>
                    <input
                      id="listing-price"
                      type="text"
                      className={cn(
                        "form-control pv-input-with-prefix",
                        errors.price && "is-invalid"
                      )}
                      placeholder="0.00"
                      value={form.price}
                      onChange={handlePriceChange}
                      inputMode="decimal"
                    />
                  </div>
                  {errors.price && (
                    <div className="pv-form-error">{errors.price}</div>
                  )}
                  {numericPrice > 0 && (
                    <div className="pv-form-hint">
                      {formatNaira(numericPrice)}
                    </div>
                  )}
                </div>
              </div>

              <div className="pv-form-row">
                <div className="pv-form-group">
                  <label htmlFor="listing-location" className="pv-form-label">
                    Location
                  </label>
                  <input
                    id="listing-location"
                    type="text"
                    className={cn("form-control", errors.location && "is-invalid")}
                    placeholder="e.g., Lekki Phase 1, Lagos"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                  {errors.location && (
                    <div className="pv-form-error">{errors.location}</div>
                  )}
                </div>

                <div className="pv-form-group">
                  <label htmlFor="listing-status" className="pv-form-label">
                    Status
                  </label>
                  <select
                    id="listing-status"
                    className="form-select"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pv-form-group">
                <label htmlFor="listing-description" className="pv-form-label">
                  Description
                </label>
                <textarea
                  id="listing-description"
                  className={cn(
                    "form-control",
                    errors.description && "is-invalid"
                  )}
                  rows={4}
                  placeholder="Describe your listing in detail..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
                {errors.description && (
                  <div className="pv-form-error">{errors.description}</div>
                )}
              </div>
            </div>

            <div className="pv-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Listing
              </button>
            </div>
          </form>
        )}

        {step === "loading" && (
          <>
            <div className="pv-modal-body">
              <div className="pv-loading-state">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="pv-loading-icon"
                />
                <p>Creating your listing...</p>
              </div>
            </div>
            <div className="pv-modal-footer" />
          </>
        )}

        {step === "success" && (
          <>
            <div className="pv-modal-body">
              <div className="pv-success-state">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="pv-success-icon"
                />
                <h4>Listing Created!</h4>
                <p>
                  Your listing &ldquo;{form.title}&rdquo; has been created
                  successfully{" "}
                  {form.status === "active"
                    ? "and is now live on the marketplace."
                    : "as a draft. You can publish it later."}
                </p>
              </div>
            </div>
            <div className="pv-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
