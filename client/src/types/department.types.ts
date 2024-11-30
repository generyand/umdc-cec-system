export interface AcademicProgram {
  code: string;
  name: string;
  students?: number;
  yearStarted: number;
  yearEnded?: number;
  lastGraduates?: number;
}

export interface AcademicProgram {
  id: string;
  name: string;
  totalStudents: number;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string; // This will be used as slug
  description: string;
  academicPrograms: AcademicProgram[];
  // data: DepartmentData;
}

// Interface for the formatted department data used in the UI
export interface FormattedDepartment {
  name: string;
  slug: string;
  students: number;
  programs: number;
  description: string;
  icon: React.ReactNode;
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
