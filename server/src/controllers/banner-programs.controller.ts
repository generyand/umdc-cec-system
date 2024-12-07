import { Request, Response } from "express";
import { prisma } from "@/lib/prisma.js";

export const bannerProgramsController = {
  // Get all banner programs
  getBannerPrograms: async (req: Request, res: Response): Promise<void> => {
    try {
      const bannerPrograms = await prisma.bannerProgram.findMany({
        include: {
          department: true,
          _count: {
            select: {
              projectProposals: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      res.status(200).json({
        success: true,
        message: "Banner programs retrieved successfully",
        data: bannerPrograms,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve banner programs",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  // Get a specific banner program by ID
  getBannerProgramById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bannerProgram = await prisma.bannerProgram.findUnique({
        where: { id: Number(id) },
        include: {
          department: true,
          academicPrograms: true,
          projectProposals: true,
        },
      });

      if (!bannerProgram) {
        res.status(404).json({
          success: false,
          message: "Banner program not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Banner program retrieved successfully",
        data: bannerProgram,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve banner program",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  // Create a new banner program
  createBannerProgram: async (req: Request, res: Response): Promise<void> => {
    try {
      const bannerProgram = await prisma.bannerProgram.create({
        data: {
          ...req.body,
          departmentId: Number(req.body.departmentId),
        },
        include: {
          department: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Banner program created successfully",
        data: bannerProgram,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create banner program",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  // Update a banner program
  updateBannerProgram: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bannerProgram = await prisma.bannerProgram.update({
        where: { id: Number(id) },
        data: {
          ...req.body,
          departmentId: Number(req.body.departmentId),
        },
        include: {
          department: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Banner program updated successfully",
        data: bannerProgram,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update banner program",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  // Delete/Archive a banner program
  deleteBannerProgram: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await prisma.bannerProgram.update({
        where: { id: Number(id) },
        data: { status: "INACTIVE" },
      });

      res.status(200).json({
        success: true,
        message: "Banner program archived successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to archive banner program",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
};
