"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/forms/PasswordInput";
import AuthAlert from "@/components/auth/AuthAlert";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!token) {
    return (
      <>
        <h1 className="pv-auth-title">Invalid Reset Link</h1>
        <AuthAlert
          type="error"
          message="Invalid or missing reset token. Please request a new password reset link."
        />
        <p className="pv-auth-footer" style={{ marginTop: "24px" }}>
          <Link href="/forgot-password">Request new reset link</Link>
        </p>
      </>
    );
  }

  const validate = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Please enter a new password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <h1 className="pv-auth-title">Set a new password</h1>
      <p className="pv-auth-subtitle">
        Your new password must be at least 8 characters long. We recommend using
        a mix of letters, numbers, and symbols.
      </p>

      {isSubmitted ? (
        <>
          <AuthAlert
            type="success"
            message="Your password has been reset successfully! You can now log in with your new password."
          />
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link
              href="/login"
              className="pv-auth-btn primary"
              style={{ display: "inline-flex", textDecoration: "none" }}
            >
              Log in now
            </Link>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} noValidate>
            <PasswordInput
              label="New Password"
              name="password"
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              showStrength
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="pv-auth-btn primary"
              disabled={isSubmitting}
              style={{ marginTop: "8px" }}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="pv-auth-footer">
            <Link href="/login">&larr; Back to log in</Link>
          </p>
        </>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
