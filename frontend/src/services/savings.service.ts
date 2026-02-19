import { SavingsPlan, GroupSavings } from "@/types";
import { mockSavingsPlans, mockGroupSavings } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const savingsService = {
  async getUserSavingsPlans(userId: string): Promise<SavingsPlan[]> {
    await delay();
    return mockSavingsPlans.filter((s) => s.userId === userId);
  },

  async getSavingsPlanById(id: string): Promise<SavingsPlan | null> {
    await delay();
    return mockSavingsPlans.find((s) => s.id === id) || null;
  },

  async getGroupSavings(): Promise<GroupSavings[]> {
    await delay();
    return mockGroupSavings;
  },

  async getGroupSavingsById(id: string): Promise<GroupSavings | null> {
    await delay();
    return mockGroupSavings.find((g) => g.id === id) || null;
  },

  async getUserGroupSavings(userId: string): Promise<GroupSavings[]> {
    await delay();
    return mockGroupSavings.filter((g) =>
      g.members.some((m) => m.userId === userId),
    );
  },
};
