import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

interface AcademicProgram {
  id: number;
  name: string;
  abbreviation: string;
  status: "ACTIVE" | "INACTIVE";
  bannerProgramsCount: number;
}

interface DepartmentReport {
  id: number;
  code: string;
  name: string;
  academicPrograms: {
    programs: AcademicProgram[];
    active: number;
    inactive: number;
    total: number;
  };
  bannerPrograms: {
    count: number;
  };
  bannerProjects: {
    target: number;
    actual: number;
    completionRate: number;
  };
}

interface ReportTotals {
  academicPrograms: {
    active: number;
    inactive: number;
    total: number;
  };
  bannerPrograms: {
    count: number;
  };
  bannerProjects: {
    target: number;
    actual: number;
  };
}

interface ReportData {
  departments: DepartmentReport[];
  totals: ReportTotals;
  metadata: {
    generatedAt: string;
    reportPeriod: {
      start: string;
      end: string;
    };
  };
}

export const reportsApi = {
  getDepartmentReports: async () => {
    const response = await api.get<ApiResponse<ReportData>>("/api/reports/banner-programs-per-department");

    console.log(response.data);
    return response.data;
  },
};
