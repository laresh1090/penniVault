"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faEnvelope, faUser, faPhone, faBuilding } from "@fortawesome/free-solid-svg-icons";
import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import FormCheckbox from "@/components/forms/FormCheckbox";
import FormSelect from "@/components/forms/FormSelect";
import FileUpload from "@/components/forms/FileUpload";
import AuthAlert from "@/components/auth/AuthAlert";
import StepIndicator from "@/components/auth/StepIndicator";
import RoleSelector from "@/components/auth/RoleSelector";

const registrationSteps = [
  { number: 1, label: "Role" },
  { number: 2, label: "Details" },
  { number: 3, label: "Profile" },
];

export default function RegisterPage() {
  const router = useRouter();
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    // Redirect to login with success message
    router.push("/login?registered=true");
  };

  return (
    <>
      <h1 className="pv-auth-title">Create your account</h1>
      <p className="pv-auth-subtitle">
        {currentStep === 1
          ? "Choose how you want to use PenniVault to get started."
          : currentStep === 2
          ? "Fill in your details to set up your account."
          : role === "vendor"
          ? "Tell us about your business."
          : "Just a few more details to personalize your experience."}
      </p>

      <StepIndicator steps={registrationSteps} currentStep={currentStep} />

      {globalError && (
        <AuthAlert type="error" message={globalError} onClose={() => setGlobalError("")} />
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* STEP 1: Role Selection */}
        {currentStep === 1 && (
          <div>
            <RoleSelector
              value={role}
              onChange={(r) => {
                setRole(r);
                if (errors.role) setErrors({});
              }}
              error={errors.role}
            />
            <button
              type="button"
              className="pv-auth-btn primary"
              onClick={handleNext}
              style={{ marginTop: "24px" }}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: Basic Information */}
        {currentStep === 2 && (
          <div>
            <FormInput
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              icon={faUser}
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError("fullName");
              }}
              error={errors.fullName}
              autoComplete="name"
            />

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
                clearError("email");
              }}
              error={errors.email}
              autoComplete="email"
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              icon={faPhone}
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              error={errors.phone}
              autoComplete="tel"
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              error={errors.password}
              showStrength
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearError("confirmPassword");
              }}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <FormCheckbox
              label={
                <>
                  I agree to the{" "}
                  <Link href="/terms" style={{ color: "var(--pv-primary)", fontWeight: 500 }}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" style={{ color: "var(--pv-primary)", fontWeight: 500 }}>
                    Privacy Policy
                  </Link>
                </>
              }
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => {
                setAgreeToTerms(e.target.checked);
                clearError("agreeToTerms");
              }}
            />
            {errors.agreeToTerms && (
              <div className="pv-form-error" style={{ marginTop: "-12px", marginBottom: "16px" }}>
                {errors.agreeToTerms}
              </div>
            )}

            <div className="pv-auth-btn-group" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="pv-auth-btn primary"
                onClick={handleBack}
                style={{ flex: "0 0 auto", background: "var(--pv-bg-alt)", color: "var(--pv-text)" }}
              >
                Back
              </button>
              <button
                type="button"
                className="pv-auth-btn primary"
                onClick={handleNext}
                style={{ flex: 1 }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3A: User Profile */}
        {currentStep === 3 && role === "user" && (
          <div>
            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                clearError("dateOfBirth");
              }}
              error={errors.dateOfBirth}
            />

            <FormSelect
              label="Primary Savings Goal"
              name="savingsGoal"
              placeholder="Select a goal (optional)"
              options={[
                { value: "property", label: "Property / Real Estate" },
                { value: "car", label: "Car / Vehicle" },
                { value: "general", label: "General Savings" },
                { value: "education", label: "Education" },
                { value: "other", label: "Other" },
              ]}
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
            />

            <FormInput
              label="Referral Code"
              name="referralCode"
              placeholder="Enter referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />

            <div className="pv-auth-btn-group" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="pv-auth-btn primary"
                onClick={handleBack}
                style={{ flex: "0 0 auto", background: "var(--pv-bg-alt)", color: "var(--pv-text)" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="pv-auth-btn primary"
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3B: Vendor Profile */}
        {currentStep === 3 && role === "vendor" && (
          <div>
            <FormInput
              label="Business Name"
              name="businessName"
              placeholder="Enter your business name"
              icon={faBuilding}
              required
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                clearError("businessName");
              }}
              error={errors.businessName}
            />

            <FormSelect
              label="Business Type"
              name="businessType"
              placeholder="Select business type"
              required
              options={[
                { value: "property", label: "Property / Real Estate" },
                { value: "automotive", label: "Automotive" },
                { value: "retail", label: "Retail" },
                { value: "other", label: "Other" },
              ]}
              value={businessType}
              onChange={(e) => {
                setBusinessType(e.target.value);
                clearError("businessType");
              }}
              error={errors.businessType}
            />

            <FormInput
              label="Registration Number"
              name="registrationNumber"
              placeholder="CAC registration number (optional)"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />

            <FormInput
              label="Business Address"
              name="businessAddress"
              placeholder="Enter your business address"
              required
              value={businessAddress}
              onChange={(e) => {
                setBusinessAddress(e.target.value);
                clearError("businessAddress");
              }}
              error={errors.businessAddress}
            />

            <FileUpload
              label="Business Logo"
              name="businessLogo"
              accept=".png,.jpg,.jpeg,.svg"
              maxSizeMB={2}
            />

            <div className="pv-auth-btn-group" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="pv-auth-btn primary"
                onClick={handleBack}
                style={{ flex: "0 0 auto", background: "var(--pv-bg-alt)", color: "var(--pv-text)" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="pv-auth-btn primary"
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="pv-auth-footer">
        Already have an account?{" "}
        <Link href="/login">Log in</Link>
      </p>
    </>
  );
}
