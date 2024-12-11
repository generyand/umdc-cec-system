export interface Activity {
  id: number;
  title: string;
  description: string | null;
  targetDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  department?: {
    name: string;
  };
  partnerCommunity?: {
    name: string;
  };
  bannerProgram?: {
    abbreviation: string;
  };
}
