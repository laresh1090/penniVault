"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import FormCheckbox from "@/components/forms/FormCheckbox";
import AuthAlert from "@/components/auth/AuthAlert";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Invalid email or password. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Fetch session to get role for redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      // Check for callbackUrl
      const callbackUrl = searchParams.get("callbackUrl");
      if (
        callbackUrl &&
        !callbackUrl.includes("/login") &&
        !callbackUrl.includes("/register")
      ) {
        router.push(callbackUrl);
        return;
      }

      // Role-based redirect
      switch (role) {
        case "vendor":
          router.push("/vendor-dashboard");
          break;
        case "admin":
          router.push("/admin-dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } catch {
      setGlobalError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="pv-auth-title">Welcome back</h1>
      <p className="pv-auth-subtitle">
        Log in to your PenniVault account to manage your savings, track goals,
        and grow your wealth.
      </p>

      {/* Show success message if coming from registration */}
      {searchParams.get("registered") && (
        <AuthAlert
          type="success"
          message="Account created successfully! Please log in with your credentials."
        />
      )}

      {/* Global error */}
      {globalError && (
        <AuthAlert
          type="error"
          message={globalError}
          onClose={() => setGlobalError("")}
        />
      )}

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
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
        />

        <div
          className="pv-auth-options-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <FormCheckbox
            label="Remember me"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="pv-auth-forgot-link"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="pv-auth-btn primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="pv-auth-divider">
        <span>or continue with</span>
      </div>

      <SocialLoginButtons />

      <p className="pv-auth-footer">
        Don&apos;t have an account?{" "}
        <Link href="/register">Create one</Link>
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
