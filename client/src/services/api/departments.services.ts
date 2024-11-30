import api from "@/lib/api";
import { Department } from "@/types/department.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export const departmentsApi = {
  getAll: async (): Promise<ServiceResponse<Department[]>> => {
    try {
      const response = await api.get<ApiResponse<Department[]>>(
        "api/departments"
      );

      return {
        data: response.data.data,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch departments",
      };
    }
  },
};
