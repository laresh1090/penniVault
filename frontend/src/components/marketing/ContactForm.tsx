"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import type { ContactFormData, ContactFormErrors } from "@/types/marketing";

interface ContactFormProps {
  showSubjectSelect?: boolean;
  className?: string;
}

export default function ContactForm({
  showSubjectSelect = false,
  className,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isSubmitted) {
    return (
      <div className={className}>
        <div className="pv-contact-success">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          <h3>Message Sent!</h3>
          <p>
            Thank you for reaching out. We&apos;ll get back to you within 24
            hours.
          </p>
        </div>
      </div>
    );
  }

  const subjectOptions = [
    "General Inquiry",
    "Account Support",
    "Group Savings Help",
    "Vendor Partnership",
    "Report an Issue",
  ];

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="row g-3">
        <div className="col-sm-6">
          <input
            type="text"
            name="name"
            className={`pv-contact-input${errors.name ? " error" : ""}`}
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="pv-form-error">{errors.name}</span>
          )}
        </div>
        <div className="col-sm-6">
          <input
            type="email"
            name="email"
            className={`pv-contact-input${errors.email ? " error" : ""}`}
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="pv-form-error">{errors.email}</span>
          )}
        </div>
        <div className="col-sm-6">
          <input
            type="tel"
            name="phone"
            className="pv-contact-input"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-6">
          {showSubjectSelect ? (
            <select
              name="subject"
              className="pv-contact-input"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="subject"
              className="pv-contact-input"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="col-12">
          <textarea
            name="message"
            className={`pv-contact-input pv-contact-textarea${errors.message ? " error" : ""}`}
            placeholder="Your Message *"
            rows={5}
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && (
            <span className="pv-form-error">{errors.message}</span>
          )}
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="ul-btn ul-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
}
