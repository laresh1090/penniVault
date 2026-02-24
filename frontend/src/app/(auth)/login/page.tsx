"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(result.email || email)}`);
        return;
      }

      // Login succeeded — redirect by role from login response
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl && !callbackUrl.includes("/login") && !callbackUrl.includes("/register")) {
        router.push(callbackUrl);
        return;
      }

      const role = result.user?.role;
      switch (role) {
        case "vendor": router.push("/vendor-dashboard"); break;
        case "admin": case "superadmin": router.push("/admin-dashboard"); break;
        default: router.push("/dashboard");
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="pv-auth-title">Welcome back</h1>
      <p className="pv-auth-description">
        Log in to your PenniVault account to continue managing your savings and investments.
      </p>

      {/* Success message from registration */}
      {searchParams.get("registered") && (
        <div className="pv-auth-alert pv-auth-alert--success" role="status">
          <span>Account created successfully! Please check your email for the verification code.</span>
        </div>
      )}

      {/* Global error */}
      {globalError && (
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className={`pv-form-group${errors.email ? " has-error" : ""}`}>
          <label htmlFor="login-email" className="pv-form-label">
            Email address <span className="required" aria-hidden="true">*</span>
          </label>
          <div className="pv-input-icon-wrapper">
            <span className="pv-input-icon"><i className="flaticon-mail"></i></span>
            <input
              type="email"
              id="login-email"
              name="email"
              className="pv-form-input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </div>
          {errors.email && <span className="pv-form-error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className={`pv-form-group${errors.password ? " has-error" : ""}`}>
          <label htmlFor="login-password" className="pv-form-label">
            Password <span className="required" aria-hidden="true">*</span>
          </label>
          <div className="pv-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              name="password"
              className="pv-form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            <button
              type="button"
              className="pv-password-toggle"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          {errors.password && <span className="pv-form-error">{errors.password}</span>}
        </div>

        {/* Remember me + Forgot password */}
        <div className="pv-auth-options-row">
          <label className="pv-checkbox-wrapper">
            <input
              type="checkbox"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="pv-checkbox-box">
              <svg width="12" height="12" viewBox="0 0 12 10" fill="none">
                <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="pv-checkbox-text">Remember me</span>
          </label>
          <Link href="/forgot-password" className="pv-auth-forgot-link">
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
          disabled={isSubmitting}
        >
          <span className="pv-btn-text">{isSubmitting ? "Logging in..." : "Log In"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="pv-auth-divider">
        <span className="pv-auth-divider-text">or continue with</span>
      </div>

      {/* Social login buttons */}
      <div className="pv-social-login-buttons">
        <button type="button" className="pv-social-btn" aria-label="Continue with Google">
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span>Google</span>
        </button>
        <button type="button" className="pv-social-btn" aria-label="Continue with Apple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          <span>Apple</span>
        </button>
      </div>

      {/* Footer link */}
      <p className="pv-auth-footer-text">
        Don&apos;t have an account? <Link href="/register">Create one</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
