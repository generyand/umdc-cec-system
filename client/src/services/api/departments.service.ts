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

    // console.log(response.data);
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

  getById: async (
    id: number | string
  ): Promise<ServiceResponse<Department>> => {
    try {
      // console.log("Fetching department with ID:", id);
      // console.log("Request URL:", `/api/departments/${id}`);

      const response = await api.get<ServiceResponse<Department>>(
        `/api/departments/${id}`
      );

      console.log("Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching department:", error);
      return {
        success: false,
        data: null as unknown as Department,
        message:
          error instanceof Error ? error.message : "Failed to fetch department",
      };
    }
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
