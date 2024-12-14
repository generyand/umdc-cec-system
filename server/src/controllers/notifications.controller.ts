import { RequestHandler } from "express";
import { prisma } from "@/lib/prisma.js";
import { ApiError } from "@/utils/errors.js";

type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";

export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, totalCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where: {
          userId,
          status: (status as NotificationStatus) || undefined,
        },
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          status: true,
          priority: true,
          createdAt: true,
          actionUrl: true,
          actionLabel: true,
          proposal: {
            select: {
              title: true,
              status: true,
              currentApprovalStep: true,
            },
          },
          activity: {
            select: {
              title: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.notification.count({
        where: {
          userId,
          status: (status as NotificationStatus) || undefined,
        },
      }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        status: "UNREAD",
      },
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit),
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch notifications");
  }
};

export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationIds } = req.body;

    // Validate input
    if (!Array.isArray(notificationIds)) {
      throw new ApiError(400, "Invalid notification IDs");
    }

    // Update notifications
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId, // Ensure user owns these notifications
      },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to mark notifications as read");
  }
};

export const markAllAsRead: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Mark all user's unread notifications as read
    await prisma.notification.updateMany({
      where: {
        userId,
        status: "UNREAD",
      },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to mark all notifications as read");
  }
};
