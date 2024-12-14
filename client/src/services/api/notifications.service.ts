import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

// Enums for better type safety
export enum NotificationType {
  PROPOSAL_STATUS = "PROPOSAL_STATUS",
  ACTIVITY_REMINDER = "ACTIVITY_REMINDER",
  DEADLINE_ALERT = "DEADLINE_ALERT",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
  ASSIGNMENT = "ASSIGNMENT",
  DOCUMENT_UPDATE = "DOCUMENT_UPDATE",
  FEEDBACK = "FEEDBACK",
  COMMUNITY_UPDATE = "COMMUNITY_UPDATE",
  RESOURCE_ALERT = "RESOURCE_ALERT",
  COMPLIANCE = "COMPLIANCE",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}

export enum NotificationPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  proposal?: {
    title: string;
    status: string;
    currentApprovalStep: string;
  };
  activity?: {
    title: string;
    status: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
  unreadCount: number;
}

export const notificationsApi = {
  getNotifications: async (
    page = 1,
    limit = 10,
    status?: NotificationStatus
  ): Promise<ApiResponse<NotificationsResponse>> => {
    const response = await api.get<ApiResponse<NotificationsResponse>>(
      "/api/notifications",
      {
        params: {
          page,
          limit,
          status,
        },
      }
    );
    return response.data;
  },

  markAsRead: async (notificationIds: string[]): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(
      "/api/notifications/mark-read",
      {
        notificationIds,
      }
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(
      "/api/notifications/mark-all-read"
    );
    return response.data;
  },
};
