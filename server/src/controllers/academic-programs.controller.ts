import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { Prisma } from "@prisma/client";

// Get all academic programs
export const getAllAcademicPrograms: RequestHandler = async (req, res) => {
  try {
    console.log("📃 Fetching all academic programs...");
    const programs = await prisma.academicProgram.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
      },
    });
    console.log(`✅ Successfully fetched ${programs.length} academic programs`);

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("❌ Error fetching academic programs:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch academic programs");
  }
};

// Get single academic program
export const getAcademicProgramById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📃 Fetching academic program with ID: ${id}`);

    const programId = parseInt(id, 10);
    const program = await prisma.academicProgram.findUnique({
      where: { id: programId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
      },
    });

    if (!program) {
      console.log(`❌ Academic program with ID ${id} not found`);
      throw new ApiError(404, "Academic program not found");
    }

    console.log(`✅ Successfully fetched academic program: ${program.name}`);
    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("❌ Error fetching academic program:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch academic program");
  }
};

// Create academic program
export const createAcademicProgram: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📝 Creating new academic program with data:", req.body);
    const {
      name,
      abbreviation,
      description,
      totalStudents,
      status,
      departmentId,
    } = req.body;

    // Check existing
    console.log("🔍 Checking for existing academic program...");
    const existingProgram = await prisma.academicProgram.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { abbreviation: { equals: abbreviation, mode: "insensitive" } },
        ],
      },
    });

    if (existingProgram) {
      console.log("❌ Academic program already exists:", {
        name,
        abbreviation,
      });
      throw new ApiError(
        400,
        "Academic program with this name or abbreviation already exists"
      );
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const program = await prisma.academicProgram.create({
      data: {
        name,
        abbreviation,
        description,
        totalStudents: totalStudents || 0,
        status: status || "ACTIVE",
        departmentId,
      },
    });

    console.log("✅ Successfully created academic program:", program.name);
    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("❌ Error creating academic program:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "An academic program with this name already exists",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create academic program",
    });
  }
};

// Update academic program
export const updateAcademicProgram: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating academic program ID: ${id} with data:`, req.body);

    const programId = parseInt(id, 10);
    if (isNaN(programId)) {
      console.log("❌ Invalid academic program ID:", id);
      throw new ApiError(400, "Invalid academic program ID");
    }

    const { name, description, totalStudents, status, departmentId } = req.body;

    console.log("🔍 Checking if academic program exists...");
    const existingProgram = await prisma.academicProgram.findUnique({
      where: { id: programId },
    });

    if (!existingProgram) {
      console.log(`❌ Academic program with ID ${id} not found`);
      throw new ApiError(404, "Academic program not found");
    }

    // Check name conflicts
    if (name) {
      console.log("🔍 Checking for naming conflicts...");
      const conflictingProgram = await prisma.academicProgram.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          NOT: { id: programId },
        },
      });

      if (conflictingProgram) {
        console.log("❌ Naming conflict found:", { name });
        throw new ApiError(
          400,
          "Academic program with this name already exists"
        );
      }
    }

    // Verify department exists if departmentId is provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        throw new ApiError(404, "Department not found");
      }
    }

    const updatedProgram = await prisma.academicProgram.update({
      where: { id: programId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(totalStudents !== undefined && { totalStudents }),
        ...(status && { status }),
        ...(departmentId && { departmentId }),
      },
    });

    console.log(
      "✅ Successfully updated academic program:",
      updatedProgram.name
    );
    res.status(200).json({
      success: true,
      data: updatedProgram,
    });
  } catch (error) {
    console.error("❌ Error updating academic program:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "Academic program with this name already exists",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to update academic program",
    });
  }
};

// Delete academic program
export const deleteAcademicProgram: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete academic program ID: ${id}`);

    const programId = parseInt(id, 10);
    const program = await prisma.academicProgram.findUnique({
      where: { id: programId },
    });

    if (!program) {
      console.log(`❌ Academic program with ID ${id} not found`);
      throw new ApiError(404, "Academic program not found");
    }

    await prisma.academicProgram.delete({
      where: { id: programId },
    });

    console.log("✅ Successfully deleted academic program");
    res.status(200).json({
      success: true,
      message: "Academic program deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting academic program:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete academic program");
  }
};
