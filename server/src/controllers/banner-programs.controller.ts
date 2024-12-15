import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getBannerPrograms(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const [bannerPrograms, departments] = await Promise.all([
      prisma.bannerProgram.findMany({
        select: {
          id: true,
          name: true,
          abbreviation: true,
          description: true,
          status: true,
          department: {
            select: {
              name: true,
            },
          },
          activities: {
            select: {
              status: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      }),
      prisma.department.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    const transformedBannerPrograms = bannerPrograms.map((program) => ({
      id: program.id,
      name: program.name,
      abbreviation: program.abbreviation,
      description: program.description,
      status: program.status,
      department: program.department,
      activeProjects: program.activities.filter(
        (activity) =>
          activity.status === "UPCOMING" || activity.status === "ONGOING"
      ).length,
      completedProjects: program.activities.filter(
        (activity) => activity.status === "COMPLETED"
      ).length,
    }));

    res.status(200).json({
      success: true,
      message: "Banner programs retrieved successfully",
      data: {
        bannerPrograms: transformedBannerPrograms,
        departments: departments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve banner programs",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export async function getBannerProgramById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const bannerProgram = await prisma.bannerProgram.findUnique({
      where: { id: Number(id) },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        academicPrograms: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            totalStudents: true,
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            description: true,
            targetDate: true,
            status: true,
            partnerCommunity: {
              select: {
                name: true,
                communityType: true,
                address: true,
              },
            },
          },
          orderBy: {
            targetDate: 'desc',
          },
        },
      },
    });

    if (!bannerProgram) {
      res.status(404).json({
        success: false,
        message: "Banner program not found",
      });
      return;
    }

    // Calculate some statistics
    const stats = {
      activeActivities: bannerProgram.activities.filter(
        a => a.status === 'UPCOMING' || a.status === 'ONGOING'
      ).length,
      completedActivities: bannerProgram.activities.filter(
        a => a.status === 'COMPLETED'
      ).length,
      totalAcademicPrograms: bannerProgram.academicPrograms.length,
    };

    res.status(200).json({
      success: true,
      message: "Banner program retrieved successfully",
      data: {
        ...bannerProgram,
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve banner program",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export async function createBannerProgram(
  req: Request,
  res: Response
): Promise<void> {
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
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export async function updateBannerProgram(
  req: Request,
  res: Response
): Promise<void> {
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
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export async function deleteBannerProgram(
  req: Request,
  res: Response
): Promise<void> {
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
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
