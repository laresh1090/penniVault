import api, { ApiResponse, csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { Wallet, PaymentMethod } from "@/types";
import { mockWallets, mockPaymentMethods } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export interface DepositToWalletPayload {
  amount: number;
  channel: "card" | "bank_transfer";
  cardDetails?: { number: string; expiry: string; cvv: string };
}

export interface WithdrawFromWalletPayload {
  amount: number;
  paymentMethodId: string;
}

export interface AddPaymentMethodPayload {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}

export const walletService = {
  async getUserWallet(): Promise<Wallet | null> {
    if (useMockData()) {
      await delay();
      return mockWallets.find((w) => w.userId === "usr_001") || null;
    }
    try {
      const { data } = await api.get("/wallet");
      return data.wallet as Wallet;
    } catch {
      return null;
    }
  },

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    if (useMockData()) {
      await delay();
      return mockPaymentMethods.filter((pm) => pm.userId === "usr_001");
    }
    const { data } = await api.get("/wallet/payment-methods");
    return data.paymentMethods as PaymentMethod[];
  },

  async addPaymentMethod(payload: AddPaymentMethodPayload): Promise<PaymentMethod> {
    if (useMockData()) {
      await delay();
      const newPm: PaymentMethod = {
        id: `pm_${Date.now()}`,
        userId: "usr_001",
        bankName: payload.bankName,
        bankCode: payload.bankCode,
        accountNumber: payload.accountNumber,
        accountName: payload.accountName,
        isDefault: payload.isDefault || false,
        createdAt: new Date().toISOString(),
      };
      mockPaymentMethods.push(newPm);
      return newPm;
    }
    await csrf();
    const { data } = await api.post("/wallet/payment-methods", {
      bankName: payload.bankName,
      bankCode: payload.bankCode,
      accountNumber: payload.accountNumber,
      accountName: payload.accountName,
      isDefault: payload.isDefault,
    });
    return data.paymentMethod as PaymentMethod;
  },

  async removePaymentMethod(id: string): Promise<void> {
    if (useMockData()) {
      await delay();
      return;
    }
    await csrf();
    await api.delete(`/wallet/payment-methods/${id}`);
  },

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    if (useMockData()) {
      await delay();
      const pm = mockPaymentMethods.find((p) => p.id === id);
      if (!pm) throw new Error("Payment method not found");
      mockPaymentMethods.forEach((p) => (p.isDefault = p.id === id));
      return pm;
    }
    await csrf();
    const { data } = await api.put(`/wallet/payment-methods/${id}/default`);
    return data.paymentMethod as PaymentMethod;
  },

  async depositToWallet(payload: DepositToWalletPayload): Promise<Wallet> {
    if (useMockData()) {
      await delay();
      const wallet = mockWallets.find((w) => w.userId === "usr_001");
      if (!wallet) throw new Error("Wallet not found");
      wallet.realBalance += payload.amount;
      return wallet;
    }
    await csrf();
    const { data } = await api.post("/payments/deposit", {
      amount: payload.amount,
      channel: payload.channel,
      cardDetails: payload.cardDetails,
    });
    return data.wallet as Wallet;
  },

  async withdrawFromWallet(payload: WithdrawFromWalletPayload): Promise<Wallet> {
    if (useMockData()) {
      await delay();
      const wallet = mockWallets.find((w) => w.userId === "usr_001");
      if (!wallet) throw new Error("Wallet not found");
      wallet.realBalance -= payload.amount;
      return wallet;
    }
    await csrf();
    const { data } = await api.post("/payments/withdraw", {
      amount: payload.amount,
      paymentMethodId: payload.paymentMethodId,
    });
    return data.wallet as Wallet;
  },
};
