export interface Wallet {
  id: string;
  userId: string;
  realBalance: number;
  virtualBalance: number;
  currency: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}
