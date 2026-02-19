import type { FeatureItem } from "@/types/marketing";
import { faBullseye, faUsers, faStore, faWallet } from "@fortawesome/free-solid-svg-icons";

export const features: FeatureItem[] = [
  { id: 1, icon: faBullseye, title: "Goal-Based Savings" },
  { id: 2, icon: faUsers, title: "Group Savings (Ajo)" },
  { id: 3, icon: faStore, title: "Vendor Marketplace" },
  { id: 4, icon: faWallet, title: "Dual Wallet System" },
];
