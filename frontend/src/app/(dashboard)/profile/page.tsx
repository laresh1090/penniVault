"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  // Personal Info form state
  const [fullName, setFullName] = useState(`${user?.firstName ?? ""} ${user?.lastName ?? ""}`);
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState(user?.address ?? "");

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification toggles
  const [savingsEmailOn, setSavingsEmailOn] = useState(true);
  const [savingsSmsOn, setSavingsSmsOn] = useState(true);
  const [groupEmailOn, setGroupEmailOn] = useState(true);
  const [groupSmsOn, setGroupSmsOn] = useState(false);
  const [txnEmailOn, setTxnEmailOn] = useState(true);
  const [txnSmsOn, setTxnSmsOn] = useState(true);
  const [marketEmailOn, setMarketEmailOn] = useState(false);
  const [marketSmsOn, setMarketSmsOn] = useState(false);

  return (
    <>
      {/* Page Heading */}
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: "#1E252F" }}>
        Profile &amp; Settings
      </h2>

      {/* Personal Information Card */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Personal Information</h3>
        </div>
        <div className="row">
          {/* Profile Photo Column */}
          <div className="col-md-3 text-center">
            <div
              className="profile-photo mb-3"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #EB5310, #FAA019)",
                color: "#fff",
                fontSize: "2.5rem",
                fontWeight: 700,
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <br />
            <button className="btn btn-outline-secondary btn-sm">Change Photo</button>
          </div>
          {/* Form Column */}
          <div className="col-md-9">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    className="form-label"
                    style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label"
                    style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label"
                    style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
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
                    className="form-label"
                    style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label
                    className="form-label"
                    style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: "#EB5310", borderColor: "#EB5310" }}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} className="me-1" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Security</h3>
        </div>
        <form>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
              >
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
              >
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="button" className="btn btn-secondary">
            Update Password
          </button>
        </form>

        <hr />

        {/* Two-Factor Authentication */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h5 style={{ fontSize: 15, fontWeight: 700, color: "#1E252F", marginBottom: 4 }}>
              Two-Factor Authentication
            </h5>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
              Add extra security to your account
            </p>
          </div>
          <div className="form-check form-switch form-switch-lg">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="twoFactorToggle"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Notification Preferences</h3>
        </div>

        {/* Row 1: Savings Reminders */}
        <div className="notification-row">
          <div className="notification-info">
            <p className="notif-label">Savings Reminders</p>
            <p className="notif-desc">Get notified about upcoming contributions</p>
          </div>
          <div className="notification-toggles">
            <div className="toggle-group">
              <span>Email</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={savingsEmailOn}
                  onChange={() => setSavingsEmailOn(!savingsEmailOn)}
                />
              </div>
            </div>
            <div className="toggle-group">
              <span>SMS</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={savingsSmsOn}
                  onChange={() => setSavingsSmsOn(!savingsSmsOn)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Group Savings Updates */}
        <div className="notification-row">
          <div className="notification-info">
            <p className="notif-label">Group Savings Updates</p>
            <p className="notif-desc">Turn notifications and group activity</p>
          </div>
          <div className="notification-toggles">
            <div className="toggle-group">
              <span>Email</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={groupEmailOn}
                  onChange={() => setGroupEmailOn(!groupEmailOn)}
                />
              </div>
            </div>
            <div className="toggle-group">
              <span>SMS</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={groupSmsOn}
                  onChange={() => setGroupSmsOn(!groupSmsOn)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Transaction Alerts */}
        <div className="notification-row">
          <div className="notification-info">
            <p className="notif-label">Transaction Alerts</p>
            <p className="notif-desc">Deposits, withdrawals, and transfers</p>
          </div>
          <div className="notification-toggles">
            <div className="toggle-group">
              <span>Email</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={txnEmailOn}
                  onChange={() => setTxnEmailOn(!txnEmailOn)}
                />
              </div>
            </div>
            <div className="toggle-group">
              <span>SMS</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={txnSmsOn}
                  onChange={() => setTxnSmsOn(!txnSmsOn)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Marketplace Alerts */}
        <div className="notification-row">
          <div className="notification-info">
            <p className="notif-label">Marketplace Alerts</p>
            <p className="notif-desc">New listings matching your interests</p>
          </div>
          <div className="notification-toggles">
            <div className="toggle-group">
              <span>Email</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={marketEmailOn}
                  onChange={() => setMarketEmailOn(!marketEmailOn)}
                />
              </div>
            </div>
            <div className="toggle-group">
              <span>SMS</span>
              <div className="form-check form-switch form-switch-lg mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={marketSmsOn}
                  onChange={() => setMarketSmsOn(!marketSmsOn)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Card */}
      <div className="dash-card mb-4">
        <div className="kyc-header">
          <div>
            <h3 className="kyc-title">Identity Verification (KYC)</h3>
            <p className="kyc-desc">Required for withdrawals above {"\u20A6"}500,000</p>
          </div>
          <span className="status-badge active">Verified</span>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="dash-card" style={{ borderLeft: "4px solid #DC2626" }}>
        <div className="card-header">
          <h3 className="card-title" style={{ color: "#DC2626" }}>Danger Zone</h3>
        </div>

        {/* Deactivate Account */}
        <div className="danger-row">
          <div className="danger-info">
            <p className="danger-label">Deactivate Account</p>
            <p className="danger-desc">Temporarily disable your account</p>
          </div>
          <button className="btn btn-outline-warning btn-sm">Deactivate</button>
        </div>

        <hr />

        {/* Delete Account */}
        <div className="danger-row">
          <div className="danger-info">
            <p className="danger-label">Delete Account</p>
            <p className="danger-desc">Permanently delete your account and all data</p>
          </div>
          <button className="btn btn-outline-danger btn-sm">Delete Account</button>
        </div>
      </div>
    </>
  );
}
