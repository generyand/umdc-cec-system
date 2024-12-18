import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Get department reports
export const getDepartmentReports: RequestHandler = async (req, res) => {
  try {
    console.log("📊 Generating department reports...");

    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        abbreviation: true,
        academicPrograms: {
          select: {
            id: true,
            status: true,
          },
        },
        bannerPrograms: {
          select: {
            id: true,
            activities: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    const departmentReports = departments.map((dept) => ({
      id: dept.id,
      code: dept.abbreviation,
      name: dept.name,
      academicPrograms: {
        active: dept.academicPrograms.filter((p) => p.status === "ACTIVE").length,
        inactive: dept.academicPrograms.filter((p) => p.status === "INACTIVE").length,
        total: dept.academicPrograms.length,
      },
      bannerPrograms: {
        count: dept.bannerPrograms.length,
      },
      bannerProjects: {
        target: dept.bannerPrograms.reduce(
          (sum, program) => sum + program.activities.length,
          0
        ),
        actual: dept.bannerPrograms.reduce(
          (sum, program) =>
            sum + program.activities.filter((a) => a.status === "COMPLETED").length,
          0
        ),
        completionRate: calculateCompletionRate(
          dept.bannerPrograms.reduce(
            (sum, program) => sum + program.activities.length,
            0
          ),
          dept.bannerPrograms.reduce(
            (sum, program) =>
              sum + program.activities.filter((a) => a.status === "COMPLETED").length,
            0
          )
        ),
      },
    }));

    // Calculate totals
    const totals = {
      academicPrograms: {
        active: departmentReports.reduce((sum, dept) => sum + dept.academicPrograms.active, 0),
        inactive: departmentReports.reduce((sum, dept) => sum + dept.academicPrograms.inactive, 0),
        total: departmentReports.reduce((sum, dept) => sum + dept.academicPrograms.total, 0),
      },
      bannerPrograms: {
        count: departmentReports.reduce((sum, dept) => sum + dept.bannerPrograms.count, 0),
      },
      bannerProjects: {
        target: departmentReports.reduce((sum, dept) => sum + dept.bannerProjects.target, 0),
        actual: departmentReports.reduce((sum, dept) => sum + dept.bannerProjects.actual, 0),
      },
    };

    const reportSummary = {
      departments: departmentReports,
      totals,
      metadata: {
        generatedAt: new Date().toISOString(),
        reportPeriod: {
          start: await getReportPeriodStart(),
          end: new Date().toISOString(),
        },
      },
    };

    console.log("✅ Successfully generated department reports");
    res.status(200).json({
      success: true,
      message: "Department reports generated successfully",
      data: reportSummary,
    });
  } catch (error) {
    console.error("❌ Error generating department reports:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to generate department reports");
  }
};

// Helper function to calculate completion rate
function calculateCompletionRate(target: number, actual: number): number {
  if (target === 0) return 0;
  return Number(((actual / target) * 100).toFixed(2));
}

// Helper function to get report period start
async function getReportPeriodStart(): Promise<string> {
  const earliestActivity = await prisma.activity.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      createdAt: true,
    },
  });

  return earliestActivity?.createdAt.toISOString() || new Date().toISOString();
}
