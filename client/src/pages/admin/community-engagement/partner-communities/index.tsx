import { MapPin, ChevronRight, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="overflow-hidden transition-all group hover:shadow-md">
      <div className="overflow-hidden relative h-48">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60" />
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 text-white backdrop-blur-sm bg-black/50"
        >
          {status}
        </Badge>
      </div>

      <CardContent className="pt-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="flex gap-2 items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {address}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center text-sm text-muted-foreground">
            <CalendarCheck className="w-4 h-4" />
            <span>{activitiesCount} Projects</span>
          </div>
          <Link
            to={`/admin/community-engagement/partner-communities/${id}`}
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View Details
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
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

  if (isLoading) return <div>Loading...</div>;
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
          Total Communities: {communities?.data.length || 0}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities?.data.map((community) => (
          <PartnerCommunityCard
            key={community.id}
            {...community}
            imageUrl={DefaultBarangayImage}
          />
        ))}
      </div>
    </div>
  );
}
