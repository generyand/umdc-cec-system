import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Get all announcements
export const getAllAnnouncements: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          priority: true,
          author: true,
          status: true,
          category: true,
          expirationDate: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.announcement.count(),
    ]);

    res.status(200).json({
      success: true,
      message: "Announcements fetched successfully",
      data: announcements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    throw new ApiError(500, "Failed to fetch announcements");
  }
};

// Get single announcement
export const getAnnouncementById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📃 Fetching announcement with ID: ${id}`);

    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        content: true,
        priority: true,
        author: true,
        status: true,
        category: true,
        expirationDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!announcement) {
      console.log(`❌ Announcement with ID ${id} not found`);
      throw new ApiError(404, "Announcement not found");
    }

    res.status(200).json({
      success: true,
      message: "Announcement fetched successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("❌ Error fetching announcement:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch announcement");
  }
};

// Create announcement
export const createAnnouncement: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📝 Creating new announcement with data:", req.body);
    const { title, content, priority, author, category, expirationDate } =
      req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority,
        author,
        status: "active",
        category,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
      },
    });

    console.log("✅ Successfully created announcement:", announcement.title);
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    throw new ApiError(500, "Failed to create announcement");
  }
};

// Update announcement
export const updateAnnouncement: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating announcement ID: ${id} with data:`, req.body);

    const { title, content, priority, status, category, expirationDate } =
      req.body;

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAnnouncement) {
      throw new ApiError(404, "Announcement not found");
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(category && { category }),
        ...(expirationDate && { expirationDate: new Date(expirationDate) }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error("❌ Error updating announcement:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update announcement");
  }
};

// Delete announcement
export const deleteAnnouncement: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete announcement ID: ${id}`);

    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      throw new ApiError(404, "Announcement not found");
    }

    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("❌ Error deleting announcement:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete announcement");
  }
};
