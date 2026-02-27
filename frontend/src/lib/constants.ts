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

// PenniLock rate tiers — longer locks earn higher rates
export const PENNILOCK_RATE_TIERS = [
  { minDays: 30,  maxDays: 59,  rate: 8,  label: "30 days" },
  { minDays: 60,  maxDays: 89,  rate: 10, label: "60 days" },
  { minDays: 90,  maxDays: 179, rate: 12, label: "90 days" },
  { minDays: 180, maxDays: 364, rate: 14, label: "180 days" },
  { minDays: 365, maxDays: Infinity, rate: 15, label: "365 days" },
] as const;

export const PENNILOCK_MIN_AMOUNT = 10_000;
export const PENNILOCK_MIN_DAYS = 30;
export const PENNILOCK_MAX_DAYS = 730;
export const PENNILOCK_BREAK_PENALTY_PERCENT = 5;
export const PENNILOCK_MIN_DAYS_BEFORE_BREAK = 30;

// Installment plan constants
export const INSTALLMENT_MONTHS_OPTIONS = [6, 12] as const;
export const INSTALLMENT_DEFAULT_UPFRONT_PERCENT = 40;
export const INSTALLMENT_MIN_UPFRONT_PERCENT = 20;
export const INSTALLMENT_MAX_UPFRONT_PERCENT = 60;
export const INSTALLMENT_DEFAULT_MARKUP_6M = 5;
export const INSTALLMENT_DEFAULT_MARKUP_12M = 10;
export const INSTALLMENT_MAX_MARKUP = 50;

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
  { label: "Investments", href: "/investments", icon: "chart-line" },
  { label: "Marketplace", href: "/marketplace", icon: "store" },
  { label: "Transactions", href: "/transactions", icon: "list" },
  { label: "Profile & Settings", href: "/profile", icon: "gear" },
  { label: "Help & Support", href: "#", icon: "circle-question" },
];

export const VENDOR_NAV = [
  { label: "Dashboard", href: "/vendor-dashboard", icon: "house" },
  { label: "My Listings", href: "/vendor/listings", icon: "clipboard-list" },
  { label: "Orders", href: "/vendor/orders", icon: "shopping-cart" },
  { label: "Investments", href: "/vendor/investments", icon: "chart-line" },
  { label: "PenniAjo", href: "/vendor/ajo", icon: "people-group" },
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
