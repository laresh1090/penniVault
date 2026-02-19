export const APP_NAME = "PenniVault";
export const APP_TAGLINE = "Asset Acquisition Infrastructure";
export const CURRENCY = "NGN";
export const CURRENCY_SYMBOL = "\u20A6";

export const PAGINATION_DEFAULT = 12;

export const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "033", name: "United Bank for Africa" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "232", name: "Sterling Bank" },
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/faq",
  "/contact",
  "/marketplace",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const USER_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "house" },
  { label: "My Wallet", href: "/wallet", icon: "wallet" },
  { label: "Savings Plans", href: "/savings", icon: "piggy-bank" },
  { label: "Group Savings", href: "/savings/groups", icon: "people-group" },
  { label: "Marketplace", href: "/marketplace", icon: "store" },
  { label: "Transactions", href: "/transactions", icon: "list" },
  { label: "Profile & Settings", href: "/profile", icon: "gear" },
  { label: "Help & Support", href: "#", icon: "circle-question" },
];

export const VENDOR_NAV = [
  { label: "Dashboard", href: "/vendor-dashboard", icon: "house" },
  { label: "My Listings", href: "/vendor-dashboard/listings", icon: "clipboard-list" },
  { label: "Orders", href: "/vendor-dashboard/orders", icon: "shopping-cart" },
  { label: "Wallet", href: "/wallet", icon: "wallet" },
  { label: "Transactions", href: "/transactions", icon: "list" },
  { label: "Profile", href: "/profile", icon: "gear" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin-dashboard", icon: "house" },
  { label: "Users", href: "/admin-dashboard/users", icon: "users" },
  { label: "Vendors", href: "/admin-dashboard/vendors", icon: "building" },
  { label: "Assets", href: "/admin-dashboard/assets", icon: "clipboard-list" },
  { label: "Transactions", href: "/admin-dashboard/transactions", icon: "list" },
  { label: "Reports", href: "/admin-dashboard/reports", icon: "chart-line" },
  { label: "Settings", href: "/admin-dashboard/settings", icon: "gear" },
];
