import { Community } from "@/types/community.types";

export const partnerCommunities: Record<string, Community> = {
  ruparan: {
    name: "Barangay Ruparan",
    description: "The CEC expanded its reach to this new community...",
    location: "Ruparan, Digos City",
    history: `Barangay Ruparan, one of the newer barangays...`,
    summary: {
      type: "barangay",
      islandGroup: "Mindanao",
      region: "Davao Region (Region XI)",
      province: "Davao del Sur",
      city: "Digos",
      postalCode: "8002",
      coordinates: {
        lat: 6.7902,
        lng: 125.3229,
        dms: "6° 47' North, 125° 19' East",
      },
      elevation: {
        meters: 73.1,
        feet: 239.8,
      },
    },
    demographics: {
      population: {
        total2020: 4278,
        total2015: 3662,
        total1990: 2458,
        percentOfCity: 2.27,
        growthRate: 3.33,
      },
      households: {
        count2015: 907,
        averageSize: 4.04,
        population2015: 3662,
      },
      historicalGrowth: {
        period: "1990-2020",
        totalGrowth: 1820,
        description:
          "The population of Ruparan grew from 2,458 in 1990 to 4,278 in 2020, an increase of 1,820 people over the course of 30 years. The latest census figures in 2020 denote a positive growth rate of 3.33%, or an increase of 616 people, from the previous population of 3,662 in 2015.",
      },
    },
    officials: [
      {
        name: "Roberto M. Santos",
        position: "Barangay Captain",
        contact: "0917-555-1234",
        email: "roberto.santos@digoscity.gov.ph",
      },
      {
        name: "Maria Elena D. Cruz",
        position: "Barangay Secretary",
        contact: "0918-555-2345",
        email: "mariaelena.cruz@digoscity.gov.ph",
      },
      {
        name: "Juan C. Reyes",
        position: "Barangay Treasurer",
        contact: "0919-555-3456",
        email: "juan.reyes@digoscity.gov.ph",
      },
      {
        name: "Pedro L. Garcia",
        position: "Kagawad - Peace and Order",
        contact: "0920-555-4567",
        email: "pedro.garcia@digoscity.gov.ph",
      },
      {
        name: "Ana Marie P. Tan",
        position: "Kagawad - Health and Education",
        contact: "0921-555-5678",
        email: "anamarie.tan@digoscity.gov.ph",
      },
      {
        name: "Ricardo B. Mendoza",
        position: "Kagawad - Infrastructure",
        contact: "0922-555-6789",
        email: "ricardo.mendoza@digoscity.gov.ph",
      },
      {
        name: "Carmen O. Villanueva",
        position: "Kagawad - Environmental Protection",
        contact: "0923-555-7890",
        email: "carmen.villanueva@digoscity.gov.ph",
      },
      {
        name: "Christian James P. Dela Rosa",
        position: "SK Chairman",
        contact: "0927-555-1234",
        email: "christian.delarosa@digoscity.gov.ph",
      },
    ],
    contactInfo: {
      office: "(082) 553-2847",
      email: "ruparan@digoscity.gov.ph",
      address: "Ruparan Barangay Hall, National Highway, Digos City",
    },
    stats: {
      totalBeneficiaries: 175,
      activePrograms: 3,
      completedPrograms: 4,
      studentVolunteers: 35,
      totalOutcomes: 14,
      volunteerHours: 380,
    },
    currentPrograms: [
      {
        name: "Youth Leadership Development",
        description:
          "Empowering young leaders through workshops and community projects",
        status: "ongoing",
        beneficiaries: 45,
        startDate: "2024-01",
        outcomes: [
          "Conducted 3 leadership workshops",
          "Initiated 2 youth-led community projects",
          "Established youth council partnerships",
        ],
      },
      {
        name: "Digital Literacy Program",
        description: "Teaching basic computer skills to community members",
        status: "ongoing",
        beneficiaries: 60,
        startDate: "2024-02",
        outcomes: [
          "Basic computer skills training for 60 residents",
          "Online job search workshops",
          "Digital safety awareness sessions",
        ],
      },
      {
        name: "Community Health Initiative",
        description: "Regular health check-ups and wellness programs",
        status: "ongoing",
        beneficiaries: 70,
        startDate: "2024-01",
        outcomes: [
          "Monthly health screenings established",
          "Wellness education sessions",
          "Partnership with local health center",
        ],
      },
    ],
    completedPrograms: [
      {
        name: "Community Garden Project",
        description:
          "Urban gardening initiative for sustainable food production",
        status: "completed",
        beneficiaries: 45,
        startDate: "2023-05",
        endDate: "2023-11",
        outcomes: [
          "Established 15 community gardens",
          "Conducted gardening workshops",
          "Created sustainable food source",
        ],
      },
      {
        name: "Financial Literacy Workshop",
        description: "Basic financial management training for residents",
        status: "completed",
        beneficiaries: 55,
        startDate: "2023-08",
        endDate: "2023-12",
        outcomes: [
          "Trained 55 residents in basic financial management",
          "Established savings groups",
          "Created financial planning guides",
        ],
      },
      {
        name: "Environmental Awareness Campaign",
        description: "Education and action for environmental conservation",
        status: "completed",
        beneficiaries: 120,
        startDate: "2023-06",
        endDate: "2023-10",
        outcomes: [
          "Conducted waste management seminars",
          "Organized community clean-up drives",
          "Implemented recycling program",
        ],
      },
      {
        name: "Skills Training Program",
        description: "Vocational skills development for livelihood",
        status: "completed",
        beneficiaries: 40,
        startDate: "2023-07",
        endDate: "2024-01",
        outcomes: [
          "Completed training for 40 participants",
          "Developed marketable skills",
          "Connected participants with employment opportunities",
        ],
      },
    ],
    gallery: [
      {
        url: "/images/ruparan/youth-leadership.jpg",
        caption: "Youth Leadership Workshop Session",
        date: "2024-01-15",
        category: "program",
      },
      {
        url: "/images/ruparan/digital-literacy.jpg",
        caption: "Digital Skills Training",
        date: "2024-02-10",
        category: "program",
      },
      {
        url: "/images/ruparan/health-initiative.jpg",
        caption: "Community Health Screening",
        date: "2024-01-25",
        category: "program",
      },
      {
        url: "/images/ruparan/community-garden.jpg",
        caption: "Community Garden Project",
        date: "2023-09-20",
        category: "program",
      },
      {
        url: "/images/ruparan/financial-literacy.jpg",
        caption: "Financial Management Workshop",
        date: "2023-10-15",
        category: "program",
      },
      {
        url: "/images/ruparan/environmental.jpg",
        caption: "Environmental Clean-up Drive",
        date: "2023-08-30",
        category: "community",
      },
    ],
  },
  // dawis: {},
};

export const getCommunityData = (slug: string): Community | undefined => {
  return partnerCommunities[slug];
};
