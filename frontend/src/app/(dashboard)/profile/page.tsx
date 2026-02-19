"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShieldHalved,
  faBell,
  faEdit,
  faBan,
  faTrash,
  faLock,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import { mockUsers } from "@/data/users";
import { getInitials } from "@/lib/utils";

type TabKey = "personal" | "security" | "notifications" | "kyc";

export default function ProfilePage() {
  const user = mockUsers[0];

  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  // Personal Info form state
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "");
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "");
  const [state, setState] = useState(user.state || "");
  const [bio, setBio] = useState(user.bio || "");
  const [personalSaved, setPersonalSaved] = useState(false);

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [savingsReminders, setSavingsReminders] = useState(true);
  const [groupUpdates, setGroupUpdates] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const tabs: { key: TabKey; label: string; icon: typeof faUser }[] = [
    { key: "personal", label: "Personal Info", icon: faUser },
    { key: "security", label: "Security", icon: faShieldHalved },
    { key: "notifications", label: "Notifications", icon: faBell },
    { key: "kyc", label: "KYC Status", icon: faLock },
  ];

  return (
    <div>
      <h2
        className="mb-4"
        style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E252F" }}
      >
        Profile & Settings
      </h2>

      {/* Tab Navigation */}
      <div className="settings-tabs" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#F1F5F9",
            borderRadius: 12,
            padding: 4,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: "1 1 auto",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: activeTab === tab.key ? "#fff" : "transparent",
                boxShadow:
                  activeTab === tab.key
                    ? "0 1px 3px rgba(0,0,0,0.1)"
                    : "none",
                color: activeTab === tab.key ? "#1E252F" : "#64748B",
                fontWeight: activeTab === tab.key ? 600 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesomeIcon icon={tab.icon} style={{ fontSize: "0.8rem" }} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === "personal" && (
        <div>
          {/* Profile Header Card */}
          <div
            className="settings-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #EB5310, #FAA019)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.75rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1E252F",
                  marginBottom: 4,
                }}
              >
                {user.firstName} {user.lastName}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748B",
                  marginBottom: 4,
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ marginRight: 6, fontSize: "0.8rem" }}
                />
                {user.email}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748B",
                  marginBottom: 0,
                }}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ marginRight: 6, fontSize: "0.8rem" }}
                />
                {user.phone}
              </p>
            </div>
          </div>

          {/* Personal Info Form */}
          <div
            className="settings-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h5
              style={{
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "#1E252F",
                marginBottom: 20,
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit Profile
            </h5>

            {personalSaved && (
              <div
                className="alert alert-success"
                style={{
                  fontSize: "0.875rem",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSavePersonal}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                    style={{ background: "#F8FAFC", color: "#94A3B8" }}
                  />
                  <small className="text-muted">
                    Email cannot be changed
                  </small>
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Bio
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      background: "#EB5310",
                      borderColor: "#EB5310",
                      fontWeight: 600,
                      padding: "10px 32px",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === "security" && (
        <div>
          {/* Change Password */}
          <div
            className="settings-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h5
              style={{
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "#1E252F",
                marginBottom: 20,
              }}
            >
              <FontAwesomeIcon icon={faLock} className="me-2" />
              Change Password
            </h5>

            {passwordSaved && (
              <div
                className="alert alert-success"
                style={{
                  fontSize: "0.875rem",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                Password updated successfully!
              </div>
            )}

            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <div
                  className="alert alert-danger"
                  style={{
                    fontSize: "0.875rem",
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  Passwords do not match
                </div>
              )}

            <form onSubmit={handleSavePassword}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    style={{ fontSize: 14 }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !currentPassword ||
                      !newPassword ||
                      newPassword !== confirmPassword
                    }
                    style={{
                      background: "#EB5310",
                      borderColor: "#EB5310",
                      fontWeight: 600,
                      padding: "10px 32px",
                    }}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div
            className="settings-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h5
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "#1E252F",
                    marginBottom: 4,
                  }}
                >
                  <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
                  Two-Factor Authentication
                </h5>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748B",
                    marginBottom: 0,
                  }}
                >
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>
              </div>
              <div className="notification-toggle" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="toggle-switch"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  style={{
                    width: 52,
                    height: 28,
                    borderRadius: 14,
                    border: "none",
                    background: twoFactorEnabled ? "#059669" : "#CBD5E1",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: twoFactorEnabled ? 27 : 3,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      transition: "left 0.2s ease",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div
            className="settings-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h5
              style={{
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "#1E252F",
                marginBottom: 16,
              }}
            >
              Active Sessions
            </h5>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#F8FAFC",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#059669",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#1E252F",
                  }}
                >
                  Current Session - Windows Chrome
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                  Lagos, Nigeria &middot; Active now
                </div>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "#ECFDF5",
                  color: "#059669",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Current
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#F8FAFC",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#94A3B8",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#1E252F",
                  }}
                >
                  iPhone 15 - Safari
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                  Lagos, Nigeria &middot; 2 hours ago
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              style={{ fontWeight: 600 }}
            >
              Log out all other sessions
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "notifications" && (
        <div
          className="settings-card"
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h5
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "#1E252F",
              marginBottom: 24,
            }}
          >
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Notification Preferences
          </h5>

          {[
            {
              label: "Email Notifications",
              description: "Receive important updates and alerts via email",
              value: emailNotifs,
              setter: setEmailNotifs,
            },
            {
              label: "Push Notifications",
              description:
                "Get real-time notifications on your device",
              value: pushNotifs,
              setter: setPushNotifs,
            },
            {
              label: "Transaction Alerts",
              description:
                "Be notified of deposits, withdrawals, and transfers",
              value: transactionAlerts,
              setter: setTransactionAlerts,
            },
            {
              label: "Savings Reminders",
              description:
                "Reminders for upcoming savings contributions and deadlines",
              value: savingsReminders,
              setter: setSavingsReminders,
            },
            {
              label: "Group Updates",
              description:
                "Notifications about group savings activities and payouts",
              value: groupUpdates,
              setter: setGroupUpdates,
            },
            {
              label: "Marketing Updates",
              description:
                "Promotional offers, new features, and PenniVault news",
              value: marketingUpdates,
              setter: setMarketingUpdates,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="notification-toggle"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#1E252F",
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                  {item.description}
                </div>
              </div>
              <button
                type="button"
                className="toggle-switch"
                onClick={() => item.setter(!item.value)}
                style={{
                  width: 52,
                  height: 28,
                  borderRadius: 14,
                  border: "none",
                  background: item.value ? "#059669" : "#CBD5E1",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: item.value ? 27 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    transition: "left 0.2s ease",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: KYC Status */}
      {activeTab === "kyc" && (
        <div>
          {/* KYC Overview */}
          <div
            className="kyc-status-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#FFF8EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  style={{ color: "#D97706", fontSize: "1.25rem" }}
                />
              </div>
              <div>
                <h5
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "#1E252F",
                    marginBottom: 4,
                  }}
                >
                  Identity Verification
                </h5>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "#FFF8EB",
                    color: "#D97706",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#D97706",
                      display: "inline-block",
                    }}
                  />
                  Pending Verification
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748B",
                marginBottom: 24,
              }}
            >
              Complete your KYC verification to unlock full platform features
              including higher transaction limits and faster withdrawals.
            </p>

            {/* BVN */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                background: "#ECFDF5",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "1.125rem" }}>&#10003;</span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#1E252F",
                  }}
                >
                  BVN Verification
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#059669" }}>
                  Verified
                </div>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "#059669",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Verified
              </span>
            </div>

            {/* NIN */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                background: "#FFF8EB",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ color: "#D97706", fontSize: "0.875rem" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#1E252F",
                  }}
                >
                  NIN Verification
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#D97706" }}>
                  Pending - Please upload your NIN slip
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#EB5310",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  borderRadius: 8,
                  padding: "6px 16px",
                }}
              >
                Upload
              </button>
            </div>

            {/* Address Proof */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                background: "#FFF8EB",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ color: "#D97706", fontSize: "0.875rem" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#1E252F",
                  }}
                >
                  Proof of Address
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#D97706" }}>
                  Pending - Upload utility bill or bank statement
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#EB5310",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  borderRadius: 8,
                  padding: "6px 16px",
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone - Always Visible */}
      <div
        className="danger-zone settings-card"
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #FCA5A5",
          padding: 24,
        }}
      >
        <h5
          style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "#DC2626",
            marginBottom: 4,
          }}
        >
          Danger Zone
        </h5>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#64748B",
            marginBottom: 20,
          }}
        >
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="d-flex gap-3 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FontAwesomeIcon icon={faBan} />
            Deactivate Account
          </button>
          <button
            type="button"
            className="btn btn-danger"
            style={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
