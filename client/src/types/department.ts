export interface AcademicProgram {
  code: string;
  name: string;
  students?: number;
  yearStarted: number;
  yearEnded?: number;
  lastGraduates?: number;
}

export interface BannerProgram {
  title: string;
  description: string;
  status: string;
  yearStarted: number;
  targetBeneficiaries: number;
  actualBeneficiaries: number;
}

export interface ImplementedProject {
  title: string;
  date: string;
  targetBeneficiaries: number;
  actualBeneficiaries: number;
  location: string;
  status: string;
}

export interface DepartmentData {
  slug: string;
  name: string;
  description: string;
  academicPrograms: {
    active: AcademicProgram[];
    inactive: AcademicProgram[];
  };
  bannerPrograms: BannerProgram[];
  implementedProjects: ImplementedProject[];
  stats: {
    totalPrograms: number;
    implementedProjects: {
      total: number;
      target: number;
      completed: number;
      ongoing: number;
      totalBeneficiaries: {
        target: number;
        actual: number;
      };
    };
  };
  analyticsData: Array<{ month: string; beneficiaries: number }>;
}
