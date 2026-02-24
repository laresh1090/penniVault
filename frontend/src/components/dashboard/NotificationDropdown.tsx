"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faPiggyBank,
  faPeopleGroup,
  faCircleInfo,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formatRelativeTime } from "@/lib/formatters";
import type { Notification } from "@/types";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

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

export default function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onMarkRead,
  onClose,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const recent = notifications.slice(0, 5);

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) onMarkRead(notif.id);
    if (notif.actionUrl) router.push(notif.actionUrl);
    onClose();
  };

  return (
    <div className="notification-dropdown" ref={ref}>
      <div className="notification-dropdown-header">
        <span className="notification-dropdown-title">Notifications</span>
        <button className="notification-mark-all" onClick={onMarkAllRead}>
          Mark all read
        </button>
      </div>
      <div className="notification-dropdown-list">
        {recent.length === 0 ? (
          <p className="notification-empty">No notifications</p>
        ) : (
          recent.map((notif) => {
            const icon = TYPE_ICONS[notif.type as keyof typeof TYPE_ICONS] ?? faCircleInfo;
            const color = TYPE_COLORS[notif.type] ?? "#64748B";
            return (
              <button
                key={notif.id}
                className={`notification-item${notif.isRead ? "" : " unread"}`}
                onClick={() => handleClick(notif)}
              >
                <div
                  className="notification-item-icon"
                  style={{ background: `${color}15`, color }}
                >
                  <FontAwesomeIcon icon={icon} />
                </div>
                <div className="notification-item-content">
                  <span className="notification-item-title">{notif.title}</span>
                  <span className="notification-item-message">{notif.message}</span>
                  <span className="notification-item-time">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>
                {!notif.isRead && <span className="notification-dot" />}
              </button>
            );
          })
        )}
      </div>
      <div className="notification-dropdown-footer">
        <Link href="/notifications" onClick={onClose}>
          View all notifications
        </Link>
      </div>
    </div>
  );
}
