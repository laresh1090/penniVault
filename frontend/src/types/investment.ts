export type InvestmentCategory = "agriculture" | "real_estate" | "technology" | "other";
export type InvestmentStatus = "open" | "funded" | "in_progress" | "matured" | "cancelled";
export type UserInvestmentStatus = "active" | "matured" | "cancelled" | "returned";
export type RiskLevel = "low" | "medium" | "high";

export interface InvestmentVendor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  vendorProfile?: {
    businessName: string;
    businessType?: string;
    businessLogoUrl?: string;
    isApproved?: boolean;
  };
}

export interface CrowdInvestment {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: InvestmentCategory;
  imageUrl: string;
  location: string;
  targetAmount: number;
  raisedAmount: number;
  minimumInvestment: number;
  expectedReturnPercent: number;
  durationDays: number;
  startDate: string;
  maturityDate: string;
  status: InvestmentStatus;
  investorsCount: number;
  riskLevel?: RiskLevel;
  vendor?: InvestmentVendor;
  createdAt: string;
}

export interface UserInvestment {
  id: string;
  userId: string;
  investmentId: string;
  investment: CrowdInvestment;
  amountInvested: number;
  expectedReturn: number;
  interestEarned: number;
  investedAt: string;
  maturityDate: string;
  status: UserInvestmentStatus;
}

export interface InvestmentFilters {
  category?: InvestmentCategory | "all";
  riskLevel?: RiskLevel | "all";
  status?: InvestmentStatus | "all";
  sort?: "newest" | "highest-roi" | "lowest-minimum" | "most-funded";
  page?: number;
  perPage?: number;
}

export interface UserInvestmentFilters {
  status?: UserInvestmentStatus | "all";
  page?: number;
  perPage?: number;
}
