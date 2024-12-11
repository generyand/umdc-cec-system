import api from "@/lib/api";
import { UserPosition } from "@/types/user.types";

enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: number | null;
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

export const updateUser = async (data: User) => {
  const response = await api.put("/api/users", data);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};
