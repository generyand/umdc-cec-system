import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
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

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with actual API call
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectProposalsService.getProposals(
        useAuth.getState().token as string
      );
      if (!response.data.success) throw new Error("Failed to fetch proposals");
      setProposals(response.data.data);
    } catch (error) {
      setError("Failed to load proposals. Please try again later.");
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add search and filter functionality
  useEffect(() => {
    let result = proposals;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proposal.department.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          `${proposal.user.firstName} ${proposal.user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(result);
  }, [searchQuery, statusFilter, proposals]);

  const handleViewDetails = (id: string) => {
    navigate(`/admin/proposals/${id}`);
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      // TODO: Replace with actual API endpoint
      await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error("Error updating proposal status:", error);
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

  return (
    <div className="container py-6 mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Project Proposals
            </CardTitle>
            <Button onClick={() => navigate("/admin/proposals/new")}>
              Create New Proposal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="Search proposals..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 rounded-md border"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Table Section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        No proposals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">
                          {proposal.title}
                        </TableCell>
                        <TableCell>{proposal.department.name}</TableCell>
                        <TableCell>
                          {`${proposal.user.firstName} ${proposal.user.lastName}`}
                        </TableCell>
                        <TableCell>
                          {new Date(proposal.targetDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(proposal.budget)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${getStatusBadgeVariant(proposal.status)}`}
                          >
                            {proposal.status.charAt(0).toUpperCase() +
                              proposal.status.slice(1).toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewDetails(proposal.id.toString())
                              }
                            >
                              View Details
                            </Button>
                            {proposal.status === "PENDING" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      proposal.id.toString(),
                                      "APPROVED"
                                    )
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      proposal.id.toString(),
                                      "REJECTED"
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
