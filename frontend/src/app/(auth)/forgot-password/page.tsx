"use client";

import { useState } from "react";
import Link from "next/link";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import FormInput from "@/components/forms/FormInput";
import AuthAlert from "@/components/auth/AuthAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <h1 className="pv-auth-title">Forgot your password?</h1>
      <p className="pv-auth-subtitle">
        No worries! Enter the email address associated with your account and
        we&apos;ll send you a link to reset your password.
      </p>

      {isSubmitted ? (
        <>
          <AuthAlert
            type="success"
            message="If an account exists with that email, you will receive a password reset link shortly. Please check your inbox and spam folder."
          />
          <p className="pv-auth-footer" style={{ marginTop: "24px" }}>
            <Link href="/login">&larr; Back to log in</Link>
          </p>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={faEnvelope}
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              autoComplete="email"
            />

            <button
              type="submit"
              className="pv-auth-btn primary"
              disabled={isSubmitting}
              style={{ marginTop: "8px" }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="pv-auth-footer">
            Remember your password?{" "}
            <Link href="/login">Back to log in</Link>
          </p>
        </>
      )}
    </>
  );
}
