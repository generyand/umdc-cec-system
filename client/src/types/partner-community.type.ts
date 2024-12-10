export interface PartnerCommunity {
  id: number;
  name: string;
  communityType: string;
  address: string;
  activitiesCount: number;
  status: "ACTIVE" | "INACTIVE";
}
