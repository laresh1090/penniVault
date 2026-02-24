"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

function getPasswordStrength(pw: string): { level: number; label: string } {
  if (!pw) return { level: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak" };
  if (score <= 2) return { level: 2, label: "Fair" };
  if (score <= 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [role, setRole] = useState("");

  // Step 2
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 3A (User)
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Step 3B (Vendor)
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  // --- Validation ---

  const validateStep1 = (): boolean => {
    if (!role) {
      setErrors({ role: "Please select an account type to continue." });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[\d+\-() ]{10,15}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3User = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Please enter your date of birth.";
    } else {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isUnder18 =
        age < 18 ||
        (age === 18 && monthDiff < 0) ||
        (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate());
      if (isUnder18) {
        newErrors.dateOfBirth = "You must be at least 18 years old to register.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3Vendor = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!businessName.trim()) {
      newErrors.businessName = "Please enter your business name.";
    }

    if (!businessType) {
      newErrors.businessType = "Please select a business type.";
    }

    if (!businessAddress.trim()) {
      newErrors.businessAddress = "Please enter your business address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Navigation ---

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    const isValid = role === "vendor" ? validateStep3Vendor() : validateStep3User();
    if (!isValid) return;

    setIsSubmitting(true);

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
        role: role as "user" | "vendor",
        ...(role === "vendor" && {
          businessName,
          businessType,
          registrationNumber: registrationNumber || undefined,
          businessAddress,
        }),
      });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <>
      <h1 className="pv-auth-title">Create your account</h1>
      <p className="pv-auth-description">
        Choose how you want to use PenniVault, then fill in your details.
      </p>

      {/* STEP INDICATOR */}
      <div className="pv-step-indicator" role="navigation" aria-label="Registration progress">
        {[
          { num: 1, label: "Role" },
          { num: 2, label: "Details" },
          { num: 3, label: "Profile" },
        ].map((step, i) => (
          <span key={step.num} style={{ display: "contents" }}>
            <div className="pv-step-with-label">
              <div
                className={`pv-step-circle${currentStep >= step.num ? " is-active" : ""}${currentStep > step.num ? " is-completed" : ""}`}
                aria-current={currentStep === step.num ? "step" : undefined}
              >
                {step.num}
              </div>
              <span className={`pv-step-label${currentStep >= step.num ? " is-active" : ""}`}>
                {step.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`pv-step-line${currentStep > step.num ? " is-active" : ""}`}></div>
            )}
          </span>
        ))}
      </div>

      {/* Global alert */}
      {globalError && (
        <div className="pv-auth-alert pv-auth-alert--error" role="alert">
          <span>{globalError}</span>
        </div>
      )}

      {/* REGISTRATION FORM */}
      <form onSubmit={handleSubmit} noValidate>

        {/* STEP 1: Role Selection */}
        <div className={`pv-step-panel${currentStep === 1 ? " is-active" : ""}`} data-step="1">
          <div className="pv-role-cards" role="radiogroup" aria-label="Select your account type">
            {/* Regular User card */}
            <label
              className={`pv-role-card${role === "user" ? " is-selected" : ""}`}
              tabIndex={0}
              role="radio"
              aria-checked={role === "user"}
            >
              <input
                type="radio"
                name="role-selection"
                value="user"
                checked={role === "user"}
                onChange={() => { setRole("user"); clearError("role"); }}
                style={{ display: "none" }}
              />
              <div className="pv-role-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="pv-role-card-title">Save &amp; Invest</h3>
              <p className="pv-role-card-description">
                I want to save towards goals like property, cars, or general savings.
              </p>
            </label>

            {/* Vendor card */}
            <label
              className={`pv-role-card${role === "vendor" ? " is-selected" : ""}`}
              tabIndex={0}
              role="radio"
              aria-checked={role === "vendor"}
            >
              <input
                type="radio"
                name="role-selection"
                value="vendor"
                checked={role === "vendor"}
                onChange={() => { setRole("vendor"); clearError("role"); }}
                style={{ display: "none" }}
              />
              <div className="pv-role-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 className="pv-role-card-title">Sell on PenniVault</h3>
              <p className="pv-role-card-description">
                I want to list property, vehicles, or other products for buyers.
              </p>
            </label>
          </div>

          {errors.role && (
            <span className="pv-form-error" style={{ textAlign: "center", display: "block" }}>
              {errors.role}
            </span>
          )}

          <button type="button" className="pv-auth-btn pv-auth-btn--primary" onClick={handleNext}>
            <span className="pv-btn-text">Continue</span>
          </button>
        </div>

        {/* STEP 2: Basic Information */}
        <div className={`pv-step-panel${currentStep === 2 ? " is-active" : ""}`} data-step="2">

          <div className={`pv-form-group${errors.fullName ? " has-error" : ""}`}>
            <label htmlFor="reg-name" className="pv-form-label">
              Full name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="reg-name"
              name="full_name"
              className="pv-form-input"
              placeholder="John Doe"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
            />
            {errors.fullName && <span className="pv-form-error">{errors.fullName}</span>}
          </div>

          <div className={`pv-form-group${errors.email ? " has-error" : ""}`}>
            <label htmlFor="reg-email" className="pv-form-label">
              Email address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              className="pv-form-input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
            />
            {errors.email && <span className="pv-form-error">{errors.email}</span>}
          </div>

          <div className={`pv-form-group${errors.phone ? " has-error" : ""}`}>
            <label htmlFor="reg-phone" className="pv-form-label">
              Phone number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="reg-phone"
              name="phone"
              className="pv-form-input"
              placeholder="+234 XXX XXX XXXX"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
            />
            {errors.phone && <span className="pv-form-error">{errors.phone}</span>}
          </div>

          <div className={`pv-form-group${errors.password ? " has-error" : ""}`}>
            <label htmlFor="reg-password" className="pv-form-label">
              Password <span className="required">*</span>
            </label>
            <div className="pv-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="reg-password"
                name="password"
                className="pv-form-input"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              />
              <button
                type="button"
                className="pv-password-toggle"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            {errors.password && <span className="pv-form-error">{errors.password}</span>}
            {password && (
              <div className="pv-password-strength">
                <div className="pv-password-strength-bar">
                  <div
                    className="pv-password-strength-fill"
                    data-strength={strength.level}
                    style={{ width: `${strength.level * 25}%` }}
                  ></div>
                </div>
                <span className="pv-password-strength-text">{strength.label}</span>
              </div>
            )}
          </div>

          <div className={`pv-form-group${errors.confirmPassword ? " has-error" : ""}`}>
            <label htmlFor="reg-confirm-password" className="pv-form-label">
              Confirm password <span className="required">*</span>
            </label>
            <div className="pv-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="reg-confirm-password"
                name="confirm_password"
                className="pv-form-input"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
              />
              <button
                type="button"
                className="pv-password-toggle"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            {errors.confirmPassword && <span className="pv-form-error">{errors.confirmPassword}</span>}
          </div>

          <div className={`pv-form-group${errors.agreeToTerms ? " has-error" : ""}`}>
            <label className="pv-checkbox-wrapper">
              <input
                type="checkbox"
                name="terms"
                checked={agreeToTerms}
                onChange={(e) => { setAgreeToTerms(e.target.checked); clearError("agreeToTerms"); }}
                required
              />
              <span className="pv-checkbox-box">
                <svg width="12" height="12" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
              </span>
              <span className="pv-checkbox-text">
                I agree to the <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                {" "}and <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && <span className="pv-form-error">{errors.agreeToTerms}</span>}
          </div>

          <div className="pv-auth-btn-group">
            <button type="button" className="pv-auth-btn pv-auth-btn--secondary" onClick={handleBack}>
              <span className="pv-btn-text">Back</span>
            </button>
            <button type="button" className="pv-auth-btn pv-auth-btn--primary" onClick={handleNext}>
              <span className="pv-btn-text">Continue</span>
            </button>
          </div>
        </div>

        {/* STEP 3A: Additional Info — Regular User */}
        <div
          className={`pv-step-panel${currentStep === 3 && role === "user" ? " is-active" : ""}`}
          data-step="3"
        >
          <div className={`pv-form-group${errors.dateOfBirth ? " has-error" : ""}`}>
            <label htmlFor="reg-dob" className="pv-form-label">
              Date of birth <span className="required">*</span>
            </label>
            <input
              type="date"
              id="reg-dob"
              name="date_of_birth"
              className="pv-form-input"
              required
              value={dateOfBirth}
              onChange={(e) => { setDateOfBirth(e.target.value); clearError("dateOfBirth"); }}
            />
            {errors.dateOfBirth && <span className="pv-form-error">{errors.dateOfBirth}</span>}
          </div>

          <div className="pv-form-group">
            <label htmlFor="reg-savings-goal" className="pv-form-label">
              Primary savings goal <span style={{ color: "var(--ul-gray)", fontWeight: 400 }}>(optional)</span>
            </label>
            <select
              id="reg-savings-goal"
              name="savings_goal"
              className="pv-form-select"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
            >
              <option value="" disabled>Select a goal...</option>
              <option value="property">Property</option>
              <option value="car">Car / Vehicle</option>
              <option value="general">General Savings</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="pv-form-group">
            <label htmlFor="reg-referral" className="pv-form-label">
              Referral code <span style={{ color: "var(--ul-gray)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text"
              id="reg-referral"
              name="referral_code"
              className="pv-form-input"
              placeholder="Enter referral code"
              autoComplete="off"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <div className="pv-auth-btn-group">
            <button type="button" className="pv-auth-btn pv-auth-btn--secondary" onClick={handleBack}>
              <span className="pv-btn-text">Back</span>
            </button>
            <button
              type="submit"
              className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
              disabled={isSubmitting}
            >
              <span className="pv-btn-text">{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            </button>
          </div>
        </div>

        {/* STEP 3B: Additional Info — Vendor */}
        <div
          className={`pv-step-panel${currentStep === 3 && role === "vendor" ? " is-active" : ""}`}
          data-step="3"
        >
          <div className={`pv-form-group${errors.businessName ? " has-error" : ""}`}>
            <label htmlFor="reg-business-name" className="pv-form-label">
              Business name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="reg-business-name"
              name="business_name"
              className="pv-form-input"
              placeholder="Your Company Name"
              required
              value={businessName}
              onChange={(e) => { setBusinessName(e.target.value); clearError("businessName"); }}
            />
            {errors.businessName && <span className="pv-form-error">{errors.businessName}</span>}
          </div>

          <div className={`pv-form-group${errors.businessType ? " has-error" : ""}`}>
            <label htmlFor="reg-business-type" className="pv-form-label">
              Business type <span className="required">*</span>
            </label>
            <select
              id="reg-business-type"
              name="business_type"
              className="pv-form-select"
              required
              value={businessType}
              onChange={(e) => { setBusinessType(e.target.value); clearError("businessType"); }}
            >
              <option value="" disabled>Select business type...</option>
              <option value="property">Property / Real Estate</option>
              <option value="automotive">Automotive</option>
              <option value="retail">Retail / E-commerce</option>
              <option value="other">Other</option>
            </select>
            {errors.businessType && <span className="pv-form-error">{errors.businessType}</span>}
          </div>

          <div className="pv-form-group">
            <label htmlFor="reg-business-reg" className="pv-form-label">
              Registration number <span style={{ color: "var(--ul-gray)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text"
              id="reg-business-reg"
              name="business_registration"
              className="pv-form-input"
              placeholder="e.g. RC-123456"
              autoComplete="off"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>

          <div className={`pv-form-group${errors.businessAddress ? " has-error" : ""}`}>
            <label htmlFor="reg-business-address" className="pv-form-label">
              Business address <span className="required">*</span>
            </label>
            <input
              type="text"
              id="reg-business-address"
              name="business_address"
              className="pv-form-input"
              placeholder="Street address, city, state"
              required
              value={businessAddress}
              onChange={(e) => { setBusinessAddress(e.target.value); clearError("businessAddress"); }}
            />
            {errors.businessAddress && <span className="pv-form-error">{errors.businessAddress}</span>}
          </div>

          <div className="pv-form-group">
            <label className="pv-form-label">
              Business logo <span style={{ color: "var(--ul-gray)", fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="pv-form-file-wrapper">
              <input
                type="file"
                name="business_logo"
                id="reg-business-logo"
                accept="image/png, image/jpeg, image/svg+xml"
              />
              <span className="pv-form-file-label">
                <i className="flaticon-mail"></i>
                <span>Choose a file (PNG, JPG, SVG)</span>
              </span>
            </div>
          </div>

          <div className="pv-auth-btn-group">
            <button type="button" className="pv-auth-btn pv-auth-btn--secondary" onClick={handleBack}>
              <span className="pv-btn-text">Back</span>
            </button>
            <button
              type="submit"
              className={`pv-auth-btn pv-auth-btn--primary${isSubmitting ? " is-loading" : ""}`}
              disabled={isSubmitting}
            >
              <span className="pv-btn-text">{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            </button>
          </div>
        </div>

      </form>

      <p className="pv-auth-footer-text">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </>
  );
}
