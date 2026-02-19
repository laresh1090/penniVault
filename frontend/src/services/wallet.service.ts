import { Wallet, PaymentMethod } from "@/types";
import { mockWallets, mockPaymentMethods } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const walletService = {
  async getUserWallet(userId: string): Promise<Wallet | null> {
    await delay();
    return mockWallets.find((w) => w.userId === userId) || null;
  },

  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    await delay();
    return mockPaymentMethods.filter((pm) => pm.userId === userId);
  },

  async getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
    await delay();
    return mockPaymentMethods.find((pm) => pm.userId === userId && pm.isDefault) || null;
  },
};
