import api from "@/lib/api";

export const bannerProgramsApi = {
  getBannerPrograms: async () => {
    const response = await api.get("/api/banner-programs");
    return response.data;
  },

  getBannerProgramById: async (id: number) => {
    const response = await api.get(`/api/banner-programs/${id}`);

    
    return response.data;
  },
};
