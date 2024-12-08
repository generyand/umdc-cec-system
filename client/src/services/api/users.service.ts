import api from "@/lib/api";

enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

enum UserPosition {
  CEC_HEAD = "CEC_HEAD",
  CEC_OFFICE_ASSISTANT = "CEC_OFFICE_ASSISTANT",
  CEC_COORDINATOR = "CEC_COORDINATOR",
  VP_DIRECTOR = "VP_DIRECTOR",
  DEAN = "DEAN",
  PROGRAM_HEAD = "PROGRAM_HEAD",
  FOCAL_PERSON = "FOCAL_PERSON",
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: number;
  role: UserRole;
  position?: UserPosition;
}

export const getUsers = async () => {
  const response = await api.get("/api/users");
  console.log(response.data);
  return response.data;
};

export const addUser = async (data: User) => {
  const response = await api.post("/api/users", data);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};
