"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="pv-auth-title">Forgot your password?</h1>
      <p className="pv-auth-description">
        Enter the email address associated with your account and we will send you
        a link to reset your password.
      </p>

      {/* Success message */}
      {isSubmitted && (
        <div className="pv-auth-alert pv-auth-alert--success" role="status">
          <span>
            If an account exists with that email, you will receive a password reset
            link shortly. Please check your inbox and spam folder.
          </span>
        </div>
      )}

      {/* Error message */}
      {error && !isSubmitted && (
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>{error}</span>
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} noValidate>
          <div className={`pv-form-group${error ? " has-error" : ""}`}>
            <label htmlFor="forgot-email" className="pv-form-label">
              Email address <span className="required" aria-hidden="true">*</span>
            </label>
            <div className="pv-input-icon-wrapper">
              <span className="pv-input-icon"><i className="flaticon-mail"></i></span>
              <input
                type="email"
                id="forgot-email"
                name="email"
                className="pv-form-input"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
            {error && <span className="pv-form-error">{error}</span>}
          </div>

          <button
            type="submit"
            className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
            disabled={isSubmitting}
          >
            <span className="pv-btn-text">{isSubmitting ? "Sending..." : "Send Reset Link"}</span>
          </button>
        </form>
      )}

      <p className="pv-auth-footer-text">
        Remember your password? <Link href="/login">Back to log in</Link>
      </p>
    </>
  );
}
