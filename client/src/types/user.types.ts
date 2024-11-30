export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  department?: {
    id: number;
    name: string;
    abbreviation: string;
  };
  contactNumber?: string;
  role: string;
  //   fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  contactNumber?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}
