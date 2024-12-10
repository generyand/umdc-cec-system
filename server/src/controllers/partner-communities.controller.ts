import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Get all partner communities
export const getAllCommunities: RequestHandler = async (req, res) => {
  try {
    console.log("📃 Fetching all partner communities...");
    const communities = await prisma.partnerCommunity.findMany({
      select: {
        id: true,
        name: true,
        communityType: true,
        address: true,
        status: true,
        _count: {
          select: {
            activities: {
              where: {
                status: {
                  in: ["UPCOMING", "ONGOING", "COMPLETED"],
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the response
    const transformedCommunities = communities.map((community) => ({
      id: community.id,
      name: community.name,
      communityType: community.communityType,
      address: community.address,
      status: community.status,
      activitiesCount: community._count.activities,
    }));

    console.log(
      `✅ Successfully fetched ${transformedCommunities.length} communities`
    );
    res.status(200).json({
      success: true,
      message: "Communities fetched successfully",
      data: transformedCommunities,
    });
  } catch (error) {
    console.error("❌ Error fetching communities:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch communities");
  }
};

// Get single partner community
export const getCommunityById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📃 Fetching community with ID: ${id}`);

    const community = await prisma.partnerCommunity.findUnique({
      where: { id: parseInt(id) },
      include: {
        activities: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            targetDate: true,
          },
          orderBy: {
            targetDate: "asc",
          },
        },
      },
    });

    if (!community) {
      console.log(`❌ Community with ID ${id} not found`);
      throw new ApiError(404, "Community not found");
    }

    // Transform the response to match the expected format
    const transformedCommunity = {
      id: community.id,
      name: community.name,
      communityType: community.communityType,
      address: community.address,
      adoptionStart: community.adoptionStart,
      adoptionEnd: community.adoptionEnd,
      status: community.status,
      contactPerson: community.contactPerson,
      contactEmail: community.contactEmail,
      contactNumber: community.contactNumber,
      description: community.description,
      islandGroup: community.islandGroup,
      region: community.region,
      province: community.province,
      city: community.city,
      postalCode: community.postalCode,
      coordinates: community.coordinates,
      elevationLevel: community.elevationLevel,
      population: community.population,
      povertyPopulation: community.povertyPopulation,
      history: community.history,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
      activities: community.activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        status: activity.status,
        targetDate: activity.targetDate,
      })),
    };

    console.log(`✅ Successfully fetched community: ${community.name}`);
    res.status(200).json({
      success: true,
      message: "Community fetched successfully",
      data: transformedCommunity,
    });
  } catch (error) {
    console.error("❌ Error fetching community:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch community");
  }
};

// Create new partner community
export const createCommunity: RequestHandler = async (req, res) => {
  try {
    console.log("��� Creating new community...");
    console.log("🔍 Processing community data:", req.body);

    const newCommunity = await prisma.partnerCommunity.create({
      data: {
        ...req.body,
        status: "ACTIVE",
      },
    });

    console.log(`✅ Successfully created community: ${newCommunity.name}`);
    res.status(201).json({
      success: true,
      message: "Community created successfully",
      data: newCommunity,
    });
  } catch (error) {
    console.error("❌ Error creating community:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to create community");
  }
};

// Update partner community
export const updateCommunity: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating community with ID: ${id}`);

    const updatedCommunity = await prisma.partnerCommunity.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    console.log(`✅ Successfully updated community: ${updatedCommunity.name}`);
    res.status(200).json({
      success: true,
      message: "Community updated successfully",
      data: updatedCommunity,
    });
  } catch (error) {
    console.error("❌ Error updating community:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update community");
  }
};

// Delete partner community
export const deleteCommunity: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting community with ID: ${id}`);

    await prisma.partnerCommunity.delete({
      where: { id: parseInt(id) },
    });

    console.log(`✅ Successfully deleted community with ID: ${id}`);
    res.status(200).json({
      success: true,
      message: "Community deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting community:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete community");
  }
};

// Update community status
export const updateCommunityStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📝 Updating community ${id} status to ${status}...`);

    // Validate status
    const validStatuses = ["ACTIVE", "INACTIVE"] as const;
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status value. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const updatedCommunity = await prisma.partnerCommunity.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    console.log(`✅ Successfully updated community status to ${status}`);
    res.status(200).json({
      success: true,
      message: "Community status updated successfully",
      data: updatedCommunity,
    });
  } catch (error) {
    console.error("❌ Error updating community status:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update community status");
  }
};
