export interface UserDashboardStats {
  totalSavings: number;
  activePlans: number;
  groupMemberships: number;
  totalDeposited: number;
  savingsGrowthPercent: number;
  monthlyContribution: number;
}

export interface VendorDashboardStats {
  totalListings: number;
  activeOrders: number;
  totalRevenue: number;
  activeSavers: number;
  revenueGrowthPercent: number;
  conversionRate: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalAssets: number;
  platformVolume: number;
  activeSavingsPlans: number;
  activeGroups: number;
  pendingApprovals: number;
  defaultRate: number;
}

export interface WalletSummary {
  realBalance: number;
  virtualBalance: number;
  totalSavings: number;
  monthlySavingsRate: number;
}

export interface VendorOrder {
  id: string;
  buyerName: string;
  assetTitle: string;
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface VendorListing {
  id: string;
  title: string;
  category: "property" | "automotive" | "lifestyle";
  price: number;
  status: "active" | "draft" | "sold";
  views: number;
  saversCount: number;
  imageUrl: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "vendor";
  status: "active" | "pending";
  joinedAt: string;
}

export interface VendorApproval {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface SystemAlert {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
  timestamp: string;
  isResolved: boolean;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number;
}

export interface SavingsPlanDetail {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  frequency: string;
  contributionAmount: number;
  status: string;
  interestRate?: number;
  linkedAsset?: {
    id: string;
    title: string;
    price: number;
    category: string;
    vendorName: string;
    imageUrl: string;
  };
  transactions: {
    id: string;
    date: string;
    amount: number;
    type: string;
    status: string;
  }[];
}

export interface GroupSavingsDetail {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  frequency: string;
  totalSlots: number;
  filledSlots: number;
  currentRound: number;
  totalRounds: number;
  poolSize: number;
  status: string;
  startDate: string;
  nextPayoutDate: string;
  members: {
    userId: string;
    name: string;
    position: number;
    hasPaidCurrentRound: boolean;
    totalContributed: number;
    joinedAt: string;
    isCurrentTurn: boolean;
  }[];
  payoutSchedule: {
    round: number;
    recipientName: string;
    date: string;
    amount: number;
    status: "completed" | "upcoming" | "current";
  }[];
  recentActivity: {
    id: string;
    memberName: string;
    action: string;
    timestamp: string;
  }[];
}
