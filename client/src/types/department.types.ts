export interface AcademicProgram {
  id: string;
  name: string;
  description: string;
  totalStudents: number;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  academicPrograms: AcademicProgram[];
}

export interface FormattedDepartment {
  id: string;
  name: string;
  slug: string; // Generated from department name
  students: number;
  programs: number;
  description: string;
  icon: React.ReactNode;
}
