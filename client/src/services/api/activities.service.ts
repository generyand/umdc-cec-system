import api from "@/lib/api";
import { Activity } from "@/types/activity.types";

export const activitiesApi = {
  getActivities: async () => {
    const response = await api.get("/api/activities");

    return response.data;
  },

  getActivitiesForAdmin: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/api/activities/get-all-activities-for-admin`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    console.log(response.data);
    return response.data;
  },

  createActivity: async (proposalId: number) => {
    const response = await api.post("/api/activities", {
      proposalId: Number(proposalId),
    });
    return response.data;
  },

  updateActivityStatus: async (id: number, status: Activity["status"]) => {
    const response = await api.put(`/api/activities/${id}`, { status });
    return response.data;
  },
};
