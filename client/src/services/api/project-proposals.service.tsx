import api from "@/lib/api";

interface CreateProposalData {
  title: string;
  description: string;
  department: string;
  program: string;
  bannerProgram: string;
  partnerCommunity: string;
  targetBeneficiaries: string;
  targetArea: string;
  targetDate: Date;
  venue: string;
  budget: string;
  files: File[];
}

export const projectProposalsService = {
  async createProposal(data: CreateProposalData, token: string) {
    console.log("Authorization header being sent:", `Bearer ${token}`);

    const formData = new FormData();

    // Append all the form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === "files") {
        // Handle files separately
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      } else if (key === "targetDate") {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value as string);
      }
    });

    console.log("Submitting proposal with token:", token);

    const response = await api.post("/api/project-proposals", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Explicitly set the auth header
        // Let the browser set the Content-Type header with boundary
      },
    });

    return response.data;
  },
};
