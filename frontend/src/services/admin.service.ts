import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import type { AdminUser, VendorApproval, SystemAlert } from "@/types/dashboard";
import {
  mockAdminRecentUsers,
  mockVendorApprovals,
  mockSystemAlerts,
} from "@/data/dashboard";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  pendingVendors: number;
  savingsVolume: number;
  activeGroups: number;
  groupMembers: number;
  transactionsThisMonth: number;
  platformRevenue: number;
}

export interface AdminTransaction {
  id: string;
  userName: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface AdminGroupOverview {
  id: string;
  name: string;
  members: string;
  contribution: number;
  frequency: string;
  currentRound: string;
  poolSize: number;
  status: string;
  createdBy: string;
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (useMockData()) {
      await delay();
      return {
        totalUsers: 12458,
        totalVendors: 342,
        pendingVendors: 4,
        savingsVolume: 2800000000,
        activeGroups: 89,
        groupMembers: 1240,
        transactionsThisMonth: 45672,
        platformRevenue: 42000000,
      };
    }
    const { data } = await api.get("/admin/dashboard/stats");
    return data.data as DashboardStats;
  },

  async getRecentUsers(limit = 5): Promise<AdminUser[]> {
    if (useMockData()) {
      await delay();
      return mockAdminRecentUsers.slice(0, limit);
    }
    const { data } = await api.get(`/admin/recent-users?limit=${limit}`);
    return data.data as AdminUser[];
  },

  async getPendingVendors(): Promise<VendorApproval[]> {
    if (useMockData()) {
      await delay();
      return mockVendorApprovals;
    }
    const { data } = await api.get("/admin/vendors/pending");
    return data.data as VendorApproval[];
  },

  async approveVendor(vendorProfileId: string): Promise<void> {
    if (useMockData()) {
      await delay();
      return;
    }
    await csrf();
    await api.post(`/admin/vendors/${vendorProfileId}/approve`);
  },

  async rejectVendor(vendorProfileId: string, reason?: string): Promise<void> {
    if (useMockData()) {
      await delay();
      return;
    }
    await csrf();
    await api.post(`/admin/vendors/${vendorProfileId}/reject`, { reason });
  },

  async getRecentTransactions(limit = 10): Promise<AdminTransaction[]> {
    if (useMockData()) {
      await delay();
      return [
        { id: "t1", userName: "Adebayo M.", type: "deposit", amount: 500000, status: "completed", description: "Wallet deposit", createdAt: new Date().toISOString() },
        { id: "t2", userName: "Chioma O.", type: "withdrawal", amount: -200000, status: "completed", description: "Withdrawal", createdAt: new Date().toISOString() },
        { id: "t3", userName: "Emeka K.", type: "deposit", amount: 1200000, status: "pending", description: "Pending deposit", createdAt: new Date().toISOString() },
        { id: "t4", userName: "Grace A.", type: "deposit", amount: 150000, status: "completed", description: "Savings contribution", createdAt: new Date().toISOString() },
      ];
    }
    const { data } = await api.get(`/admin/recent-transactions?limit=${limit}`);
    return data.data as AdminTransaction[];
  },

  async getGroupSavingsOverview(): Promise<AdminGroupOverview[]> {
    if (useMockData()) {
      await delay();
      return [];
    }
    const { data } = await api.get("/admin/group-savings-overview");
    return data.data as AdminGroupOverview[];
  },

  async getSystemAlerts(): Promise<SystemAlert[]> {
    if (useMockData()) {
      await delay();
      return mockSystemAlerts;
    }
    // Alerts are client-side for now (no backend model yet)
    return mockSystemAlerts;
  },

  async updateUser(userId: string, updates: { status?: string; role?: string }): Promise<void> {
    if (useMockData()) {
      await delay();
      return;
    }
    await csrf();
    await api.put(`/admin/users/${userId}`, updates);
  },
};
