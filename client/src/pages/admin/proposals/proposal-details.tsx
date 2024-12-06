import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { projectProposalsService } from "@/services/api/project-proposals.service";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  targetDate: string;
  budget: number;
  bannerProgram: string;
  department: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function ProposalDetailsPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposalDetails();
  }, [id]);

  const fetchProposalDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectProposalsService.getProposalById(
        id as string,
        useAuth.getState().token as string
      );
      if (!response.data.success)
        throw new Error("Failed to fetch proposal details");
      setProposal(response.data.data);
    } catch (error) {
      setError("Failed to load proposal details. Please try again later.");
      console.error("Error fetching proposal details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: "APPROVED" | "REJECTED") => {
    try {
      setIsLoading(true);
      const response = await projectProposalsService.updateProposalStatus(
        id as string,
        newStatus,
        useAuth.getState().token as string
      );

      if (!response.data.success) {
        throw new Error(`Failed to ${newStatus.toLowerCase()} proposal`);
      }

      await fetchProposalDetails(); // Refresh the details
    } catch (error) {
      setError(
        `Failed to ${newStatus.toLowerCase()} proposal. Please try again later.`
      );
      console.error("Error updating proposal status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Proposal["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin/proposals")}
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Proposals
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        proposal && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {proposal.title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted by {proposal.user.firstName}{" "}
                      {proposal.user.lastName}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${getStatusBadgeVariant(proposal.status)}`}
                  >
                    {proposal.status.charAt(0).toUpperCase() +
                      proposal.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-2 font-semibold">Department</h3>
                    <p>{proposal.department.name}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Banner Program</h3>
                    <p>{proposal.bannerProgram}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Target Date</h3>
                    <p>
                      {new Date(proposal.targetDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Budget</h3>
                    <p>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(proposal.budget)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <p className="whitespace-pre-wrap">{proposal.description}</p>
                </div>

                {proposal.status === "PENDING" && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate("APPROVED")}
                    >
                      Approve Proposal
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate("REJECTED")}
                    >
                      Reject Proposal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
