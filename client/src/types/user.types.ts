export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  //   fullName: string;
  role: "ADMIN" | "FOCAL_PERSON";
  department: string;
  contactNumber?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  contactNumber?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}
