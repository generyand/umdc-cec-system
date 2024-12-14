import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  notificationsApi,
  NotificationStatus,
  type Notification,
} from "@/services/api/notifications.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function Notifications() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await notificationsApi.getNotifications(
        1,
        5,
        NotificationStatus.UNREAD
      );
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications"],
        (oldData: typeof data) =>
          oldData && {
            ...oldData,
            notifications: oldData.notifications.map((n) => ({
              ...n,
              status: NotificationStatus.READ,
            })),
            unreadCount: 0,
          }
      );
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full transition-colors hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-destructive rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="overflow-hidden w-80 bg-white rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <h2 className="font-semibold text-gray-700">Notifications</h2>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs text-primary hover:underline focus:outline-none disabled:opacity-50"
            >
              {markAllAsReadMutation.isPending
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-sm text-center text-gray-500">
              Loading...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="py-8 text-sm text-center text-gray-500">
              No notifications
            </div>
          )}
        </div>
        <div className="p-2 text-center bg-gray-50 border-t">
          <Link
            to="/notifications"
            className="text-xs text-primary hover:underline focus:outline-none"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 px-4 py-2 hover:bg-gray-100 transition-colors",
        notification.status === NotificationStatus.UNREAD && "bg-accent/10"
      )}
    >
      {notification.actionUrl ? (
        <Link to={notification.actionUrl} className="flex flex-col gap-1">
          <NotificationContent notification={notification} />
        </Link>
      ) : (
        <NotificationContent notification={notification} />
      )}
    </div>
  );
}

function NotificationContent({ notification }: { notification: Notification }) {
  return (
    <>
      <div className="flex gap-2 justify-between items-center">
        <span className="text-sm font-medium text-gray-800">
          {notification.title}
        </span>
        <span className="text-[10px] text-gray-500">
          {format(new Date(notification.createdAt), "MMM d, h:mm a")}
        </span>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">
        {notification.content}
      </p>
      {notification.actionLabel && (
        <span className="mt-1 text-xs text-primary">
          {notification.actionLabel} →
        </span>
      )}
    </>
  );
}
