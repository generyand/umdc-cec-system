import api from "@/lib/api";

export const formOptionsApi = {
  getCreateNewProposalFormOptions: async () => {
    const response = await api.get(
      "/api/form-options/get-create-new-proposal-form-options"
    );
    return response.data;
  },
};
