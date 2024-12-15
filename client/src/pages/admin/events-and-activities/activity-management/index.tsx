import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Filter,
  MapPin,
  MoreHorizontal,
  Search,
  Building2,
  Check,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { activitiesApi } from "@/services/api/activities.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { format } from "date-fns";

// Add these type definitions at the top of the file, after the imports
type ActivityStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

interface Activity {
  id: number;
  title: string;
  description?: string;
  status: ActivityStatus;
  targetDate: string;
  createdAt: string;
  department?: {
    abbreviation: string;
    name: string;
  };
  partnerCommunity?: {
    name: string;
  };
  bannerProgram?: {
    abbreviation: string;
  };
}

const isStatusEqual = (status1: ActivityStatus, status2: ActivityStatus) =>
  status1 === status2;

export default function ActivityManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["activities", currentPage],
    queryFn: () =>
      activitiesApi.getActivitiesForAdmin(currentPage, itemsPerPage),
  });

  const activities: Activity[] = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-500/10 text-blue-500";
      case "ONGOING":
        return "bg-green-500/10 text-green-500";
      case "COMPLETED":
        return "bg-gray-500/10 text-gray-500";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500";
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: (variables: { id: number; status: ActivityStatus }) =>
      activitiesApi.updateActivityStatus(variables.id, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity status updated");
    },
    onError: (error) => {
      toast.error("Failed to update activity status");
      console.error("Error updating status:", error);
    },
  });

  // Filter and sort activities
  const filteredAndSortedActivities = activities
    .filter((activity) => {
      const matchesSearch = 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.department?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.partnerCommunity?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.bannerProgram?.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || 
        activity.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by creation date in descending order (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (isLoading) {
    return (
      <div className="container py-6 mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[450px]" />
              </div>
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters Skeleton */}
            <div className="flex gap-4 items-center mb-6">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-[180px]" />
            </div>

            {/* Table Skeleton - Keep your existing skeleton structure */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Activity</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Partner Community</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Banner Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-3 w-[200px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[180px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-8 h-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Activity Management
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>Failed to load activities</AlertDescription>
            </Alert>
          ) : null}

          {/* Search and Filter Section */}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 w-4 h-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activities Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Activity</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Partner Community</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Banner Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">No activities found</p>
                        {searchQuery || statusFilter !== "all" ? (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter("all");
                            }}
                          >
                            Reset filters
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedActivities.map((activity) => (
                    <TableRow key={activity.id} className="group">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{activity.title}</div>
                          {activity.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {activity.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex gap-2 items-center">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <Building2 className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">
                              {activity.department?.abbreviation ||
                                "No Department"}
                            </span>
                          </div>
                          {activity.bannerProgram && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              <span className="text-xs text-muted-foreground">
                                {activity.bannerProgram.abbreviation}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 w-4 h-4 text-muted-foreground" />
                          {activity.partnerCommunity?.name || "No Community"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                          {format(new Date(activity.targetDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                          {format(new Date(activity.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.charAt(0) +
                            activity.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => navigate(`${activity.id}`)}
                            >
                              View Details
                            </DropdownMenuItem>

                            {/* Only show status update options if activity is not completed or cancelled */}
                            {!isStatusEqual(activity.status, "COMPLETED") &&
                              !isStatusEqual(activity.status, "CANCELLED") && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center">
                                      <div className="flex gap-2 items-center">
                                        <Circle
                                          className={`w-2 h-2 ${getStatusColor(
                                            activity.status
                                          )}`}
                                        />
                                        <span>Update Status</span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-[180px]">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatusMutation.mutate({
                                            id: activity.id,
                                            status: "UPCOMING",
                                          })
                                        }
                                        className="flex gap-2 items-center px-3 py-2 cursor-pointer"
                                        disabled={
                                          updateStatusMutation.isPending ||
                                          isStatusEqual(
                                            activity.status,
                                            "UPCOMING"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "COMPLETED"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "CANCELLED"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "ONGOING"
                                          )
                                        }
                                      >
                                        <div className="flex flex-1 gap-2 items-center">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                          <span className="text-sm">
                                            Upcoming
                                          </span>
                                        </div>
                                        {isStatusEqual(
                                          activity.status,
                                          "UPCOMING"
                                        ) && (
                                          <Check className="w-4 h-4 text-blue-500" />
                                        )}
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatusMutation.mutate({
                                            id: activity.id,
                                            status: "ONGOING",
                                          })
                                        }
                                        className="flex gap-2 items-center px-3 py-2 cursor-pointer"
                                        disabled={
                                          updateStatusMutation.isPending ||
                                          isStatusEqual(
                                            activity.status,
                                            "ONGOING"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "COMPLETED"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "CANCELLED"
                                          ) ||
                                          !isStatusEqual(
                                            activity.status,
                                            "UPCOMING"
                                          )
                                        }
                                      >
                                        <div className="flex flex-1 gap-2 items-center">
                                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                                          <span className="text-sm">Ongoing</span>
                                        </div>
                                        {isStatusEqual(
                                          activity.status,
                                          "ONGOING"
                                        ) && (
                                          <Check className="w-4 h-4 text-green-500" />
                                        )}
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatusMutation.mutate({
                                            id: activity.id,
                                            status: "COMPLETED",
                                          })
                                        }
                                        className="flex gap-2 items-center px-3 py-2 cursor-pointer"
                                        disabled={
                                          updateStatusMutation.isPending ||
                                          isStatusEqual(
                                            activity.status,
                                            "COMPLETED"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "CANCELLED"
                                          ) ||
                                          !isStatusEqual(
                                            activity.status,
                                            "ONGOING"
                                          )
                                        }
                                      >
                                        <div className="flex flex-1 gap-2 items-center">
                                          <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                          <span className="text-sm">
                                            Completed
                                          </span>
                                        </div>
                                        {isStatusEqual(
                                          activity.status,
                                          "COMPLETED"
                                        ) && (
                                          <Check className="w-4 h-4 text-gray-500" />
                                        )}
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator className="my-1" />

                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatusMutation.mutate({
                                            id: activity.id,
                                            status: "CANCELLED",
                                          })
                                        }
                                        className="flex gap-2 items-center px-3 py-2 cursor-pointer text-destructive focus:text-destructive"
                                        disabled={
                                          updateStatusMutation.isPending ||
                                          isStatusEqual(
                                            activity.status,
                                            "COMPLETED"
                                          ) ||
                                          isStatusEqual(
                                            activity.status,
                                            "CANCELLED"
                                          )
                                        }
                                      >
                                        <div className="flex flex-1 gap-2 items-center">
                                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                                          <span className="text-sm">
                                            Cancel Activity
                                          </span>
                                        </div>
                                        {isStatusEqual(
                                          activity.status,
                                          "CANCELLED"
                                        ) && (
                                          <Check className="w-4 h-4 text-red-500" />
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                </>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination - Keep your existing pagination component */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, data?.total || 0)} of{" "}
                  {data?.total || 0} entries
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && setCurrentPage((p) => p - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {/* First Page */}
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Current and Adjacent Pages */}
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const pageNumber = Math.min(
                        Math.max(currentPage - 1 + i, 1),
                        totalPages
                      );
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Ellipsis */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last Page */}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage((p) => p + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
