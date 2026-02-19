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
