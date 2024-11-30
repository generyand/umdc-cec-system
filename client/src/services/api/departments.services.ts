import api from "@/lib/api";
import { Department } from "@/types/department.types";

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await api.get<Department[]>("/api/departments");
      //   console.log("API Response:", data); // Debug log

      console.log("API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },
};
