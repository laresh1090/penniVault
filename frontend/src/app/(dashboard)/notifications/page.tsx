"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faPiggyBank,
  faPeopleGroup,
  faCircleInfo,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/formatters";
import type { Notification } from "@/types";

const TYPE_ICONS = {
  payment: faMoneyBillWave,
  savings: faPiggyBank,
  group: faPeopleGroup,
  info: faCircleInfo,
  success: faCheckCircle,
} as const;

const TYPE_COLORS: Record<string, string> = {
  payment: "#EB5310",
  savings: "#059669",
  group: "#6366F1",
  info: "#3B82F6",
  success: "#10B981",
};

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) markAsRead(notif.id);
    if (notif.actionUrl) router.push(notif.actionUrl);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">
            Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  background: "#EB5310",
                  color: "#fff",
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                {unreadCount} new
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button
              className="card-action"
              onClick={markAllAsRead}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#EB5310", fontSize: 13, fontWeight: 600 }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 48 }}>
            No notifications yet.
          </p>
        ) : (
          <div className="notification-page-list">
            {notifications.map((notif) => {
              const icon = TYPE_ICONS[notif.type as keyof typeof TYPE_ICONS] ?? faCircleInfo;
              const color = TYPE_COLORS[notif.type] ?? "#64748B";
              return (
                <button
                  key={notif.id}
                  className={`notification-page-item${notif.isRead ? "" : " unread"}`}
                  onClick={() => handleClick(notif)}
                >
                  <div
                    className="notification-page-icon"
                    style={{ background: `${color}15`, color }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <div className="notification-page-content">
                    <span className="notification-page-title">{notif.title}</span>
                    <span className="notification-page-message">{notif.message}</span>
                  </div>
                  <div className="notification-page-meta">
                    <span className="notification-page-time">{formatRelativeTime(notif.createdAt)}</span>
                    {!notif.isRead && <span className="notification-dot" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
