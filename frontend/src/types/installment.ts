export type InstallmentPlanStatus = "active" | "completed" | "overdue" | "defaulted" | "cancelled";
export type InstallmentPaymentStatus = "pending" | "paid" | "overdue" | "failed";
export type PaymentMethodType = "full" | "installment";

export interface InstallmentPlanBreakdown {
  itemPrice: number;
  upfrontPercent: number;
  upfrontAmount: number;
  remainingBase: number;
  markupPercent: number;
  markupAmount: number;
  totalRemaining: number;
  monthlyAmount: number;
  numberOfPayments: number;
  totalCost: number;
  roundingAdjustment: number;
}

export interface InstallmentPayment {
  id: string;
  installmentPlanId: string;
  paymentNumber: number;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: InstallmentPaymentStatus;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InstallmentPlan {
  id: string;
  orderId: string;
  userId: string;
  totalAmount: number;
  upfrontAmount: number;
  upfrontPercent: number;
  remainingAmount: number;
  markupPercent: number;
  markupAmount: number;
  monthlyAmount: number;
  numberOfPayments: number;
  paymentsCompleted: number;
  nextPaymentDueAt: string | null;
  status: InstallmentPlanStatus;
  progressPercent: number;
  amountPaidSoFar: number;
  amountRemaining: number;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    reference: string;
    amount: number;
    status: string;
    listing?: {
      id: string;
      title: string;
      category: string;
      price: number;
      primaryImage: string | null;
      images: string[];
    };
    vendor?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    buyer?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  payments?: InstallmentPayment[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface InstallmentFilters {
  status?: InstallmentPlanStatus;
  page?: number;
  perPage?: number;
}
