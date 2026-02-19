"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faWallet,
  faPiggyBank,
  faUsers,
  faStore,
  faExchangeAlt,
  faCog,
  faQuestionCircle,
  faList,
  faPlusCircle,
  faShoppingCart,
  faChartBar,
  faEnvelope,
  faBuilding,
  faLayerGroup,
  faShoppingBag,
  faChartPie,
  faBullhorn,
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useSidebar } from "@/contexts/sidebar-context";
import { getInitials } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: IconDefinition;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const USER_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: faHome, href: "/dashboard" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Wallet", icon: faWallet, href: "/wallet" },
      { label: "Savings Plans", icon: faPiggyBank, href: "/savings" },
      { label: "Group Savings", icon: faUsers, href: "/savings/groups" },
      { label: "Marketplace", icon: faStore, href: "/marketplace" },
      { label: "Transactions", icon: faExchangeAlt, href: "/transactions" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", icon: faCog, href: "/profile" },
      { label: "Help & Support", icon: faQuestionCircle, href: "/help" },
    ],
  },
];

const VENDOR_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: faHome, href: "/vendor-dashboard" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "My Listings", icon: faList, href: "/vendor/listings" },
      { label: "Add Listing", icon: faPlusCircle, href: "/vendor/listings/new" },
      { label: "Orders", icon: faShoppingCart, href: "/vendor/orders", badge: "3" },
      { label: "Analytics", icon: faChartBar, href: "/vendor/analytics" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Wallet", icon: faWallet, href: "/vendor/wallet" },
      { label: "Messages", icon: faEnvelope, href: "/vendor/messages", badge: "5" },
      { label: "Business Profile", icon: faBuilding, href: "/vendor/profile" },
      { label: "Settings", icon: faCog, href: "/vendor/settings" },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: faHome, href: "/admin-dashboard" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Users", icon: faUsers, href: "/admin/users" },
      { label: "Vendors", icon: faStore, href: "/admin/vendors" },
      { label: "Savings Plans", icon: faPiggyBank, href: "/admin/savings" },
      { label: "Groups", icon: faLayerGroup, href: "/admin/groups" },
      { label: "Transactions", icon: faExchangeAlt, href: "/admin/transactions" },
      { label: "Marketplace", icon: faShoppingBag, href: "/admin/marketplace" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Reports", icon: faChartPie, href: "/admin/reports" },
      { label: "Announcements", icon: faBullhorn, href: "/admin/announcements" },
      { label: "Audit Log", icon: faClipboardList, href: "/admin/audit" },
      { label: "Settings", icon: faCog, href: "/admin/settings" },
    ],
  },
];

function getNavForRole(role: string | undefined): NavSection[] {
  switch (role) {
    case "vendor":
      return VENDOR_NAV;
    case "admin":
    case "superadmin":
      return ADMIN_NAV;
    default:
      return USER_NAV;
  }
}

function getRoleBadgeClass(role: string | undefined): string {
  switch (role) {
    case "vendor":
      return "role-vendor";
    case "admin":
    case "superadmin":
      return "role-admin";
    default:
      return "role-user";
  }
}

function getRoleLabel(role: string | undefined): string {
  switch (role) {
    case "vendor":
      return "Vendor";
    case "admin":
      return "Admin";
    case "superadmin":
      return "Super Admin";
    default:
      return "User";
  }
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isOpen, close } = useSidebar();

  const role = session?.user?.role;
  const navSections = getNavForRole(role);

  const userName =
    status === "authenticated" && session?.user
      ? `${session.user.firstName} ${session.user.lastName}`
      : "Loading...";

  const initials =
    status === "authenticated" && session?.user
      ? getInitials(`${session.user.firstName} ${session.user.lastName}`)
      : "--";

  const isActiveLink = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    close();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className={`dashboard-sidebar${isOpen ? " open" : ""}`}>
      <div className="sidebar-logo">
        <Link href="/dashboard" onClick={handleNavClick}>
          <span className="logo-penni">Penni</span>
          <span className="logo-vault">Vault</span>
        </Link>
      </div>

      <div className="sidebar-user-info">
        <div className="user-avatar">{initials}</div>
        <div className="user-details">
          <span className="user-name">{userName}</span>
          <span className={`user-role ${getRoleBadgeClass(role)}`}>
            {getRoleLabel(role)}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-nav-section">
            <span className="sidebar-nav-title">{section.title}</span>
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActiveLink(item.href) ? "active" : ""}
                    onClick={handleNavClick}
                  >
                    <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
