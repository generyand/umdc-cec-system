export interface AcademicProgram {
  id: number;
  name: string;
  description: string | null;
  totalStudents: number;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  slug?: string;
  status: string;
  totalStudents: number;
  totalPrograms: number;
  academicPrograms: AcademicProgram[];
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
