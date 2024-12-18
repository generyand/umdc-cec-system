import api from "@/lib/api";

export const dashboardApi = {
  getDashboardStats: async () => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  },

  getDashboardOverview: async () => {
    const response = await api.get("/api/dashboard/overview");
    return response.data;
  },
};
