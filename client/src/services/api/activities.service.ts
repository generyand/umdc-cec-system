import api from "@/lib/api";

export const activitiesApi = {
  getActivities: async () => {
    const response = await api.get("/api/activities");
    return response.data;
    },
  
  createActivity: async (proposalId: number) => {
    const response = await api.post("/api/activities", proposalId);
    return response.data;
  },
};
