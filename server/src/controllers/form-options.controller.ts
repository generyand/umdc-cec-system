import { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

export const getCreateNewProposalFormOptions: RequestHandler = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Get user with their department and banner program directly
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        bannerProgram: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Get all partner communities
    const partnerCommunities = await prisma.partnerCommunity.findMany({
      select: {
        id: true,
        name: true,
        communityType: true,
        address: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Form options fetched successfully",
      data: {
        userDepartment: {
          id: user.department?.id,
          name: user.department?.name,
          abbreviation: user.department?.abbreviation,
        },
        userBannerProgram: user.bannerProgram || null,
        partnerCommunities: partnerCommunities.map((community) => ({
          id: community.id,
          name: community.name,
          type: community.communityType,
          address: community.address,
          // label: `${community.name} (${community.communityType})`,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching form options:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch form options");
  }
};
