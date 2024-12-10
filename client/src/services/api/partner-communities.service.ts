import api from "@/lib/api";
import type {
  PartnerCommunity,
  PartnerCommunityDetails,
} from "@/types/partner-community.type";
import type { ApiResponse } from "@/types/api.types";

export const partnerCommunitiesApi = {
  getAllPartnerCommunities: async (): Promise<
    ApiResponse<PartnerCommunity[]>
  > => {
    const response = await api.get<ApiResponse<PartnerCommunity[]>>(
      "/api/partner-communities"
    );
    return response.data;
  },

  getPartnerCommunityById: async (
    id: number
  ): Promise<ApiResponse<PartnerCommunityDetails>> => {
    const response = await api.get<ApiResponse<PartnerCommunityDetails>>(
      `/api/partner-communities/${id}`
    );
    return response.data;
  },
};
