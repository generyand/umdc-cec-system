import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { Prisma } from "@prisma/client";

// Get all departments
export const getAllDepartments: RequestHandler = async (req, res) => {
  try {
    console.log("📃 Fetching all departments...");
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            contactNumber: true,
          },
        },
        academicPrograms: {
          select: {
            id: true,
            name: true,
            description: true,
            totalStudents: true,
            status: true,
          },
        },
      },
    });
    console.log(`✅ Successfully fetched ${departments.length} departments`);

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch departments");
  }
};

// Get single department
export const getDepartmentById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📃 Fetching department with ID: ${id}`);

    const departmentId = parseInt(id, 10);
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            contactNumber: true,
          },
        },
        academicPrograms: {
          select: {
            id: true,
            name: true,
            description: true,
            totalStudents: true,
            status: true,
          },
        },
      },
    });

    if (!department) {
      console.log(`❌ Department with ID ${id} not found`);
      throw new ApiError(404, "Department not found");
    }

    console.log(`✅ Successfully fetched department: ${department.name}`);
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("❌ Error fetching department:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch department");
  }
};

// Create department
export const createDepartment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📝 Creating new department with data:", req.body);
    const { name, abbreviation, description, totalStudents, status } = req.body;

    // Check existing
    console.log("🔍 Checking for existing department...");
    const existingDepartment = await prisma.department.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { abbreviation: { equals: abbreviation, mode: "insensitive" } },
        ],
      },
    });

    if (existingDepartment) {
      console.log("❌ Department already exists:", { name, abbreviation });
      throw new ApiError(
        400,
        "Department with this name or abbreviation already exists"
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        abbreviation,
        description,
        totalStudents: totalStudents || 0,
        status: status || "ACTIVE",
      },
    });

    console.log("✅ Successfully created department:", department.name);
    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("❌ Error creating department:", error);
    // If it's our custom ApiError, use its status code and message
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });

      return;
    }

    // For Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "A department with this name or abbreviation already exists",
        });
      }

      return;
    }

    // For standard Error objects
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });

      return;
    }

    // For unknown errors
    res.status(500).json({
      success: false,
      message: "Failed to create department",
    });

    return;
  }
};

// Update department
export const updateDepartment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating department ID: ${id} with data:`, req.body);

    const departmentId = parseInt(id, 10);
    if (isNaN(departmentId)) {
      console.log("❌ Invalid department ID:", id);
      throw new ApiError(400, "Invalid department ID");
    }

    const { name, abbreviation, description, totalStudents, status } = req.body;

    console.log("🔍 Checking if department exists...");
    const existingDepartment = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!existingDepartment) {
      console.log(`❌ Department with ID ${id} not found`);
      throw new ApiError(404, "Department not found");
    }

    // Check conflicts
    if (name || abbreviation) {
      console.log("🔍 Checking for naming conflicts...");
      const conflictingDepartment = await prisma.department.findFirst({
        where: {
          OR: [
            name ? { name: { equals: name, mode: "insensitive" } } : {},
            abbreviation
              ? { abbreviation: { equals: abbreviation, mode: "insensitive" } }
              : {},
          ],
          NOT: { id: departmentId },
        },
      });

      if (conflictingDepartment) {
        console.log("❌ Naming conflict found:", { name, abbreviation });
        throw new ApiError(
          400,
          "Department with this name or abbreviation already exists"
        );
      }
    }

    const updatedDepartment = await prisma.department.update({
      where: { id: departmentId },
      data: {
        ...(name && { name }),
        ...(abbreviation && { abbreviation }),
        ...(description !== undefined && { description }),
        ...(totalStudents !== undefined && { totalStudents }),
        ...(status && { status }),
      },
    });

    console.log("✅ Successfully updated department:", updatedDepartment.name);
    res.status(200).json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("❌ Error updating department:", error);
    // If it's our custom ApiError, use its status code and message
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // For Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "Department with this name or abbreviation already exists",
        });
        return;
      }
    }

    // For standard Error objects
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // For unknown errors
    res.status(500).json({
      success: false,
      message: "Failed to update department",
    });
    return;
  }
};

// Delete department
export const deleteDepartment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Attempting to delete department ID: ${id}`);

    const departmentId = parseInt(id, 10);
    console.log("🔍 Checking department and user count...");
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!department) {
      console.log(`❌ Department with ID ${id} not found`);
      throw new ApiError(404, "Department not found");
    }

    if (department._count.users > 0) {
      console.log(
        `❌ Department has ${department._count.users} users, cannot delete`
      );
      throw new ApiError(400, "Cannot delete department with existing users");
    }

    await prisma.department.delete({
      where: { id: departmentId },
    });

    console.log("✅ Successfully deleted department");
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting department:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete department");
  }
};
