import type { ServiceCard } from "@/types/marketing";
import { faBullseye, faHandshake, faShoppingCart, faWallet } from "@fortawesome/free-solid-svg-icons";

export const services: ServiceCard[] = [
  {
    id: 1,
    icon: faBullseye,
    iconBg: "#FFF3EE",
    iconColor: "#EB5310",
    title: "Goal-Based Savings",
    description: "Set your financial goal, pick a plan, and watch your savings grow with optional interest. Whether it's a car, land, or emergency fund — we've got you.",
    image: "/images/marketing/service-1.jpg",
    href: "/services#goal-savings",
  },
  {
    id: 2,
    icon: faHandshake,
    iconBg: "#FFF8EB",
    iconColor: "#FAA019",
    title: "Group Savings (Ajo)",
    description: "Join a trusted savings group with our transparent midpoint-turn model. Save together, receive your payout, and build wealth as a community.",
    image: "/images/marketing/service-2.jpg",
    href: "/services#group-savings",
  },
  {
    id: 3,
    icon: faShoppingCart,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Vendor Marketplace",
    description: "Browse verified vendors offering real estate, automobiles, and more. Link your savings plan to a product and save directly towards it.",
    image: "/images/marketing/service-3.jpg",
    href: "/services#marketplace",
  },
  {
    id: 4,
    icon: faWallet,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    title: "Dual Wallet System",
    description: "Manage your finances with two wallets — Real Wallet for deposits and Virtual Wallet for group savings entitlements. Complete financial clarity.",
    image: "/images/marketing/service-4.jpg",
    href: "/services#dual-wallet",
  },
];
