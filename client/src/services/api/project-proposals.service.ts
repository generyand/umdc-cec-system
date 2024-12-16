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

interface ResubmitProposalData {
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
  files?: File[];
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
    const response = await api.get(`/api/project-proposals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response: " + response.data.data.currentApprovalStep);

    return response;
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

  getProposalsByUser: async (userId: string, token: string) => {
    return await api.get(`/api/project-proposals/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  resubmitProposal: async (id: string, data: ResubmitProposalData, token: string) => {
    console.log("Service Input Data:", data);

    try {
      const formData = new FormData();
      
      // Add files directly to FormData, not nested in data
      if (data.files) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // Remove files from the data object before sending
      const { files, ...dataWithoutFiles } = data;
      
      // Add the rest of the data
      formData.append('data', JSON.stringify(dataWithoutFiles));

      const response = await api.put(
        `/api/project-proposals/${id}/resubmit`, 
        formData,  // Send formData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("FormData:", formData);
      
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};