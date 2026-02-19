import { SavingsFrequency, SavingsStatus, GroupSavingsStatus } from "./common";

export interface SavingsPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  frequency: SavingsFrequency;
  contributionAmount: number;
  status: SavingsStatus;
  linkedAssetId?: string;
  interestRate?: number;
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
