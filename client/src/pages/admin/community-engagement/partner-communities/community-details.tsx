import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Building2,
  History,
  Users,
  GanttChart,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { mockCommunity } from "./mock-data";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Activity {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
}

interface ActivitiesListProps {
  title: string;
  activities: Activity[];
}

export function ActivitiesList({ title, activities }: ActivitiesListProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activities found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex gap-4 justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <Badge
                  variant={
                    activity.status === "UPCOMING" ? "default" : "secondary"
                  }
                >
                  {format(new Date(activity.date), "MMM d, yyyy")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

interface DetailItemProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "N/A"}</span>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
}

export function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4 items-center">
          <div className="p-3 rounded-full bg-primary/10">{icon}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunityDetailsPage() {
  const navigate = useNavigate();
  const community = mockCommunity;

  if (!community) return <div>Community not found</div>;

  return (
    <div className="mx-auto space-y-6 w-full max-w-7xl">
      {/* Simple Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {/* <Link to="/admin" className="hover:text-foreground">
          Admin
        </Link> */}
        {/* <ChevronRight className="w-4 h-4" /> */}
        <Link
          to="/admin/community-engagement"
          className="hover:text-foreground"
        >
          Community Engagement
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to="/admin/community-engagement/partner-communities"
          className="hover:text-foreground"
        >
          Partner Communities
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{community.name}</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          className="-ml-4 w-fit text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Communities
        </Button>

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <h1 className="text-3xl font-bold">{community.name}</h1>
              <Badge
                variant={
                  community.status === "ACTIVE" ? "default" : "secondary"
                }
                className="ml-2"
              >
                {community.status}
              </Badge>
            </div>
            <p className="flex gap-2 items-center text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {community.address}
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Partnership Duration"
            icon={<Calendar className="w-4 h-4 text-blue-500" />}
            value={format(new Date(community.adoptionStart), "MMM yyyy")}
            subtitle={
              community.adoptionEnd
                ? `Until ${format(new Date(community.adoptionEnd), "MMM yyyy")}`
                : "Ongoing"
            }
          />
          <StatsCard
            title="Total Population"
            icon={<Users className="w-4 h-4 text-emerald-500" />}
            value={community.population?.toLocaleString() ?? "N/A"}
            subtitle={
              community.povertyPopulation
                ? `${community.povertyPopulation.toLocaleString()} in poverty`
                : undefined
            }
          />
          <StatsCard
            title="Contact Person"
            icon={<Phone className="w-4 h-4 text-violet-500" />}
            value={community.contactPerson}
            subtitle={community.contactNumber}
          />
          <StatsCard
            title="Active Activities"
            icon={<GanttChart className="w-4 h-4 text-orange-500" />}
            value={
              community.activities.filter((a) => a.status === "UPCOMING").length
            }
            subtitle="Upcoming activities"
          />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="justify-start p-0 w-full h-12 rounded-none border-b bg-background">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background rounded-none h-12 px-6 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="data-[state=active]:bg-background rounded-none h-12 px-6 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
          >
            Activities
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-background rounded-none h-12 px-6 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary"
          >
            Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* About Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <History className="w-5 h-5 text-primary" />
                  About the Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {community.description}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  label="Contact Person"
                  value={community.contactPerson}
                />
                <DetailItem
                  label="Phone Number"
                  value={community.contactNumber}
                />
                <DetailItem label="Email" value={community.contactEmail} />
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem label="Region" value={community.region} />
                <DetailItem label="Province" value={community.province} />
                <DetailItem label="City" value={community.city} />
                <DetailItem label="Coordinates" value={community.coordinates} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ActivitiesList
              title="Upcoming Activities"
              activities={community.activities.filter(
                (a) => a.status === "UPCOMING"
              )}
            />
            <ActivitiesList
              title="Completed Activities"
              activities={community.activities.filter(
                (a) => a.status === "COMPLETED"
              )}
            />
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Administrative Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Building2 className="w-5 h-5 text-primary" />
                  Administrative Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  label="Community Type"
                  value={community.communityType}
                />
                <DetailItem
                  label="Island Group"
                  value={community.islandGroup}
                />
                <DetailItem label="Postal Code" value={community.postalCode} />
                {community.elevationLevel && (
                  <DetailItem
                    label="Elevation"
                    value={`${community.elevationLevel} meters`}
                  />
                )}
              </CardContent>
            </Card>

            {/* Historical Background */}
            {community.history && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <History className="w-5 h-5 text-primary" />
                    Historical Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {community.history}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
