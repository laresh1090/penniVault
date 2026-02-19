"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faBell, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/contexts/sidebar-context";
import { getInitials } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/wallet": "Wallet",
  "/savings": "Savings Plans",
  "/savings/groups": "Group Savings",
  "/marketplace": "Marketplace",
  "/transactions": "Transactions",
  "/profile": "Profile & Settings",
  "/help": "Help & Support",
  "/vendor-dashboard": "Vendor Dashboard",
  "/vendor/listings": "My Listings",
  "/vendor/listings/new": "Add Listing",
  "/vendor/orders": "Orders",
  "/vendor/analytics": "Analytics",
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
};

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  // Fallback: capitalize the last segment
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";

  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function DashboardTopbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toggle } = useSidebar();

  const pageTitle = getPageTitle(pathname);

  const initials =
    status === "authenticated" && session?.user
      ? getInitials(`${session.user.firstName} ${session.user.lastName}`)
      : "--";

  return (
    <div className="dashboard-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="topbar-search">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder="Search..." aria-label="Search" />
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-notification"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} />
          <span className="badge-count">3</span>
        </button>

        <div className="topbar-user">
          <div className="user-avatar">{initials}</div>
          <FontAwesomeIcon icon={faChevronDown} className="chevron" />
        </div>
      </div>
    </div>
  );
}
