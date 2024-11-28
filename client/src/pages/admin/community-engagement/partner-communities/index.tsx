import { MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PartnerCommunityCardProps {
  name: string;
  slug: string;
  beneficiaries?: number;
  targetBeneficiaries?: number;
  location?: string;
  imageUrl?: string;
  description?: string;
  activePrograms?: number;
}

function PartnerCommunityCard({
  name,
  slug,
  beneficiaries = 0,
  targetBeneficiaries = 0,
  location = "",
  imageUrl = "/images/default-barangay.jpg",
  // description = "",
  activePrograms = 0,
}: PartnerCommunityCardProps) {
  const progressPercentage = (beneficiaries / targetBeneficiaries) * 100;

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
          {activePrograms} Active Programs
        </Badge>
      </div>

      <CardContent className="pt-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="flex gap-2 items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {location}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Beneficiaries</span>
            <span className="text-primary">
              {beneficiaries}/{targetBeneficiaries}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>

        <Link
          to={`/admin/community-engagement/partner-communities/${slug}`}
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          View Community Details
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default function PartnerCommunitiesPage() {
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
          Total Communities: 3
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PartnerCommunityCard
          name="Barangay San Miguel"
          slug="san-miguel"
          beneficiaries={150}
          targetBeneficiaries={200}
          location="San Miguel, Digos City"
          imageUrl="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
          description="A vibrant community known for its agricultural heritage"
          activePrograms={3}
        />
        <PartnerCommunityCard
          name="Barangay Dawis"
          slug="dawis"
          beneficiaries={200}
          targetBeneficiaries={250}
          location="Dawis, Digos City"
          imageUrl="https://images.unsplash.com/photo-1526958097901-5e6d742d3371?q=80&w=1200&auto=format&fit=crop"
          description="A coastal community focusing on sustainable fishing practices"
          activePrograms={4}
        />
        <PartnerCommunityCard
          name="Barangay Ruparan"
          slug="ruparan"
          beneficiaries={175}
          targetBeneficiaries={200}
          location="Ruparan, Digos City"
          imageUrl="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1200&auto=format&fit=crop"
          description="An emerging hub for local entrepreneurship"
          activePrograms={3}
        />
      </div>
    </div>
  );
}
