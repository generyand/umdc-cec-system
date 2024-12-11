import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Home } from "lucide-react";
import {
  Calendar,
  Building2,
  Users,
  FileText,
  MapPin,
  Phone,
  Mail,
  Target,
  DollarSign,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "@/services/api/activities.service";

const ActivityDetailsPage = () => {
  const { id } = useParams();

  // Remove the useQuery and use mock data directly
  const { data, isLoading, error } = useQuery({
    queryKey: ["activity", id],
    queryFn: () => activitiesApi.getActivityById(Number(id)),
  });

  const activity = data?.data;

  if (isLoading) return <ActivityDetailsSkeleton />;
  if (!activity) return <div>Activity not found</div>;
  if (error) return <div>Error fetching activity</div>;

  const getStatusColor = (status: string) => {
    const colors = {
      UPCOMING: "bg-blue-500",
      ONGOING: "bg-green-500",
      COMPLETED: "bg-gray-500",
      CANCELLED: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="container p-6 mx-auto space-y-8">
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Link
          to="/admin/dashboard"
          className="flex items-center transition-colors hover:text-primary"
        >
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to="/admin/events-and-activities"
          className="transition-colors hover:text-primary"
        >
          Events & Activities
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to="/admin/events-and-activities/activity-management"
          className="transition-colors hover:text-primary"
        >
          Activity Management
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">Activity Details</span>
      </nav>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-1">
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(activity.createdAt), "PPP")}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {activity.title}
            </h1>
          </div>
          <Badge
            className={`${getStatusColor(
              activity.status
            )} px-6 py-2 text-sm font-medium self-start`}
          >
            {activity.status}
          </Badge>
        </div>
        <Separator className="my-6" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card className="overflow-hidden rounded-lg border-none shadow transition-shadow duration-200">
            <CardHeader className="pb-4 border-b bg-primary/15">
              <CardTitle className="flex gap-2 items-center text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Activity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p className="text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3 items-start">
                  <Calendar className="mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Target Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.targetDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Building2 className="mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Department</h3>
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <span>{activity.department.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.department.abbreviation}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {activity.bannerProgram && (
                <div className="flex gap-3 items-start pt-2">
                  <Target className="mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Banner Program</h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.bannerProgram.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      ({activity.bannerProgram.abbreviation})
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-lg border-none shadow transition-shadow duration-200">
            <CardHeader className="pb-4 border-b bg-primary/15">
              <CardTitle className="flex gap-2 items-center text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Project Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3 items-start">
                  <Users className="mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">
                      Target Beneficiaries
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.proposal.targetBeneficiaries}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <DollarSign className="mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Budget</h3>
                    <p className="text-sm text-muted-foreground">
                      ₱{Number(activity.proposal.budget).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-lg border-none shadow transition-shadow duration-200">
          <CardHeader className="pb-4 border-b bg-primary/15">
            <CardTitle className="flex gap-2 items-center text-lg">
              <Users className="w-5 h-5 text-primary" />
              Partner Community
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {activity.partnerCommunity.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {activity.partnerCommunity.communityType}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="mt-1 w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.partnerCommunity.address}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Contact Information</h3>
                <div className="pl-2 space-y-3">
                  <div className="flex gap-3 items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{activity.partnerCommunity.contactPerson}</span>
                  </div>
                  <div className="flex gap-3 items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{activity.partnerCommunity.contactNumber}</span>
                  </div>
                  {activity.partnerCommunity.contactEmail && (
                    <div className="flex gap-3 items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{activity.partnerCommunity.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ActivityDetailsSkeleton = () => (
  <div className="container p-6 mx-auto space-y-6">
    <Skeleton className="w-1/3 h-10" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Skeleton className="h-[300px]" />
      <Skeleton className="h-[300px]" />
      <Skeleton className="h-[200px] md:col-span-2" />
    </div>
  </div>
);

export default ActivityDetailsPage;
