"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/hooks/useNotifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faBell,
  faHouse,
  faWallet,
  faPiggyBank,
  faChartLine,
  faStore,
  faGear,
  faList,
  faBellSlash,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useSidebar } from "@/contexts/sidebar-context";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

interface QuickNavItem {
  label: string;
  href: string;
  icon: IconDefinition;
}

const QUICK_NAV: QuickNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: faHouse },
  { label: "Wallet", href: "/wallet", icon: faWallet },
  { label: "Savings", href: "/savings", icon: faPiggyBank },
  { label: "Investments", href: "/investments", icon: faChartLine },
  { label: "Marketplace", href: "/marketplace", icon: faStore },
  { label: "Transactions", href: "/transactions", icon: faList },
  { label: "Installments", href: "/installments", icon: faCalendarCheck },
  { label: "Notifications", href: "/notifications", icon: faBellSlash },
  { label: "Profile & Settings", href: "/profile", icon: faGear },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/wallet": "Wallet",
  "/savings": "Savings Plans",
  "/savings/groups": "Group Savings",
  "/marketplace": "Marketplace",
  "/installments": "My Installments",
  "/transactions": "Transactions",
  "/profile": "Profile & Settings",
  "/help": "Help & Support",
  "/investments": "Investments",
  "/vendor-dashboard": "Vendor Dashboard",
  "/vendor/listings": "My Listings",
  "/vendor/listings/new": "Add Listing",
  "/vendor/investments": "Investment Opportunities",
  "/vendor/investments/new": "Create Investment",
  "/vendor/orders": "Orders",
  "/vendor/wallet": "Vendor Wallet",
  "/vendor/messages": "Messages",
  "/vendor/profile": "Business Profile",
  "/vendor/settings": "Vendor Settings",
  "/admin-dashboard": "Admin Dashboard",
  "/admin/users": "Users",
  "/admin/vendors": "Vendors",
  "/admin/savings": "Savings Plans",
  "/admin/groups": "Groups",
  "/admin/transactions": "Transactions",
  "/admin/marketplace": "Marketplace",
  "/admin/reports": "Reports",
  "/admin/announcements": "Announcements",
  "/admin/audit": "Audit Log",
  "/admin/settings": "Admin Settings",
  "/notifications": "Notifications",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.charAt(0)?.toUpperCase() || "";
  const l = lastName?.charAt(0)?.toUpperCase() || "";
  return f + l || "U";
}

export default function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);
  const initials = getInitials(user?.firstName, user?.lastName);
  const displayName = user ? `${user.firstName}` : "User";

  // Filter quick-nav based on search query
  const filteredNav = searchQuery.trim()
    ? QUICK_NAV.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchNav = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (filteredNav.length === 1) {
        handleSearchNav(filteredNav[0].href);
      } else {
        router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setShowSearchDropdown(false);
      }
    }
    if (e.key === "Escape") {
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button className="sidebar-toggle" id="sidebarToggle" onClick={toggle} aria-label="Toggle sidebar">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-search" ref={searchRef}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowSearchDropdown(true);
            }}
            onKeyDown={handleSearchSubmit}
          />
          {showSearchDropdown && searchQuery.trim() && (
            <div className="search-dropdown">
              {filteredNav.length > 0 && (
                <div className="search-dropdown-section">
                  <span className="search-dropdown-label">Quick Navigation</span>
                  {filteredNav.map((item) => (
                    <button
                      key={item.href}
                      className="search-result-item"
                      onClick={() => handleSearchNav(item.href)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="search-result-icon" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <button
                className="search-result-item search-marketplace-link"
                onClick={() => handleSearchNav(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-result-icon" />
                <span>Search marketplace for &ldquo;{searchQuery.trim()}&rdquo;</span>
              </button>
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <button
            className="topbar-notification"
            aria-label="Notifications"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
          </button>
          {showNotifDropdown && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllAsRead}
              onMarkRead={markAsRead}
              onClose={() => setShowNotifDropdown(false)}
            />
          )}
        </div>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <span className="topbar-username">{displayName}</span>
        </div>
      </div>
    </header>
  );
}
