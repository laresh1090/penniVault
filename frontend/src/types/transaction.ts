import { TransactionType, TransactionStatus } from "./common";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  balanceAfter: number;
  description: string;
  status: TransactionStatus;
  reference?: string;
  createdAt: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}
