import api from "@/lib/api";
import type { Department } from "@/types/department.types";

export interface CreateDepartmentDTO {
  name: string;
  abbreviation: string;
  description: string;
  numberOfStudents: number;
}

export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const departmentsApi = {
  getAll: async (): Promise<ServiceResponse<Department[]>> => {
    const response = await api.get<ServiceResponse<Department[]>>(
      "/api/departments"
    );
    return response.data;
  },

  create: async (
    createDepartmentDTO: CreateDepartmentDTO
  ): Promise<ServiceResponse<Department>> => {
    const response = await api.post<ServiceResponse<Department>>(
      "/api/departments",
      createDepartmentDTO
    );
    return response.data;
  },

  getById: async (id: string): Promise<ServiceResponse<Department>> => {
    const response = await api.get<ServiceResponse<Department>>(
      `/api/departments/${id}`
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateDepartmentDTO>
  ): Promise<ServiceResponse<Department>> => {
    const response = await api.patch<ServiceResponse<Department>>(
      `/api/departments/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<ServiceResponse<void>> => {
    const response = await api.delete<ServiceResponse<void>>(
      `/api/departments/${id}`
    );
    return response.data;
  },
};
