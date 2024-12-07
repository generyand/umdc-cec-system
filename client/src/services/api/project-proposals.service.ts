import api from "@/lib/api";

interface CreateProposalData {
  title: string;
  description: string;
  department: string;
  program: string;
  bannerProgram: {
    connect: {
      id: number;
    };
  };
  partnerCommunity: string;
  targetBeneficiaries: string;
  targetArea: string;
  targetDate: Date;
  venue: string;
  budget: string;
  files: File[];
  attachments: FileList;
}

type ProposalStatus = "PENDING" | "APPROVED" | "RETURNED";

export const projectProposalsService = {
  async createProposal(data: CreateProposalData, token: string) {
    console.log("Service received data:", data);

    // Create a regular object for non-file data
    const proposalData = {
      title: data.title,
      description: data.description,
      department: data.department,
      program: data.program,
      bannerProgram: data.bannerProgram,
      partnerCommunity: data.partnerCommunity,
      targetBeneficiaries: data.targetBeneficiaries,
      targetArea: data.targetArea,
      targetDate: data.targetDate,
      venue: data.venue,
      budget: data.budget,
    };

    const formData = new FormData();

    // Add the JSON data as a string
    formData.append("data", JSON.stringify(proposalData));

    // Add files separately
    if (data.files?.length) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("Sending data:", proposalData);

    return await api.post("/api/project-proposals", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getProposals(token: string) {
    return await api.get("/api/project-proposals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getProposalById(id: string, token: string) {
    return await api.get(`/api/project-proposals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProposalStatus(
    id: string,
    status: ProposalStatus,
    token: string
  ) {
    return await api.patch(
      `/api/project-proposals/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getDepartmentPrograms: async () => {
    const response = await api.get(
      "/api/project-proposals/dropdown-options/departments"
    );
    return response.data;
  },
};
