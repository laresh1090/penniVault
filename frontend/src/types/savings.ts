import { SavingsFrequency, SavingsStatus, SavingsProductType, GroupSavingsStatus } from "./common";

export interface SavingsPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  productType: SavingsProductType;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate?: string;
  frequency: SavingsFrequency;
  contributionAmount: number;
  status: SavingsStatus;
  linkedAssetId?: string;
  /** Whether this plan earns interest */
  hasInterest: boolean;
  /** Annual interest rate (e.g. 8 means 8% p.a.). Only applicable when hasInterest is true */
  interestRate?: number;
  /** Interest earned so far */
  accruedInterest: number;
  /** Whether this is a fixed-term plan (locked until endDate) or flexible */
  isFixedTerm: boolean;
  /** Penalty percentage for early withdrawal (e.g. 5 means 5% of withdrawn amount) */
  earlyWithdrawalPenaltyPercent: number;
  createdAt: string;
}

export interface GroupSavings {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  frequency: SavingsFrequency;
  totalSlots: number;
  filledSlots: number;
  currentRound: number;
  totalRounds: number;
  members: GroupMember[];
  status: GroupSavingsStatus;
  startDate: string;
  nextPayoutDate: string;
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  name: string;
  avatarUrl?: string;
  position: number;
  hasPaidCurrentRound: boolean;
  totalContributed: number;
  joinedAt: string;
}

/** Extended detail for PenniSave plans -- includes auto-save config and enhanced transactions */
export interface PenniSavePlanDetail {
  id: string;
  userId: string;
  name: string;
  description: string;
  productType: "pennisave";
  targetAmount: number;           // 0 = no limit
  currentAmount: number;
  startDate: string;
  endDate?: string;               // null for PenniSave (no fixed term)
  frequency: SavingsFrequency;
  contributionAmount: number;
  status: SavingsStatus;
  hasInterest: boolean;
  interestRate?: number;
  accruedInterest: number;
  isFixedTerm: false;             // Always false for PenniSave
  earlyWithdrawalPenaltyPercent: number;
  createdAt: string;

  // PenniSave-specific
  nextAutoSaveDate: string | null;
  fundingSource: {
    bankName: string;
    accountNumber: string;
    paymentMethodId: string;
  } | null;
  totalDeposited: number;         // All-time deposits (auto + quick)
  totalWithdrawn: number;         // All-time withdrawals
  autoSaveCount: number;          // Number of auto-saves executed

  // Enhanced transactions
  transactions: PenniSaveTransaction[];
}

export interface PenniSaveTransaction {
  id: string;
  date: string;
  amount: number;
  type: "auto_save" | "quick_save" | "withdrawal" | "interest" | "contribution";
  status: "completed" | "pending" | "failed";
  balanceAfter: number;
  description: string;
}
