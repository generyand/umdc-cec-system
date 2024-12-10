import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Building2,
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
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface Activity {
  id: number;
  title: string;
  description: string | null;
  targetDate: Date;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  department: {
    name: string;
  };
  partnerCommunity: {
    name: string;
  };
  bannerProgram?: {
    name: string;
  };
}

export default function ActivityManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data - replace with actual API call
  const activities: Activity[] = [
    {
      id: 1,
      title: "Community Health Program",
      description: "Free medical consultation and medicines distribution",
      targetDate: new Date("2024-02-15"),
      status: "UPCOMING",
      department: {
        name: "College of Medicine",
      },
      partnerCommunity: {
        name: "Brgy. San Jose",
      },
      bannerProgram: {
        name: "Health & Wellness",
      },
    },
    // Add more mock activities...
  ];

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

  return (
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
                    {activity.department.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="mr-2 w-4 h-4 text-muted-foreground" />
                    {activity.partnerCommunity.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                    {activity.targetDate.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  {activity.bannerProgram && (
                    <Badge variant="secondary">
                      {activity.bannerProgram.name}
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
                      <Button
                        variant="ghost"
                        className="p-0 w-8 h-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`${activity.id}`)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel Activity
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
