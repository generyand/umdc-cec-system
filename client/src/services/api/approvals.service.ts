import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

interface ApprovalStep {
  role: string;
  status: "PENDING" | "APPROVED" | "RETURNED";
  comment: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
}

interface ProposalForApproval {
  id: number;
  title: string;
  status: "PENDING" | "APPROVED" | "RETURNED";
  currentStep: string;
  approvalFlow: ApprovalStep[];
}

export const approvalsApi = {
  getProposalsForApproval: async () => {
    const response = await api.get("/api/approvals");
    console.log(response.data);
    return response.data;
  },

  getApprovalById: async (id: number) => {
    const response = await api.get<ApiResponse<ProposalForApproval>>(
      `/api/approvals/${id}`
    );
    return response.data;
  },

  approveProposal: async (proposalId: number, comment?: string) => {
    const response = await api.post<ApiResponse<ProposalForApproval>>(
      `/api/approvals/${proposalId}/approve`,
      { comment }
    );
    return response.data;
  },

  returnProposal: async (proposalId: number, comment: string) => {
    const response = await api.post<ApiResponse<ProposalForApproval>>(
      `/api/approvals/${proposalId}/return`,
      { comment }
    );
    return response.data;
  },

  // Get approval history for a proposal
  getApprovalHistory: async (proposalId: number) => {
    const response = await api.get<ApiResponse<ApprovalStep[]>>(
      `/api/approvals/${proposalId}/history`
    );
    return response.data;
  },

  // Get all approvals for current user
  getCurrentUserApprovals: async () => {
    const response = await api.get<ApiResponse<ProposalForApproval[]>>(
      "/api/approvals/my-approvals"
    );
    return response.data;
  },
};
