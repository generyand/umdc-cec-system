import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Search, MoreHorizontal } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

// import { activitiesApi } from "@/services/api/activities.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "RETURNED";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
    // refetch,
  } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const result = await projectProposalsService.getProposals(
        useAuth.getState().token as string
      );
      if (!result.data.success) throw new Error("Failed to fetch proposals");
      return result.data.data;
    },
  });

  const filteredProposals = useMemo(() => {
    if (!response) return [];

    let result = [...response];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(query) ||
          proposal.department.name.toLowerCase().includes(query) ||
          `${proposal.user.firstName} ${proposal.user.lastName}`
            .toLowerCase()
            .includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((proposal) => proposal.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const compareValue =
        sortBy === "date"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : a.title.localeCompare(b.title);
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    return result;
  }, [response, searchQuery, statusFilter, sortBy, sortOrder]);

  const paginatedProposals = useMemo(() => {
    return filteredProposals.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [filteredProposals, page, itemsPerPage]);

  // const updateStatusMutation = useMutation({
  //   mutationFn: ({
  //     id,
  //     newStatus,
  //   }: {
  //     id: string;
  //     newStatus: "APPROVED" | "RETURNED";
  //   }) =>
  //     projectProposalsService.updateProposalStatus(
  //       id,
  //       newStatus,
  //       useAuth.getState().token as string
  //     ),
  //   onSuccess: (data, variables) => {
  //     refetch();
  //     toast.success("Proposal status updated successfully");

  //     // Call createActivity if the proposal is approved
  //     if (variables.newStatus === "APPROVED") {
  //       createActivityMutation.mutate(Number(variables.id));
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to update proposal status. Please try again.");
  //     console.error("Error updating proposal status:", error);
  //   },
  // });

  // const createActivityMutation = useMutation({
  //   mutationFn: (proposalId: number) =>
  //     activitiesApi.createActivity(proposalId),
  //   onSuccess: () => {
  //     toast.success("Activity created successfully");
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to create activity. Please try again.");
  //     console.error("Error creating activity:", error);
  //   },
  // });

  const handleViewDetails = (id: string) => {
    navigate(`/admin/community-engagement/project-proposals/${id}`);
  };

  const getStatusBadgeVariant = (status: Proposal["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
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
              <Skeleton className="h-4 w-[140px]" />
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
            <TableHead className="text-right">
              <Skeleton className="h-4 w-[100px] ml-auto" />
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
                <Skeleton className="h-5 w-[160px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[90px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-9 w-[100px]" />{" "}
                  {/* View Details button */}
                  <Skeleton className="h-9 w-[90px]" /> {/* Approve button */}
                  <Skeleton className="h-9 w-[80px]" /> {/* Reject button */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  return (
    <div className="container py-6 mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Project Proposals
            </CardTitle>
            <Button
              onClick={() =>
                navigate("/admin/community-engagement/project-proposals/new")
              }
            >
              Create New Proposal
            </Button>
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
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setSortBy("date");
                setSortOrder("desc");
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
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "title") {
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          );
                        } else {
                          setSortBy("title");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Title{" "}
                      {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === "date") {
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          );
                        } else {
                          setSortBy("date");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Target Date{" "}
                      {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
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
                    paginatedProposals.map((proposal) => (
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="p-0 w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewDetails(proposal.id.toString())
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

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
                disabled={page === totalPages}
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
