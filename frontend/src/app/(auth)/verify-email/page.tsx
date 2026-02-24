"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendOtp } = useAuth();

  const email = searchParams.get("email") || "";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (error) setError("");

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await verifyEmail(email, fullCode);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code.");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOtp(email);
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    }
  };

  if (!email) {
    return (
      <>
        <h1 className="pv-auth-title">Verify Your Email</h1>
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>No email address provided. Please register or log in first.</span>
        </div>
        <p className="pv-auth-footer-text">
          <Link href="/register">Create an account</Link> or <Link href="/login">Log in</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="pv-auth-title">Verify your email</h1>
      <p className="pv-auth-description">
        We sent a 6-digit verification code to <strong>{email}</strong>.
        Enter it below to verify your account.
      </p>

      {error && (
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div
          className="d-flex justify-content-center gap-2 mb-4"
          onPaste={handlePaste}
        >
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="pv-form-input"
              style={{
                width: 48,
                height: 56,
                textAlign: "center",
                fontSize: 24,
                fontWeight: 700,
                padding: 0,
                borderRadius: 10,
              }}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          type="submit"
          className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
          disabled={isSubmitting}
        >
          <span className="pv-btn-text">{isSubmitting ? "Verifying..." : "Verify Email"}</span>
        </button>
      </form>

      <p className="pv-auth-footer-text" style={{ marginTop: 24 }}>
        Didn&apos;t receive the code?{" "}
        {resendCooldown > 0 ? (
          <span style={{ color: "var(--ul-gray)" }}>Resend in {resendCooldown}s</span>
        ) : (
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleResend(); }}
            style={{ color: "#EB5310", fontWeight: 600 }}
          >
            Resend code
          </a>
        )}
      </p>

      <p className="pv-auth-footer-text">
        <Link href="/login">Back to log in</Link>
      </p>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
