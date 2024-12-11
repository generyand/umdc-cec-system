import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
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
import { Activity } from "@/types/activity.types";

export default function ActivityManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["activities"],
    queryFn: activitiesApi.getActivitiesForAdmin,
  });

  const activities: Activity[] = data?.data || [];

  const getStatusColor = (status: Activity["status"]) => {
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
    mutationFn: (variables: { id: number; status: Activity["status"] }) =>
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

  if (isLoading) {
    return (
      <div className="container p-6 mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[450px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4 items-center">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Activity</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Partner Community</TableHead>
                <TableHead>Target Date</TableHead>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-6 mx-auto text-center">
        <p className="text-destructive">Error loading activities</p>
      </div>
    );
  }

  return (
    <>
      <div className="container p-6 mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Activity Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all community engagement activities
            </p>
          </div>
          <Button onClick={() => navigate("new")}>
            <Plus className="mr-2 w-4 h-4" />
            New Activity
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Activity</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Partner Community</TableHead>
                <TableHead>Target Date</TableHead>
                <TableHead>Banner Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
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
                    <div className="flex items-center">
                      <Building2 className="mr-2 w-4 h-4 text-muted-foreground" />
                      {activity.department?.name || "No Department"}
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
                      {new Date(activity.targetDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {activity.bannerProgram && (
                      <Badge variant="secondary">
                        {activity.bannerProgram.abbreviation}
                      </Badge>
                    )}
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
                                activity.status === "UPCOMING"
                              }
                            >
                              <div className="flex flex-1 gap-2 items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-sm">Upcoming</span>
                              </div>
                              {activity.status === "UPCOMING" && (
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
                                activity.status === "ONGOING"
                              }
                            >
                              <div className="flex flex-1 gap-2 items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-sm">Ongoing</span>
                              </div>
                              {activity.status === "ONGOING" && (
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
                                activity.status === "COMPLETED"
                              }
                            >
                              <div className="flex flex-1 gap-2 items-center">
                                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                <span className="text-sm">Completed</span>
                              </div>
                              {activity.status === "COMPLETED" && (
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
                                activity.status === "CANCELLED"
                              }
                            >
                              <div className="flex flex-1 gap-2 items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-sm">Cancel Activity</span>
                              </div>
                              {activity.status === "CANCELLED" && (
                                <Check className="w-4 h-4 text-red-500" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
