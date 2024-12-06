export interface CreateProposalData {
  title: string;
  description: string;
  department: string;
  program: string;
  bannerProgram: {
    connect: {
      id: number;
    };
  };
  partnerCommunity: string;
  targetBeneficiaries: string;
  targetArea: string;
  targetDate: Date;
  venue: string;
  budget: string;
  files: File[];
  attachments: FileList;
}
