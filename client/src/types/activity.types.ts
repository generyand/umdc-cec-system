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

export interface Department {
  name: string;
  abbreviation: string;
}

export interface PartnerCommunity {
  name: string;
  communityType: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string | null;
}

export interface BannerProgram {
  name: string;
  abbreviation: string;
}

export interface Proposal {
  title: string;
  description: string;
  targetBeneficiaries: string;
  budget: string;
}

export interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
  category: string;
}

export interface ActivityData {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  departmentId: number;
  partnerCommunityId: number;
  proposalId: number;
  createdAt: string;
  updatedAt: string;
  bannerProgramId: number;
  department: Department;
  partnerCommunity: PartnerCommunity;
  bannerProgram: BannerProgram;
  proposal: Proposal;
  documents: Document[];
}

export interface ActivityResponse {
  data: Activity;
  message: string;
  error: boolean;
}
