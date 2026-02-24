"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/hooks";
import { formatNaira } from "@/lib/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faWallet,
  faPiggyBank,
  faPeopleGroup,
  faStore,
  faList,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faPlusCircle,
  faShoppingCart,
  faChartBar,
  faChartLine,
  faEnvelope,
  faBuilding,
  faLayerGroup,
  faShoppingBag,
  faChartPie,
  faBullhorn,
  faClipboardList,
  faUsers,
  faExchangeAlt,
  faLock,
  faBullseye,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useSidebar } from "@/contexts/sidebar-context";

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
      { label: "Dashboard", icon: faHouse, href: "/dashboard" },
      { label: "My Wallet", icon: faWallet, href: "/wallet" },
    ],
  },
  {
    title: "Savings",
    items: [
      { label: "PenniSave", icon: faPiggyBank, href: "/savings?type=pennisave" },
      { label: "PenniLock", icon: faLock, href: "/savings?type=pennilock" },
      { label: "TargetSave", icon: faBullseye, href: "/savings?type=targetsave" },
      { label: "PenniAjo", icon: faPeopleGroup, href: "/savings/groups", badge: "2" },
    ],
  },
  {
    title: "Invest",
    items: [
      { label: "Investments", icon: faChartLine, href: "/investments" },
      { label: "Marketplace", icon: faStore, href: "/marketplace" },
      { label: "Installments", icon: faCalendarCheck, href: "/installments" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Transactions", icon: faList, href: "/transactions" },
      { label: "Profile & Settings", icon: faGear, href: "/profile" },
      { label: "Help & Support", icon: faCircleQuestion, href: "/help" },
    ],
  },
];

const VENDOR_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: faHouse, href: "/vendor-dashboard" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "My Listings", icon: faList, href: "/vendor/listings" },
      { label: "Add Listing", icon: faPlusCircle, href: "/vendor/listings/new" },
      { label: "Investment Ops", icon: faChartLine, href: "/vendor/investments" },
      { label: "Orders", icon: faShoppingCart, href: "/vendor/orders" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Wallet", icon: faWallet, href: "/vendor/wallet" },
      { label: "Messages", icon: faEnvelope, href: "/vendor/messages", badge: "5" },
      { label: "Business Profile", icon: faBuilding, href: "/vendor/profile" },
      { label: "Settings", icon: faGear, href: "/vendor/settings" },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: faHouse, href: "/admin-dashboard" },
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
      { label: "Settings", icon: faGear, href: "/admin/settings" },
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const { wallet, isLoading: walletLoading } = useWallet();

  const role = user?.role;
  const navSections = getNavForRole(role);

  const isActiveLink = (href: string): boolean => {
    // Parse the href to separate pathname and query params
    const url = new URL(href, "http://x");
    const hrefPath = url.pathname;
    const hrefParams = url.searchParams;

    // If href has query params, require both path and param match
    if (hrefParams.toString()) {
      if (pathname !== hrefPath) return false;
      for (const [key, value] of hrefParams.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // Exact match or child route match
    return pathname === hrefPath || pathname.startsWith(hrefPath + "/");
  };

  const handleNavClick = () => {
    close();
  };

  const handleLogout = () => {
    logout();
  };

  const isUser = !role || role === "user";

  return (
    <aside className={`dashboard-sidebar${isOpen ? " open" : ""}`} id="dashboardSidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h3>Penni<span>Vault</span></h3>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <span key={section.title} style={{ display: "contents" }}>
            <p className="nav-label">{section.title}</p>
            {section.items.map((item) => (
              <span key={item.href} style={{ display: "contents" }}>
                <Link
                  href={item.href}
                  className={`nav-item${isActiveLink(item.href) ? " active" : ""}`}
                  onClick={handleNavClick}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                  {item.href === "/wallet" && isUser && (
                    <span className="sidebar-wallet-balance">
                      {walletLoading ? "---" : formatNaira(wallet?.realBalance ?? 0, false)}
                    </span>
                  )}
                </Link>
              </span>
            ))}
          </span>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <a
          href="#"
          className="nav-item"
          onClick={(e) => { e.preventDefault(); handleLogout(); }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
