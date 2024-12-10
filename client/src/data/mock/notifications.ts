import { UserNotification } from "@/types/notification.types";

export const mockNotifications: UserNotification[] = [
  {
    id: "1",
    title: "New Project Proposal",
    message: "A new project proposal has been submitted for your review.",
    type: "info",
    timestamp: "2024-01-20T10:30:00Z",
    isRead: true,
    link: "/admin/proposals/123",
  },
  {
    id: "2",
    title: "Approval Required",
    message:
      "The banner program 'Community Health Initiative' needs your approval.",
    type: "warning",
    timestamp: "2024-01-19T15:45:00Z",
    isRead: false,
    link: "/admin/banner-programs/456",
  },
  {
    id: "3",
    title: "Event Reminder",
    message: "Upcoming event: Community Outreach Program tomorrow at 9 AM.",
    type: "info",
    timestamp: "2024-01-19T08:00:00Z",
    isRead: true,
    link: "/admin/events/789",
  },
  {
    id: "4",
    title: "Report Generated",
    message: "Monthly activity report has been generated successfully.",
    type: "success",
    timestamp: "2024-01-18T16:20:00Z",
    isRead: true,
    link: "/admin/reports/abc",
  },
  {
    id: "5",
    title: "System Update",
    message: "The system will undergo maintenance on Sunday, 2 AM.",
    type: "warning",
    timestamp: "2024-01-18T11:00:00Z",
    isRead: true,
  },
];
