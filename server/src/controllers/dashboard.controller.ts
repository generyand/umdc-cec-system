import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Get quick stats for dashboard
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const [
      bannerProgramCount,
      partnerCommunityCount,
      activeProjectCount,
      upcomingActivityCount
    ] = await Promise.all([
      prisma.bannerProgram.count({
        where: { status: "ACTIVE" }
      }),
      prisma.partnerCommunity.count({
        where: { status: "ACTIVE" }
      }),
      prisma.projectProposal.count({
        where: { status: "APPROVED" }
      }),
      prisma.activity.count({
        where: { status: "UPCOMING" }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        bannerProgramCount,
        partnerCommunityCount,
        activeProjectCount,
        upcomingActivityCount
      }
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    throw new ApiError(500, "Failed to fetch dashboard stats");
  }
};

// Get dashboard overview data
export const getDashboardOverview: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [
      recentActivities,
      announcements,
      departments,
      pendingApprovals
    ] = await Promise.all([
      // Recent Activities (limit to 5)
      prisma.activity.findMany({
        take: 5,
        orderBy: { targetDate: "desc" },
        include: {
          department: {
            select: {
              name: true,
              abbreviation: true
            }
          }
        }
      }),

      // Recent Announcements (limit to 5)
      prisma.announcement.findMany({
        take: 5,
        where: { status: "active" },
        orderBy: { createdAt: "desc" }
      }),

      // Department Overview with activity counts
      prisma.department.findMany({
        select: {
          id: true,
          name: true,
          abbreviation: true,
          _count: {
            select: {
              activities: true,
              projectProposals: true
            }
          }
        }
      }),

      // Pending Approvals for the user
      prisma.projectProposal.findMany({
        where: {
          approvals: {
            some: {
              approverUserId: userId,
              status: "PENDING"
            }
          }
        },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          currentApprovalStep: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentActivities,
        announcements,
        departments,
        pendingApprovals
      }
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard overview:", error);
    throw new ApiError(500, "Failed to fetch dashboard overview");
  }
};
