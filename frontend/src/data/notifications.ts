import { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "ntf_001",
    userId: "usr_001",
    title: "Deposit Successful",
    message: "Your deposit of \u20A6200,000 has been confirmed.",
    type: "payment",
    isRead: false,
    actionUrl: "/wallet",
    createdAt: "2026-02-06T14:35:00Z",
  },
  {
    id: "ntf_002",
    userId: "usr_001",
    title: "Savings Reminder",
    message:
      "Your Dream Home Fund monthly contribution of \u20A6500,000 is due tomorrow.",
    type: "savings",
    isRead: false,
    actionUrl: "/savings/sav_001",
    createdAt: "2026-02-05T09:00:00Z",
  },
  {
    id: "ntf_003",
    userId: "usr_001",
    title: "Group Update",
    message:
      "Amina Bello has not made the current round contribution for HomeOwners Circle.",
    type: "group",
    isRead: false,
    actionUrl: "/savings/groups/grp_001",
    createdAt: "2026-02-04T16:00:00Z",
  },
  {
    id: "ntf_004",
    userId: "usr_001",
    title: "New Listing",
    message:
      "A new property matching your interests has been listed on the marketplace.",
    type: "info",
    isRead: true,
    actionUrl: "/marketplace",
    createdAt: "2026-02-03T12:00:00Z",
  },
  {
    id: "ntf_005",
    userId: "usr_001",
    title: "Savings Milestone",
    message:
      "Congratulations! Your Emergency Fund has reached 70% of its target.",
    type: "success",
    isRead: true,
    actionUrl: "/savings/sav_003",
    createdAt: "2026-02-01T10:00:00Z",
  },
];
