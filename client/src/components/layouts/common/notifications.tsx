import { Bell } from "lucide-react";
import { useState } from "react";
import { mockNotifications } from "@/data/mock/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { UserNotification } from "@/types/notification.types";

export function Notifications() {
  const [notifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            <button className="text-xs text-primary hover:underline focus:outline-none">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex flex-col gap-1 px-4 py-2 hover:bg-gray-100 transition-colors",
                  !notification.isRead && "bg-accent/10"
                )}
              >
                {notification.link ? (
                  <Link to={notification.link} className="flex flex-col gap-1">
                    <NotificationContent notification={notification} />
                  </Link>
                ) : (
                  <NotificationContent notification={notification} />
                )}
              </div>
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

function NotificationContent({
  notification,
}: {
  notification: UserNotification;
}) {
  return (
    <>
      <div className="flex gap-2 justify-between items-center">
        <span className="text-sm font-medium text-gray-800">
          {notification.title}
        </span>
        <span className="text-[10px] text-gray-500">
          {format(new Date(notification.timestamp), "MMM d, h:mm a")}
        </span>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">
        {notification.message}
      </p>
    </>
  );
}
