export interface AcademicProgram {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  totalStudents: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface BannerProgram {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  yearStarted: number;
}

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  targetDate: string;
  status: string;
  partnerCommunity: {
    name: string;
  };
  bannerProgram: {
    name: string;
    abbreviation: string;
  } | null;
}

export interface Department {
  department: {
    id: number | string;
    name: string;
    abbreviation: string;
    description: string | undefined;
    totalStudents: number;
  };
  academicPrograms: {
    active: AcademicProgram[];
    inactive: AcademicProgram[];
  };
  bannerPrograms: BannerProgram[];
  activities: Activity[];
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
