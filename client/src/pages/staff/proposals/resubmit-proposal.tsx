// pages/common/resubmit-proposal.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewProposalPage from "../../common/create-proposal";
import { useQuery } from "@tanstack/react-query";
import { projectProposalsService } from "@/services/api/project-proposals.service";
import { useAuth } from "../../../hooks/use-auth";

export default function ResubmitProposalPage() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Redirect if no proposalId is provided
  useEffect(() => {
    if (!proposalId) {
      navigate("/staff/proposals");
    }
  }, [proposalId, navigate]);

  // Fetch existing proposal data
  const { data: existingProposal, isLoading } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: () => {
      if (!proposalId) throw new Error("No proposal ID provided");
      if (!token) throw new Error("No authentication token");
      return projectProposalsService.getProposalById(proposalId, token);
    },
    // Disable the query if there's no proposalId or token
    enabled: !!proposalId && !!token,
  });

  if (!proposalId || !token) return null;

  return (
    <NewProposalPage
      mode="resubmit"
      initialData={existingProposal}
      proposalId={proposalId}
    />
  );
}
