import api from "@/lib/api";

export const bannerProgramsService = {
  getBannerPrograms: async () => {
    const response = await api.get("/api/banner-programs");
    return response.data;
  },
};
