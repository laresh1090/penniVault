import { User } from "@/types";
import { mockUsers } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const userService = {
  async getCurrentUser(): Promise<User> {
    await delay();
    return mockUsers[0];
  },

  async getUserById(id: string): Promise<User | null> {
    await delay();
    return mockUsers.find((u) => u.id === id) || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await delay();
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getAllUsers(): Promise<User[]> {
    await delay();
    return mockUsers;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    await delay();
    return mockUsers.filter((u) => u.role === role);
  },
};
