import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authService } from "@/services/auth.service.js";

// Validation schema for profile updates based on your Prisma schema
const profileUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  department: z.string().optional(),
  contactNumber: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  // Excluding sensitive fields like hashedPassword, resetPasswordToken, etc.
  // Excluding email as it's typically not updated via profile update
});

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const validatedData = profileUpdateSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        contactNumber: validatedData.contactNumber,
        status: validatedData.status,
        department: {
          connect: {
            id: parseInt(validatedData.department || ""), // Assuming department is the ID
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        contactNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
      return;
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [users, departments] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          position: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          contactNumber: true,
          status: true,
        },
      }),
      prisma.department.findMany({
        select: {
          id: true,
          name: true,
          abbreviation: true,
        },
      }),
    ]);

    res.json({ users, departments });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { departmentId, ...userData } = req.body;

    // Convert departmentId 0 to null, otherwise keep the original value
    const userDataWithDepartment = {
      ...userData,
      departmentId: departmentId === 0 ? null : departmentId,
    };

    const user = await authService.register(userDataWithDepartment);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Check if user exists before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
    }

    // Perform the deletion
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });

    return;
  } catch (error) {
    // Handle specific Prisma errors
    if (typeof error === "object" && error !== null && "code" in error) {
      switch (error.code) {
        case "P2025":
          res.status(404).json({
            error: "User not found",
          });
          return;
        case "P2003":
          res.status(400).json({
            error: "Cannot delete user due to existing references",
          });
          return;
        default:
          console.error("Delete user error:", error);
          res.status(500).json({
            error: "Failed to delete user",
          });
          return;
      }
    }

    next(error);
  }
};
