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

    // Extract the first attachment ID if it exists
    // const proposalFileId = proposal.attachments.length > 0 ? proposal.attachments[0].id : null;

    // Prepare data for new activity
    const activityData: any = {
      title: proposal.title,
      description: proposal.description,
      targetDate: proposal.targetDate,
      status: "UPCOMING", // Default status
      department: { connect: { id: proposal.departmentId } },
      proposal: { connect: { id: proposal.id } },
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
export const getAllActivities: RequestHandler = async (
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

// Get a single activity by ID
export const getActivityById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(id) },
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

// Delete an activity
// export const deleteActivity: RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     await prisma.activity.delete({
//       where: { id: parseInt(id) },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Activity deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Error deleting activity:", error);
//     throw new ApiError(500, "Failed to delete activity");
//   }
// };
