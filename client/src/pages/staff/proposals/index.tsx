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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApproverPosition {
  id: string;
  name: string;
}

const APPROVAL_SEQUENCE: ApproverPosition[] = [
  { id: "CEC_HEAD", name: "CEC Head" },
  { id: "VP_DIRECTOR", name: "VP Director" },
  { id: "CHIEF_OPERATION_OFFICER", name: "Chief Operation Officer" },
] as const;

// type ApprovalRole = (typeof APPROVAL_SEQUENCE)[number];

const getApprovalProgress = (approvals: Array<any>) => {
  const totalSteps = APPROVAL_SEQUENCE.length;
  const approvedSteps = approvals.filter((a) => a.status === "APPROVED").length;

  return {
    progress: `${approvedSteps}/${totalSteps} steps`,
  };
};

const getCurrentStep = (proposal: any) => {
  const { status, currentApprovalStep, approvals } = proposal;

  if (status === "RETURNED") {
    const returnedApproval = approvals.find((a) => a.status === "RETURNED");
    return {
      position: returnedApproval?.approverPosition,
      approver: returnedApproval?.approver,
    };
  }

  if (status === "PENDING") {
    return {
      position: currentApprovalStep,
      approver: approvals.find(
        (a) => a.approverPosition === currentApprovalStep
      )?.approver,
    };
  }

  return null;
};

const formatPosition = (position: string | null | undefined) => {
  if (!position) return "Unknown"; // or return any default value you prefer

  return (
    position
      .split("_")
      // .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  );
};

export default function StaffProposalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff-proposals", user?.id],
    queryFn: async () => {
      const result = await projectProposalsService.getProposalsByUser(
        user?.id.toString() as string,
        useAuth.getState().token as string
      );
      if (!result.data.success) throw new Error("Failed to fetch proposals");
      return result.data.data;
    },
    enabled: !!user?.id,
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
          proposal.department.name.toLowerCase().includes(query)
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

  const handleViewDetails = (id: string) => {
    navigate(`/staff/proposals/${id}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-red-100 text-red-800";
      case "RESUBMITTED":
        return "bg-blue-100 text-blue-800";
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
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[90px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-9 w-[100px] ml-auto" />
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
            <CardTitle className="text-2xl font-bold">My Proposals</CardTitle>
            <Button onClick={() => navigate("/staff/proposals/new")}>
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
                placeholder="Search proposals..."
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
                    <TableHead>Title</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
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
                        <TableCell>{proposal.community?.name || "—"}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {proposal.status === "RETURNED" ? (
                              <span className="text-red-600">
                                Returned by{" "}
                                {formatPosition(
                                  getCurrentStep(proposal)?.position
                                )}
                              </span>
                            ) : proposal.status === "PENDING" ? (
                              <span className="text-amber-600">
                                Awaiting{" "}
                                {formatPosition(proposal.currentApprovalStep)}
                              </span>
                            ) : proposal.status === "APPROVED" ? (
                              <span className="text-green-600">
                                Fully Approved
                              </span>
                            ) : null}
                            <div className="text-xs text-muted-foreground">
                              {getApprovalProgress(proposal.approvals).progress}
                            </div>
                          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
