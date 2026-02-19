import { Wallet, PaymentMethod } from "@/types";

export const mockWallets: Wallet[] = [
  {
    id: "wal_001",
    userId: "usr_001",
    realBalance: 1250000,
    virtualBalance: 450000,
    currency: "NGN",
    updatedAt: "2026-02-06T14:30:00Z",
  },
  {
    id: "wal_002",
    userId: "usr_002",
    realBalance: 800000,
    virtualBalance: 200000,
    currency: "NGN",
    updatedAt: "2026-02-04T10:00:00Z",
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    userId: "usr_001",
    bankName: "First Bank",
    bankCode: "011",
    accountNumber: "****4521",
    accountName: "Adebayo Johnson",
    isDefault: true,
    createdAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "pm_002",
    userId: "usr_001",
    bankName: "GTBank",
    bankCode: "058",
    accountNumber: "****7890",
    accountName: "Adebayo Johnson",
    isDefault: false,
    createdAt: "2025-09-15T08:00:00Z",
  },
];
