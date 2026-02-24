"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

function PasswordStrength({ password }: { password: string }) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const label = strength <= 1 ? "weak" : strength <= 2 ? "medium" : "strong";
  const width = strength <= 1 ? "33%" : strength <= 2 ? "66%" : "100%";

  if (!password) return null;

  return (
    <div className="pv-password-strength">
      <div className="pv-password-strength-bar">
        <div
          className="pv-password-strength-fill"
          data-strength={label}
          style={{ width }}
        />
      </div>
      <span className="pv-password-strength-text">{label}</span>
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!token) {
    return (
      <>
        <h1 className="pv-auth-title">Invalid Reset Link</h1>
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>Invalid or missing reset token. Please request a new password reset link.</span>
        </div>
        <p className="pv-auth-footer-text">
          <Link href="/forgot-password">Request new reset link</Link>
        </p>
      </>
    );
  }

  const validate = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (!password) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [globalError, setGlobalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setGlobalError("");
    try {
      await resetPassword({
        token: token!,
        email: emailParam || "",
        password,
        password_confirmation: confirmPassword,
      });
      setIsSubmitted(true);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  return (
    <>
      <h1 className="pv-auth-title">Set a new password</h1>
      <p className="pv-auth-description">
        Your new password must be at least 8 characters long and different
        from your previous password.
      </p>

      {globalError && (
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>{globalError}</span>
        </div>
      )}

      {isSubmitted && (
        <div className="pv-auth-alert pv-auth-alert--success" role="status">
          <span>
            Your password has been reset successfully.{" "}
            <Link href="/login" style={{ color: "#166534", fontWeight: 600 }}>Log in now</Link>
          </span>
        </div>
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} noValidate>
          {/* New password */}
          <div className={`pv-form-group${errors.password ? " has-error" : ""}`}>
            <label htmlFor="reset-password" className="pv-form-label">
              New password <span className="required" aria-hidden="true">*</span>
            </label>
            <div className="pv-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="reset-password"
                name="password"
                className="pv-form-input"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              <button type="button" className="pv-password-toggle" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                {EyeIcon}
              </button>
            </div>
            {errors.password && <span className="pv-form-error">{errors.password}</span>}
            <PasswordStrength password={password} />
          </div>

          {/* Confirm password */}
          <div className={`pv-form-group${errors.confirmPassword ? " has-error" : ""}`}>
            <label htmlFor="reset-confirm-password" className="pv-form-label">
              Confirm new password <span className="required" aria-hidden="true">*</span>
            </label>
            <div className="pv-password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                id="reset-confirm-password"
                name="confirm_password"
                className="pv-form-input"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
              />
              <button type="button" className="pv-password-toggle" aria-label="Toggle confirm password visibility" onClick={() => setShowConfirm(!showConfirm)}>
                {EyeIcon}
              </button>
            </div>
            {errors.confirmPassword && <span className="pv-form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
            disabled={isSubmitting}
          >
            <span className="pv-btn-text">{isSubmitting ? "Resetting..." : "Reset Password"}</span>
          </button>
        </form>
      )}

      <p className="pv-auth-footer-text">
        Remember your password? <Link href="/login">Back to log in</Link>
      </p>
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
