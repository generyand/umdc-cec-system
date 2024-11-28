export interface CommunityOfficial {
  name: string;
  position: string;
  contact: string;
  email: string;
}

export interface ContactInfo {
  office: string;
  email: string;
  address: string;
}

export interface CommunityStats {
  totalBeneficiaries: number;
  activePrograms: number;
  completedPrograms: number;
  studentVolunteers: number;
  totalOutcomes: number;
  volunteerHours: number;
}

export interface Program {
  name: string;
  description: string;
  status: "ongoing" | "completed";
  beneficiaries: number;
  startDate: string;
  endDate?: string;
  outcomes: string[];
}

export interface GalleryImage {
  url: string;
  caption: string;
  date: string;
  category: "program" | "community";
}

export interface CommunityDemographics {
  population: {
    total2020: number;
    total2015: number;
    total1990: number;
    percentOfCity: number;
    growthRate: number;
  };
  households: {
    count2015: number;
    averageSize: number;
    population2015: number;
  };
  historicalGrowth: {
    period: string;
    totalGrowth: number;
    description: string;
  };
}

export interface CommunitySummary {
  type: string;
  islandGroup: string;
  region: string;
  province: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
    dms: string;
  };
  elevation: {
    meters: number;
    feet: number;
  };
}

export interface Community {
  name: string;
  description: string;
  location: string;
  history: string;
  summary: CommunitySummary;
  demographics: CommunityDemographics;
  officials: CommunityOfficial[];
  contactInfo: ContactInfo;
  stats: CommunityStats;
  currentPrograms: Program[];
  completedPrograms: Program[];
  gallery: GalleryImage[];
}
