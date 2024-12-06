export interface AcademicProgramType {
  id: number;
  code: string;
  name: string;
  departmentId: number;
}

export const AcademicProgram: AcademicProgramType[] = [
  // Department of Technical Programs (DTP) - ID: 1
  {
    id: 1,
    code: "bsit",
    name: "Bachelor of Science in Information Technology",
    departmentId: 1,
  },
  {
    id: 2,
    code: "bscpe",
    name: "Bachelor of Science in Computer Engineering",
    departmentId: 1,
  },
  // Add other programs here...
];

export interface Department {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  slug?: string;
  status: string;
  totalStudents: number;
  totalPrograms: number;
  academicPrograms: AcademicProgramType[];
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
