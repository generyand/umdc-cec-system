import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Create a new activity
export const createActivity: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { proposalId } = req.body;

    // Get current school year
    const currentSchoolYear = await prisma.schoolYear.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (!currentSchoolYear) {
      throw new ApiError(400, "No active school year found");
    }

    // Fetch the proposal details
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: proposalId },
      select: {
        id: true,
        title: true,
        description: true,
        targetDate: true,
        departmentId: true,
        communityId: true,
        bannerProgramId: true,
        attachments: {
          select: {
            id: true,
          },
          take: 1, // Fetch only the first attachment
        },
      },
    });

    if (!proposal) {
      throw new ApiError(404, "Proposal not found");
    }

    // Prepare data for new activity
    const activityData: any = {
      title: proposal.title,
      description: proposal.description,
      targetDate: proposal.targetDate,
      status: "UPCOMING", // Default status
      department: { connect: { id: proposal.departmentId } },
      proposal: { connect: { id: proposal.id } },
      // Add school year connection
      schoolYear: { connect: { id: currentSchoolYear.id } },
    };

    // Conditionally add optional fields
    if (proposal.communityId !== null) {
      activityData.partnerCommunity = { connect: { id: proposal.communityId } };
    }

    if (proposal.bannerProgramId !== null) {
      activityData.bannerProgram = {
        connect: { id: proposal.bannerProgramId },
      };
    }

    // Create the new activity
    const newActivity = await prisma.activity.create({
      data: activityData,
      include: {
        schoolYear: true, // Include school year in the response
      },
    });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: newActivity,
    });
  } catch (error) {
    console.error("❌ Error creating activity:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to create activity");
  }
};

// Get all activities
export const getAllActivitiesForCalendar: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const activities = await prisma.activity.findMany();
    res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data: activities,
    });
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    throw new ApiError(500, "Failed to fetch activities");
  }
};

export const getAllActivitiesForAdmin: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          targetDate: true,
          status: true,
          createdAt: true,
          department: {
            select: {
              name: true,
              abbreviation: true,
            },
          },
          partnerCommunity: {
            select: {
              name: true,
            },
          },
          bannerProgram: {
            select: {
              abbreviation: true,
            },
          },
        },
        orderBy: {
          targetDate: "desc",
        },
      }),
      prisma.activity.count(), // Get total count for pagination
    ]);

    res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data: activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    throw new ApiError(500, "Failed to fetch activities");
  }
};

// Get a single activity by ID
export const getActivityById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: {
          select: {
            name: true,
            abbreviation: true,
          },
        },
        partnerCommunity: {
          select: {
            name: true,
            communityType: true,
            address: true,
            contactPerson: true,
            contactNumber: true,
            contactEmail: true,
          },
        },
        bannerProgram: {
          select: {
            name: true,
            abbreviation: true,
          },
        },
        proposal: {
          select: {
            title: true,
            description: true,
            targetBeneficiaries: true,
            budget: true,
          },
        },
        documents: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileSize: true,
            fileType: true,
            category: true,
            description: true,
            uploadedAt: true,
          },
        },
      },
    });

    if (!activity) {
      throw new ApiError(404, "Activity not found");
    }

    res.status(200).json({
      success: true,
      message: "Activity fetched successfully",
      data: activity,
    });
  } catch (error) {
    console.error("❌ Error fetching activity:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch activity");
  }
};

// Update an activity
export const updateActivity: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, status } = req.body;

    const updatedActivity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: { title, description, targetDate, status },
    });

    res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    console.error("❌ Error updating activity:", error);
    throw new ApiError(500, "Failed to update activity");
  }
};

export const updateActivityStatus: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id, status } = req.body;
  const updatedActivity = await prisma.activity.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  res.status(200).json({
    success: true,
    message: "Activity status updated successfully",
    data: updatedActivity,
  });
};