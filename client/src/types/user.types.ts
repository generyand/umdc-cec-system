export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export enum UserPosition {
  CEC_HEAD = "CEC_HEAD",
  CEC_OFFICE_ASSISTANT = "CEC_OFFICE_ASSISTANT",
  CEC_COORDINATOR = "CEC_COORDINATOR",
  VP_DIRECTOR = "VP_DIRECTOR",
  DEAN = "DEAN",
  PROGRAM_HEAD = "PROGRAM_HEAD",
  FOCAL_PERSON = "FOCAL_PERSON",
}

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
  role: UserRole;
  position?: UserPosition;
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
