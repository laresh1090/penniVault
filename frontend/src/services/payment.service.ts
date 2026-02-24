import api, { ApiResponse, csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export interface CardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentResult {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "success" | "failed";
  cardLastFour: string;
  cardType: string;
}

export const paymentService = {
  async processPayment(amount: number, card: CardDetails): Promise<PaymentResult> {
    if (useMockData()) {
      await delay(2000);
      return {
        id: `pay_${Date.now()}`,
        reference: `PV-MOCK-${Date.now()}`,
        amount,
        currency: "NGN",
        status: "success",
        cardLastFour: card.cardNumber.slice(-4),
        cardType: card.cardNumber.startsWith("4") ? "visa" : "mastercard",
      };
    }

    await csrf();
    const { data } = await api.post<ApiResponse<PaymentResult>>("/payments/process", {
      amount,
      currency: "NGN",
      card_number: card.cardNumber,
      expiry_month: card.expiryMonth,
      expiry_year: card.expiryYear,
      cvv: card.cvv,
    });
    return data.data;
  },
};
