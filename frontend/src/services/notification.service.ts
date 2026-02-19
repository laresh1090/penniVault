import { Notification } from "@/types";
import { mockNotifications } from "@/data";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    await delay();
    return mockNotifications
      .filter((n) => n.userId === userId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },

  async getUnreadCount(userId: string): Promise<number> {
    await delay();
    return mockNotifications.filter((n) => n.userId === userId && !n.isRead).length;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await delay();
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay();
    mockNotifications
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.isRead = true;
      });
  },
};
