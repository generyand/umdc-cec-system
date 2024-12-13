export interface PartnerCommunity {
  id: number;
  name: string;
  communityType: string;
  address: string;
  activitiesCount: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  status: "UPCOMING" | "COMPLETED" | "ONGOING" | "CANCELLED";
  targetDate: string;
}

export interface PartnerCommunityDetails extends PartnerCommunity {
  adoptionStart: string;
  adoptionEnd: string | null;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
  description: string;
  islandGroup: string;
  region: string;
  province: string;
  city: string;
  postalCode: string;
  coordinates: string;
  elevationLevel: number;
  population: number;
  povertyPopulation: number;
  history: string;
  createdAt: string;
  updatedAt: string;
  activities: Activity[];
}
