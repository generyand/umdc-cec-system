import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// Get current school year
export const getCurrentSchoolYear = async (req: Request, res: Response) => {
  try {
    const currentSchoolYear = await prisma.schoolYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentSchoolYear) {
      res.status(404).json({ message: "No current school year set" });
      return;
    }

    res.json(currentSchoolYear);
  } catch (error) {
    console.error("Error fetching current school year:", error);
    res.status(500).json({ message: "Failed to fetch current school year" });
  }
};

// Get all school years
export const getAllSchoolYears = async (req: Request, res: Response) => {
  try {
    const schoolYears = await prisma.schoolYear.findMany({
      orderBy: { startDate: 'desc' }
    });
    res.json(schoolYears);
  } catch (error) {
    console.error("Error fetching school years:", error);
    res.status(500).json({ message: "Failed to fetch school years" });
  }
};

// Get school year by ID
export const getSchoolYearById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schoolYear = await prisma.schoolYear.findUnique({
      where: { id: parseInt(id) }
    });

    if (!schoolYear) {
      res.status(404).json({ message: "School year not found" });
      return;
    }

    res.json(schoolYear);
  } catch (error) {
    console.error("Error fetching school year:", error);
    res.status(500).json({ message: "Failed to fetch school year" });
  }
};

// Create new school year
export const createSchoolYear = async (req: Request, res: Response) => {
  try {
    const { year, startDate, endDate, isCurrent = false } = req.body;

    // Validate required fields
    if (!year || !startDate || !endDate) {
      res.status(400).json({ 
        message: "Year, start date, and end date are required" 
      });
      return;
    }

    // If this will be the current school year, reset other current flags
    if (isCurrent) {
      await prisma.schoolYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false }
      });
    }

    const newSchoolYear = await prisma.schoolYear.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent,
        status: 'ACTIVE'
      }
    });

    res.status(201).json(newSchoolYear);
  } catch (error) {
    console.error("Error creating school year:", error);
    res.status(500).json({ message: "Failed to create school year" });
  }
};

// Update school year
export const updateSchoolYear = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year, startDate, endDate, isCurrent, status } = req.body;

    // If setting as current, reset other current flags
    if (isCurrent) {
      await prisma.schoolYear.updateMany({
        where: { 
          AND: [
            { isCurrent: true },
            { id: { not: parseInt(id) } }
          ]
        },
        data: { isCurrent: false }
      });
    }

    const updatedSchoolYear = await prisma.schoolYear.update({
      where: { id: parseInt(id) },
      data: {
        year,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isCurrent,
        status,
      }
    });

    res.json(updatedSchoolYear);
  } catch (error) {
    console.error("Error updating school year:", error);
    res.status(500).json({ message: "Failed to update school year" });
  }
};

// Set current school year
export const setCurrentSchoolYear = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      // Verify the school year exists
      const schoolYear = await tx.schoolYear.findUnique({
        where: { id: parseInt(id) }
      });

      if (!schoolYear) {
        throw new Error('School year not found');
      }

      // Reset all current flags
      await tx.schoolYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false }
      });

      // Set new current school year
      await tx.schoolYear.update({
        where: { id: parseInt(id) },
        data: { isCurrent: true }
      });
    });

    const updatedSchoolYear = await prisma.schoolYear.findUnique({
      where: { id: parseInt(id) }
    });

    res.json(updatedSchoolYear);
  } catch (error) {
    console.error("Error setting current school year:", error);
    res.status(500).json({ message: "Failed to set current school year" });
  }
};