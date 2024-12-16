import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, MoreVertical, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { approvalsApi } from "@/services/api/approvals.service";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { UserPosition } from "@/types/user.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ApprovalFlow {
  role: UserPosition;
  status: "PENDING" | "APPROVED" | "RETURNED";
  comment?: string;
  approvedAt?: Date;
  approvedBy: string | null;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  budget: number;
  status: "PENDING" | "APPROVED" | "RETURNED" | "RESUBMITTED";
  currentStep: UserPosition;
  createdAt: Date;
  submittedBy: {
    name: string;
    department: string;
  };
  approvalFlow: ApprovalFlow[];
}

// First, define interfaces for the mutation parameters
interface ApprovalParams {
  proposalId: number;
  comment?: string;
}

interface ReturnParams {
  proposalId: number;
  comment: string;  // Required for returns
}

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["approvals"],
    queryFn: approvalsApi.getProposalsForApproval,
  });

  const proposals = data?.data ?? [];

  // Filter proposals based on search and status
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchQuery === "" ||
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || proposal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedProposals = filteredProposals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const approveProposalMutation = useMutation({
    mutationFn: ({ proposalId, comment }: ApprovalParams) =>
      approvalsApi.approveProposal(proposalId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      toast.success("Proposal approved successfully");
    },
    onError: (error) => {
      toast.error("Failed to approve proposal. Please try again.");
      console.error("Error approving proposal:", error);
    },
  });

  const returnProposalMutation = useMutation({
    mutationFn: ({ proposalId, comment }: ReturnParams) =>
      approvalsApi.returnProposal(proposalId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      toast.success("Proposal returned successfully");
    }, 
    onError: (error) => {
      toast.error("Failed to return proposal. Please try again.");
      console.error("Error returning proposal:", error);
    },
  });

  const handleViewDetails = (id: string) => {
    navigate(`/admin/community-engagement/project-proposals/${id}`);
  };

  // Helper function to get approval status for current user
  const getCurrentUserApprovalStatus = (proposal: Proposal) => {
    if (!user?.position) return "PENDING";

    // Find approval in approvalFlow instead of approvals
    const userApproval = proposal.approvalFlow.find(
      (approval) => approval.role === user.position
    );

    return userApproval?.status || "PENDING";
  };

  console.log("in approvals", user?.position);

  // Helper function for status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getApprovalProgress = (proposal: Proposal) => {
    const totalSteps = proposal.approvalFlow.length;
    const approvedSteps = proposal.approvalFlow.filter(
      (a) => a.status === "APPROVED"
    ).length;

    return {
      progress: `${approvedSteps}/${totalSteps} steps`,
      currentApprover: proposal.currentStep,
    };
  };

  const formatPosition = (position: string) => {
    return position.split("_").join(" ");
  };

  const TableSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[120px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[120px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[80px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[80px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Skeleton className="w-8 h-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container py-6 mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Proposals for Approval
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {(error as Error).message || "Failed to load proposals"}
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Search and Filter Section */}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="Search by title, department, or submitter..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
                <SelectItem value="RESUBMITTED">Resubmitted</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Table Section */}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Current Approver</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.title}
                      </TableCell>
                      <TableCell>{proposal.submittedBy.name}</TableCell>
                      <TableCell>{proposal.submittedBy.department}</TableCell>
                      <TableCell>
                        {format(new Date(proposal.targetDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {proposal.status === "RETURNED" ? (
                            <span className="text-red-600">
                              Returned by {formatPosition(proposal.currentStep)}
                            </span>
                          ) : proposal.status === "PENDING" ? (
                            <span className="text-amber-600">
                              Awaiting {formatPosition(proposal.currentStep)}
                            </span>
                          ) : proposal.status === "APPROVED" ? (
                            <span className="text-green-600">
                              Fully Approved
                            </span>
                          ) : proposal.status === "RESUBMITTED" ? (
                            <span className="text-blue-600">
                              Resubmitted to{" "}
                              {formatPosition(proposal.currentStep)}
                            </span>
                          ) : null}
                          <div className="text-xs text-muted-foreground">
                            {getApprovalProgress(proposal).progress}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 w-8 h-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewDetails(proposal.id.toString())
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            {getCurrentUserApprovalStatus(proposal) ===
                              "PENDING" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-green-600 focus:text-green-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      Approve
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Approve Proposal
                                      </DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to approve this
                                        proposal? You can add an optional
                                        comment below.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Textarea
                                        placeholder="Add a comment (optional)"
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setComment("");
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                          approveProposalMutation.mutate({
                                            proposalId: Number(proposal.id),
                                            comment: comment.trim() || undefined
                                          });
                                          setComment("");
                                        }}
                                        disabled={approveProposalMutation.isPending}
                                      >
                                        {approveProposalMutation.isPending
                                          ? "Approving..."
                                          : "Approve"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      Return
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Return Proposal</DialogTitle>
                                      <DialogDescription>
                                        Please provide a reason for returning
                                        this proposal. This will be visible to
                                        the proposal owner.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Textarea
                                        placeholder="Enter reason for returning"
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setComment("");
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          returnProposalMutation.mutate({
                                            proposalId: Number(proposal.id),
                                            comment: comment.trim()
                                          });
                                          setComment("");
                                        }}
                                        disabled={
                                          returnProposalMutation.isPending ||
                                          !comment.trim()
                                        }
                                      >
                                        {returnProposalMutation.isPending
                                          ? "Returning..."
                                          : "Return"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * itemsPerPage + 1} to{" "}
              {Math.min(page * itemsPerPage, filteredProposals.length)} of{" "}
              {filteredProposals.length} proposals
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  page === Math.ceil(filteredProposals.length / itemsPerPage)
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
