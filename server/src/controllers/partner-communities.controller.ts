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
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Successfully fetched ${communities.length} communities`);
    res.status(200).json({
      success: true,
      message: "Communities fetched successfully",
      data: communities,
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
        projectProposals: true,
      },
    });

    if (!community) {
      console.log(`❌ Community with ID ${id} not found`);
      throw new ApiError(404, "Community not found");
    }

    console.log(`✅ Successfully fetched community: ${community.name}`);
    res.status(200).json({
      success: true,
      message: "Community fetched successfully",
      data: community,
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
    console.log("📝 Creating new community...");
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
