import { MapPin, ChevronRight, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DefaultBarangayImage from "@/assets/images/partner-communities/default-barangay.webp";
import { partnerCommunitiesApi } from "@/services/api/partner-communities.service";
import { useQuery } from "@tanstack/react-query";
import { PartnerCommunity } from "@/types/partner-community.type";

interface PartnerCommunityCardProps extends PartnerCommunity {
  imageUrl?: string;
}

function PartnerCommunityCard({
  name,
  id,
  address,
  status,
  activitiesCount,
  imageUrl = DefaultBarangayImage,
}: PartnerCommunityCardProps) {
  return (
    <Card className="overflow-hidden transition-all group hover:shadow-lg hover:scale-[1.01] duration-300">
      <div className="overflow-hidden relative h-48">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/80 via-black/40" />
        <Badge
          variant={status === "ACTIVE" ? "default" : "secondary"}
          className="absolute top-4 right-4 font-medium"
        >
          {status === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      </div>

      <CardContent className="px-6 pt-6 pb-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold transition-colors line-clamp-1 group-hover:text-primary">
            {name}
          </h2>
          <p className="flex gap-2 items-center text-sm text-muted-foreground">
            <MapPin className="flex-shrink-0 w-4 h-4 text-blue-500" />
            <span className="line-clamp-1">{address}</span>
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-2 items-center text-sm">
            <Badge
              variant="outline"
              className="flex gap-1.5 items-center py-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
              <span>{activitiesCount} Projects</span>
            </Badge>
          </div>
          <Link
            to={`/admin/community-engagement/partner-communities/${id}`}
            className="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80"
          >
            View Details
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerCommunityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="px-6 pt-6 pb-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-7" />
          <div className="flex gap-2 items-center">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <Skeleton className="w-28 h-7" />
          <Skeleton className="w-24 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PartnerCommunitiesPage() {
  const {
    data: communities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partner-communities"],
    queryFn: partnerCommunitiesApi.getAllPartnerCommunities,
  });

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Partner Communities</h1>
          <p className="text-muted-foreground">
            Explore our partner barangays and their community programs
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          Total Communities: {isLoading ? "..." : communities?.data.length || 0}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <PartnerCommunityCardSkeleton />
            <PartnerCommunityCardSkeleton />
            <PartnerCommunityCardSkeleton />
          </>
        ) : (
          communities?.data.map((community) => (
            <PartnerCommunityCard
              key={community.id}
              {...community}
              imageUrl={DefaultBarangayImage}
            />
          ))
        )}
      </div>
    </div>
  );
}
