import { Building2, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface PartnerCommunityCardProps {
  name: string;
  slug: string;
  beneficiaries?: number;
  programs?: number;
  location?: string;
}

function PartnerCommunityCard({
  name,
  slug,
  beneficiaries = 0,
  programs = 0,
  location = "",
}: PartnerCommunityCardProps) {
  return (
    <Link
      to={`/admin/community-engagement/partner-communities/${slug}`}
      className="block p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-4">{name}</h2>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{beneficiaries} Beneficiaries</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>{programs} Active Programs</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </Link>
  );
}

export default function PartnerCommunitiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="mb-4 text-2xl font-bold">Partner Communities</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PartnerCommunityCard
          name="Barangay San Miguel"
          slug="san-miguel"
          beneficiaries={150}
          programs={3}
          location="San Miguel, Digos City"
        />
        <PartnerCommunityCard
          name="Barangay Dawis"
          slug="dawis"
          beneficiaries={200}
          programs={4}
          location="Dawis, Digos City"
        />
        <PartnerCommunityCard
          name="Barangay Ruparan"
          slug="ruparan"
          beneficiaries={175}
          programs={3}
          location="Ruparan, Digos City"
        />
      </div>
    </div>
  );
}
