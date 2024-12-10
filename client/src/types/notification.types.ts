export type NotificationType = "info" | "success" | "warning" | "error";

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
}
