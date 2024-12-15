import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  PlusCircle,
  Download,
  ChevronRight,
  Info,
  Building2,
  Calendar,
  FolderOpen,
  MapPin,
  MoreHorizontal,
  Filter,
  Upload,
  CalendarCheck,
  CheckCircle2,
  FileText,
  School,
  Plus,
  PlayCircle,
  XCircle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { bannerProgramsApi } from "@/services/api/banner-programs.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MOCK_PROGRAM = {
  id: 10,
  name: "Baranggay at UM Magka-agapay sa Tamang Impormasyon para sa Kaunlaran",
  abbreviation: "BUMATI KA",
  description: "Technology literacy and information dissemination program.",
  yearStarted: 2012,
  status: "ACTIVE",
  departmentId: 6,
  createdAt: "2024-12-09T15:05:39.174Z",
  updatedAt: "2024-12-09T15:05:39.174Z",
  department: {
    id: 6,
    name: "Department of Technical Programs",
    abbreviation: "DTP"
  },
  academicPrograms: [
    {
      id: 16,
      name: "Bachelor of Science in Information Technology",
      abbreviation: "BSIT",
      totalStudents: 200
    }
  ],
  activities: [
    {
      id: 20,
      title: "This is a New Proposal",
      description: "Description for the new Proposal",
      targetDate: "2025-01-03T16:00:00.000Z",
      status: "CANCELLED",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    },
    {
      id: 22,
      title: "Add napud tag proposal baiii",
      description: "ljkasldkfjl;asdjf;laksjdfa",
      targetDate: "2024-12-27T16:00:00.000Z",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    },
    {
      id: 23,
      title: "asdfasdfasdasd",
      description: "asdfefwaefasdfasdfaasdfasdf",
      targetDate: "2024-12-20T16:00:00.000Z",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay Aplaya",
        communityType: "Barangay",
        address: "Aplaya, Digos City, Davao del Sur"
      }
    },
    {
      id: 19,
      title: "Testing for Creating New Proposal",
      description: "Gi usab na nakong description para goods",
      targetDate: "2024-12-19T16:00:00.000Z",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    },
    {
      id: 21,
      title: "This is a Brand New Proposal",
      description: "A new Proposal for poijasdpofijaposdf",
      targetDate: "2024-12-17T16:00:00.000Z",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay San Miguel",
        communityType: "Barangay",
        address: "San Miguel, Digos City, Davao del Sur"
      }
    },
    {
      id: 17,
      title: "Creating a proposal",
      description: "Description for creating a proposal",
      targetDate: "2024-12-15T16:00:00.000Z",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    },
    {
      id: 16,
      title: "New Proposal to Test Resubmission",
      description: "This is a description for the resubmission of proposal",
      targetDate: "2024-12-14T16:00:00.000Z",
      status: "ONGOING",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    },
    {
      id: 18,
      title: "A new proposal",
      description: "description for new proposal",
      targetDate: "2024-12-14T16:00:00.000Z",
      status: "ONGOING",
      partnerCommunity: {
        name: "Barangay Dawis",
        communityType: "Barangay",
        address: "Dawis, Digos City, Davao del Sur"
      }
    }
  ],
  stats: {
    activeActivities: 7,
    completedActivities: 0,
    totalAcademicPrograms: 1
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800";
    case "INACTIVE":
      return "bg-slate-100 text-slate-800";
    case "SUSPENDED":
      return "bg-amber-100 text-amber-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BannerProgramSkeleton = () => (
  <div className="container py-8 space-y-6">
    <div className="space-y-4">
      <Skeleton className="w-32 h-10" />
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-48 h-4" />
        </div>
        <Skeleton className="w-32 h-10" />
      </div>
    </div>
    {/* Add more skeleton UI */}
  </div>
);

function ActivitiesList({ 
  title, 
  activities, 
  icon 
}: { 
  title: string; 
  activities: typeof MOCK_PROGRAM.activities; 
  icon: React.ReactNode;
}) {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge variant="secondary">{activities.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-sm text-muted-foreground">No activities found</p>
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityCard({ activity }: { activity: typeof MOCK_PROGRAM.activities[0] }) {
  const navigate = useNavigate();

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "default";
      case "ONGOING":
        return "secondary";
      case "COMPLETED":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer group"
      onClick={() => navigate(`/admin/events-and-activities/activity-management/${activity.id}`)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={getBadgeVariant(activity.status)}
              className="w-fit"
            >
              {activity.status}
            </Badge>
          </div>

          {/* Title */}
          <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {activity.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {activity.description}
          </p>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{activity.partnerCommunity.name}</p>
              <p className="text-xs text-muted-foreground">
                {activity.partnerCommunity.address}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(activity.targetDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BannerProgramDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["banner-program", id],
    queryFn: () => bannerProgramsApi.getBannerProgramById(Number(id)),
  });
  const navigate = useNavigate();

  const program = data?.data;

  if (isLoading) {
    return <BannerProgramSkeleton />;
  }

  if (!program) {
    return <div>Banner Program not found</div>;
  }

  // Update groupedActivities to exclude cancelled
  const groupedActivities = {
    upcoming: program.activities.filter((a) => a.status === "UPCOMING"),
    ongoing: program.activities.filter((a) => a.status === "ONGOING"),
    completed: program.activities.filter((a) => a.status === "COMPLETED"),
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Banner Programs
          </Button>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {program.abbreviation}
                  </h2>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{program.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-muted-foreground">{program.description}</p>
          </div>
          <Button>
            <Edit className="mr-2 w-4 h-4" />
            Edit Program
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{program.department.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Year Started</p>
            <p className="font-medium">{program.yearStarted}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={cn(getStatusColor(program.status))}>
              {program.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          icon={<School className="w-8 h-8 text-cyan-500" />}
          label="Academic Programs"
          value={program.stats.totalAcademicPrograms}
        />
        <StatCard
          icon={<CalendarCheck className="w-8 h-8 text-yellow-500" />}
          label="Active Activities"
          value={program.stats.activeActivities}
        />
        <StatCard
          icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
          label="Completed Activities"
          value={program.stats.completedActivities}
        />
      </div>

      {/* Activities Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActivitiesList
          title="Upcoming Activities"
          activities={groupedActivities.upcoming.sort((a, b) => 
            new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
          )}
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
        />
        <ActivitiesList
          title="Ongoing Activities"
          activities={groupedActivities.ongoing.sort((a, b) => 
            new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
          )}
          icon={<PlayCircle className="h-5 w-5 text-yellow-500" />}
        />
        <ActivitiesList
          title="Completed Activities"
          activities={groupedActivities.completed.sort((a, b) => 
            new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime() // Reverse sort for completed
          )}
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
        />
      </div>
    </div>
  );
}

// Keep the StatCard component as is
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
