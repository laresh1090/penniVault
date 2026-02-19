export type UserRole = "user" | "vendor" | "admin" | "superadmin";
export type AccountStatus = "active" | "pending" | "suspended";
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "savings_contribution"
  | "savings_payout"
  | "commission"
  | "group_contribution"
  | "group_payout";
export type TransactionStatus = "completed" | "pending" | "failed";
export type SavingsFrequency = "daily" | "weekly" | "biweekly" | "monthly";
export type SavingsStatus = "active" | "completed" | "paused" | "cancelled";
export type GroupSavingsStatus = "active" | "completed" | "pending" | "cancelled";
export type AssetCategory = "property" | "automotive" | "lifestyle";
export type AssetStatus = "available" | "reserved" | "sold";
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "payment"
  | "savings"
  | "group";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
