import api, { csrf } from "@/lib/api";
import { useMockData } from "@/lib/useMock";
import { mockNotifications } from "@/data";
import type { Notification } from "@/types";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

function mapNotification(raw: Record<string, unknown>): Notification {
  return {
    id: String(raw.id),
    userId: String(raw.user_id),
    title: String(raw.title),
    message: String(raw.message),
    type: String(raw.type) as Notification["type"],
    isRead: Boolean(raw.is_read),
    actionUrl: raw.action_url ? String(raw.action_url) : undefined,
    createdAt: String(raw.created_at),
  };
}

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    if (useMockData()) {
      await delay();
      return mockNotifications
        .filter((n) => n.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    const { data } = await api.get("/notifications?perPage=50");
    return (data.data as Record<string, unknown>[]).map(mapNotification);
  },

  async getUnreadCount(userId: string): Promise<number> {
    if (useMockData()) {
      await delay();
      return mockNotifications.filter(
        (n) => n.userId === userId && !n.isRead,
      ).length;
    }

    const { data } = await api.get("/notifications/unread-count");
    return data.count as number;
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (useMockData()) {
      await delay();
      const notification = mockNotifications.find(
        (n) => n.id === notificationId,
      );
      if (notification) {
        notification.isRead = true;
      }
      return;
    }

    await csrf();
    await api.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(userId: string): Promise<void> {
    if (useMockData()) {
      await delay();
      mockNotifications
        .filter((n) => n.userId === userId)
        .forEach((n) => {
          n.isRead = true;
        });
      return;
    }

    await csrf();
    await api.put("/notifications/read-all");
  },
};
