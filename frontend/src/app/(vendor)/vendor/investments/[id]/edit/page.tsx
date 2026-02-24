"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFloppyDisk,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import api from "@/lib/api";
import { useMutateInvestment } from "@/hooks/useMutateInvestment";
import type { UpdateInvestmentPayload } from "@/services/vendor.service";

interface FormState {
  title: string;
  description: string;
  category: string;
  images: string;
  location: string;
  targetAmount: string;
  minimumInvestment: string;
  expectedRoiPercent: string;
  durationDays: string;
  startDate: string;
  endDate: string;
  riskLevel: string;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  category: "agriculture",
  images: "",
  location: "",
  targetAmount: "",
  minimumInvestment: "",
  expectedRoiPercent: "",
  durationDays: "",
  startDate: "",
  endDate: "",
  riskLevel: "medium",
};

export default function EditInvestmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { updateInvestment, isSubmitting } = useMutateInvestment();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadInvestment = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const { data } = await api.get(`/investments/${id}`);
        const inv = data.investment;

        setForm({
          title: inv.title || "",
          description: inv.description || "",
          category: inv.category || "agriculture",
          images: Array.isArray(inv.images)
            ? inv.images.join(", ")
            : inv.primaryImage || "",
          location: inv.location || "",
          targetAmount: String(inv.targetAmount || ""),
          minimumInvestment: String(inv.minimumInvestment || ""),
          expectedRoiPercent: String(inv.expectedRoiPercent || ""),
          durationDays: String(inv.durationDays || ""),
          startDate: inv.startDate ? inv.startDate.split("T")[0] : "",
          endDate: inv.endDate ? inv.endDate.split("T")[0] : "",
          riskLevel: inv.riskLevel || "medium",
        });
      } catch {
        setLoadError("Failed to load investment details. It may not exist or you may not have access.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvestment();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.location.trim()) errs.location = "Location is required";

    const target = Number(form.targetAmount);
    if (!form.targetAmount || isNaN(target) || target < 100000)
      errs.targetAmount = "Target amount must be at least 100,000";

    const minInv = Number(form.minimumInvestment);
    if (!form.minimumInvestment || isNaN(minInv) || minInv < 1000)
      errs.minimumInvestment = "Minimum investment must be at least 1,000";

    const roi = Number(form.expectedRoiPercent);
    if (!form.expectedRoiPercent || isNaN(roi) || roi < 1 || roi > 100)
      errs.expectedRoiPercent = "Expected ROI must be between 1% and 100%";

    const dur = Number(form.durationDays);
    if (!form.durationDays || isNaN(dur) || dur < 30 || dur > 1825)
      errs.durationDays = "Duration must be between 30 and 1825 days";

    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UpdateInvestmentPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      location: form.location.trim(),
      targetAmount: Number(form.targetAmount),
      minimumInvestment: Number(form.minimumInvestment),
      expectedRoiPercent: Number(form.expectedRoiPercent),
      durationDays: Number(form.durationDays),
      startDate: form.startDate,
      endDate: form.endDate,
      riskLevel: form.riskLevel,
    };

    const result = await updateInvestment(id, payload);
    if (result) {
      router.push("/vendor/investments");
    }
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

  if (loadError) {
    return (
      <div className="dash-card">
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
          <h4 style={{ fontSize: 18, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>
            Error Loading Investment
          </h4>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>{loadError}</p>
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push("/vendor/investments")}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Investments
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => router.push("/vendor/investments")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E252F", marginBottom: 2 }}>
            Edit Investment
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Update your investment opportunity details
          </p>
        </div>
      </div>

      <div className="dash-card">
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "24px" }}>
            <div className="row g-4">
              {/* Title */}
              <div className="col-12">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Title <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`form-control${errors.title ? " is-invalid" : ""}`}
                  placeholder="e.g. Savanna Poultry Farm — Batch 12"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Description <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <textarea
                  name="description"
                  className={`form-control${errors.description ? " is-invalid" : ""}`}
                  rows={4}
                  placeholder="Describe the investment opportunity, expected returns, and risk factors..."
                  value={form.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              {/* Category & Risk Level */}
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Category <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="agriculture">Agriculture</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Risk Level <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <select
                  name="riskLevel"
                  className="form-select"
                  value={form.riskLevel}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Images */}
              <div className="col-12">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Images
                </label>
                <input
                  type="text"
                  name="images"
                  className="form-control"
                  placeholder="Comma-separated image URLs (e.g. https://example.com/img1.jpg, https://example.com/img2.jpg)"
                  value={form.images}
                  onChange={handleChange}
                />
                <div className="form-text">Enter image URLs separated by commas</div>
              </div>

              {/* Location */}
              <div className="col-12">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Location <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className={`form-control${errors.location ? " is-invalid" : ""}`}
                  placeholder="e.g. Ogun State, Nigeria"
                  value={form.location}
                  onChange={handleChange}
                />
                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
              </div>

              {/* Target Amount & Minimum Investment */}
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Target Amount (NGN) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  className={`form-control${errors.targetAmount ? " is-invalid" : ""}`}
                  placeholder="100000"
                  min={100000}
                  value={form.targetAmount}
                  onChange={handleChange}
                />
                {errors.targetAmount && <div className="invalid-feedback">{errors.targetAmount}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Minimum Investment (NGN) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  name="minimumInvestment"
                  className={`form-control${errors.minimumInvestment ? " is-invalid" : ""}`}
                  placeholder="1000"
                  min={1000}
                  value={form.minimumInvestment}
                  onChange={handleChange}
                />
                {errors.minimumInvestment && (
                  <div className="invalid-feedback">{errors.minimumInvestment}</div>
                )}
              </div>

              {/* Expected ROI & Duration */}
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Expected ROI (%) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  name="expectedRoiPercent"
                  className={`form-control${errors.expectedRoiPercent ? " is-invalid" : ""}`}
                  placeholder="15"
                  min={1}
                  max={100}
                  value={form.expectedRoiPercent}
                  onChange={handleChange}
                />
                {errors.expectedRoiPercent && (
                  <div className="invalid-feedback">{errors.expectedRoiPercent}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Duration (days) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  name="durationDays"
                  className={`form-control${errors.durationDays ? " is-invalid" : ""}`}
                  placeholder="180"
                  min={30}
                  max={1825}
                  value={form.durationDays}
                  onChange={handleChange}
                />
                {errors.durationDays && <div className="invalid-feedback">{errors.durationDays}</div>}
              </div>

              {/* Start Date & End Date */}
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  Start Date <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={`form-control${errors.startDate ? " is-invalid" : ""}`}
                  value={form.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 14 }}>
                  End Date <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={`form-control${errors.endDate ? " is-invalid" : ""}`}
                  value={form.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
              </div>
            </div>

            {/* Submit */}
            <div
              className="d-flex justify-content-end gap-3 mt-4 pt-4"
              style={{ borderTop: "1px solid #F1F5F9" }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => router.push("/vendor/investments")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="quick-action-btn primary"
                disabled={isSubmitting}
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
          </div>
        </form>
      </div>
    </>
  );
}
