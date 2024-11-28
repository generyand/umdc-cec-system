import { DepartmentData } from "@/types/department";

export const departmentsData: Record<string, DepartmentData> = {
  dae: {
    slug: "dae",
    name: "Department of Accounting Education",
    description:
      "Empowering communities through financial education and literacy programs",
    academicPrograms: {
      active: [
        {
          code: "BSA",
          name: "Bachelor of Science in Accountancy",
          students: 450,
          yearStarted: 1995,
        },
        {
          code: "BSMA",
          name: "Bachelor of Science in Management Accounting",
          students: 320,
          yearStarted: 2005,
        },
      ],
      inactive: [
        // {
        //   code: "BSBAMajAcc",
        //   name: "BSBA Major in Accounting",
        //   yearStarted: 1990,
        //   yearEnded: 2010,
        //   lastGraduates: 89,
        // },
      ],
    },
    bannerPrograms: [
      {
        title: "Financial Literacy Movement",
        description:
          "A comprehensive initiative aimed at improving financial literacy among local communities through workshops, seminars, and one-on-one consultations.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 5000,
        actualBeneficiaries: 2450,
      },
    ],
    implementedProjects: [
      {
        title: "Financial Literacy for Small Businesses",
        date: "March 15, 2024",
        targetBeneficiaries: 200,
        actualBeneficiaries: 150,
        location: "Barangay San Jose",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 3,
      implementedProjects: {
        total: 12,
        target: 15,
        completed: 8,
        ongoing: 4,
        totalBeneficiaries: {
          target: 5000,
          actual: 3240,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 65 },
      { month: "Feb", beneficiaries: 75 },
      { month: "Mar", beneficiaries: 150 },
    ],
  },
  dase: {
    slug: "dase",
    name: "Department of Arts & Sciences Education",
    description:
      "Advancing social sciences and humanities education through innovative teaching and community engagement",
    academicPrograms: {
      active: [
        {
          code: "BSP",
          name: "Bachelor of Science in Psychology",
          students: 380,
          yearStarted: 1998,
        },
        {
          code: "BSSW",
          name: "Bachelor of Science in Social Work",
          students: 420,
          yearStarted: 1998,
        },
        {
          code: "ABCOM",
          name: "Bachelor of Arts in Communication",
          students: 290,
          yearStarted: 2010,
        },
        {
          code: "ABPOLSCI",
          name: "Bachelor of Arts in Political Science",
          students: 310,
          yearStarted: 2012,
        },
      ],
      inactive: [
        {
          code: "ABENG",
          name: "Bachelor of Arts in English",
          yearStarted: 2005,
          yearEnded: 2015,
          lastGraduates: 45,
        },
      ],
    },
    bannerPrograms: [
      {
        title: "Community Mental Health Awareness Program",
        description:
          "A comprehensive initiative focused on promoting mental health awareness and psychological well-being through counseling services, workshops, and community-based interventions.",
        status: "Active",
        yearStarted: 2022,
        targetBeneficiaries: 3000,
        actualBeneficiaries: 1850,
      },
      {
        title: "Social Development and Advocacy Campaign",
        description:
          "An integrated program combining social work interventions, communication campaigns, and policy advocacy to address community needs and social issues.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 2500,
        actualBeneficiaries: 1650,
      },
    ],
    implementedProjects: [
      {
        title: "Mental Health First Aid Training",
        date: "March 20, 2024",
        targetBeneficiaries: 300,
        actualBeneficiaries: 275,
        location: "Various Communities",
        status: "Completed",
      },
      {
        title: "Youth Leadership and Civic Engagement Workshop",
        date: "February 15, 2024",
        targetBeneficiaries: 250,
        actualBeneficiaries: 230,
        location: "Main Campus",
        status: "Completed",
      },
      {
        title: "Community Communications Development",
        date: "January 25, 2024",
        targetBeneficiaries: 200,
        actualBeneficiaries: 185,
        location: "Partner Barangays",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 4,
      implementedProjects: {
        total: 15,
        target: 20,
        completed: 12,
        ongoing: 3,
        totalBeneficiaries: {
          target: 3000,
          actual: 1850,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 180 },
      { month: "Feb", beneficiaries: 130 },
      { month: "Mar", beneficiaries: 275 },
    ],
  },
  dba: {
    slug: "dba",
    name: "Department of Business Administration",
    description:
      "Developing future business leaders through innovative management education",
    academicPrograms: {
      active: [
        {
          code: "BSBA",
          name: "Bachelor of Science in Business Administration",
          students: 520,
          yearStarted: 1992,
        },
        {
          code: "BSTM",
          name: "Bachelor of Science in Tourism Management",
          students: 480,
          yearStarted: 1995,
        },
      ],
      inactive: [
        {
          code: "BSHRM",
          name: "Bachelor of Science in Hotel and Restaurant Management",
          yearStarted: 1990,
          yearEnded: 2018,
          lastGraduates: 76,
        },
      ],
    },
    bannerPrograms: [
      {
        title: "Youth Entrepreneurship Program",
        description:
          "Empowering young entrepreneurs through mentorship, workshops, and startup support initiatives.",
        status: "Active",
        yearStarted: 2022,
        targetBeneficiaries: 2000,
        actualBeneficiaries: 1200,
      },
    ],
    implementedProjects: [
      {
        title: "Small Business Development Workshop",
        date: "March 10, 2024",
        targetBeneficiaries: 150,
        actualBeneficiaries: 145,
        location: "Main Campus",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 4,
      implementedProjects: {
        total: 18,
        target: 20,
        completed: 15,
        ongoing: 3,
        totalBeneficiaries: {
          target: 2000,
          actual: 1200,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 120 },
      { month: "Feb", beneficiaries: 180 },
      { month: "Mar", beneficiaries: 145 },
    ],
  },
  dcje: {
    slug: "dcje",
    name: "Department of Criminal Justice Education",
    description:
      "Preparing future law enforcement professionals with integrity and excellence",
    academicPrograms: {
      active: [
        {
          code: "BSCRIM",
          name: "Bachelor of Science in Criminology",
          students: 850,
          yearStarted: 1988,
        },
      ],
      inactive: [],
    },
    bannerPrograms: [
      {
        title: "Community Safety Initiative",
        description:
          "Collaborative program with local law enforcement to enhance community safety awareness and prevention.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 3000,
        actualBeneficiaries: 1800,
      },
    ],
    implementedProjects: [
      {
        title: "Crime Prevention Seminar",
        date: "March 5, 2024",
        targetBeneficiaries: 300,
        actualBeneficiaries: 285,
        location: "Various Barangays",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 2,
      implementedProjects: {
        total: 15,
        target: 18,
        completed: 12,
        ongoing: 3,
        totalBeneficiaries: {
          target: 3000,
          actual: 1800,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 250 },
      { month: "Feb", beneficiaries: 320 },
      { month: "Mar", beneficiaries: 285 },
    ],
  },
  dte: {
    slug: "dte",
    name: "Department of Teacher Education",
    description:
      "Shaping educators who inspire and transform lives through quality teaching",
    academicPrograms: {
      active: [
        {
          code: "BSED",
          name: "Bachelor of Secondary Education",
          students: 420,
          yearStarted: 1985,
        },
        {
          code: "BEED",
          name: "Bachelor of Elementary Education",
          students: 380,
          yearStarted: 1985,
        },
        {
          code: "BPED",
          name: "Bachelor of Physical Education",
          students: 310,
          yearStarted: 1990,
        },
        {
          code: "BTVTED",
          name: "Bachelor of Technical-Vocational Teacher Education",
          students: 280,
          yearStarted: 2005,
        },
      ],
      inactive: [
        {
          code: "BSNED",
          name: "Bachelor of Special Needs Education",
          yearStarted: 2000,
          yearEnded: 2015,
          lastGraduates: 50,
        },
      ],
    },
    bannerPrograms: [
      {
        title: "Future Teachers Development Program",
        description:
          "Comprehensive training program for aspiring educators focusing on modern teaching methodologies and digital literacy.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 4000,
        actualBeneficiaries: 2800,
      },
    ],
    implementedProjects: [
      {
        title: "Digital Teaching Workshop",
        date: "March 1, 2024",
        targetBeneficiaries: 200,
        actualBeneficiaries: 195,
        location: "Main Campus",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 3,
      implementedProjects: {
        total: 20,
        target: 25,
        completed: 16,
        ongoing: 4,
        totalBeneficiaries: {
          target: 4000,
          actual: 2800,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 350 },
      { month: "Feb", beneficiaries: 420 },
      { month: "Mar", beneficiaries: 195 },
    ],
  },
  dtp: {
    slug: "dtp",
    name: "Department of Technical Programs",
    description:
      "Developing skilled professionals through hands-on technical education",
    academicPrograms: {
      active: [
        {
          code: "BSIT",
          name: "Bachelor of Science in Information Technology",
          students: 340,
          yearStarted: 2000,
        },
        {
          code: "BSCPE",
          name: "Bachelor of Science in Computer Engineering",
          students: 280,
          yearStarted: 2005,
        },
      ],
      inactive: [],
    },
    bannerPrograms: [
      {
        title: "Technical Skills Enhancement Program",
        description:
          "Comprehensive technical training program focusing on industry-relevant skills and certifications.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 2500,
        actualBeneficiaries: 1600,
      },
    ],
    implementedProjects: [
      {
        title: "Industrial Skills Workshop",
        date: "March 8, 2024",
        targetBeneficiaries: 200,
        actualBeneficiaries: 185,
        location: "Technical Training Center",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 2,
      implementedProjects: {
        total: 14,
        target: 16,
        completed: 10,
        ongoing: 4,
        totalBeneficiaries: {
          target: 2500,
          actual: 1600,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 160 },
      { month: "Feb", beneficiaries: 190 },
      { month: "Mar", beneficiaries: 185 },
    ],
  },
  shs: {
    slug: "shs",
    name: "Senior High School Department",
    description:
      "Preparing students for higher education through comprehensive senior high school programs",
    academicPrograms: {
      active: [
        {
          code: "STEM",
          name: "Science, Technology, Engineering, and Mathematics",
          students: 520,
          yearStarted: 2016,
        },
        {
          code: "ABM",
          name: "Accountancy, Business, and Management",
          students: 480,
          yearStarted: 2016,
        },
        {
          code: "HUMSS",
          name: "Humanities and Social Sciences",
          students: 320,
          yearStarted: 2016,
        },
      ],
      inactive: [],
    },
    bannerPrograms: [
      {
        title: "College Readiness Program",
        description:
          "Comprehensive program preparing senior high school students for college through academic enhancement and career guidance.",
        status: "Active",
        yearStarted: 2022,
        targetBeneficiaries: 1500,
        actualBeneficiaries: 980,
      },
    ],
    implementedProjects: [
      {
        title: "Career Orientation Seminar",
        date: "March 12, 2024",
        targetBeneficiaries: 250,
        actualBeneficiaries: 230,
        location: "Main Campus",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 3,
      implementedProjects: {
        total: 10,
        target: 12,
        completed: 8,
        ongoing: 2,
        totalBeneficiaries: {
          target: 1500,
          actual: 980,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 210 },
      { month: "Feb", beneficiaries: 180 },
      { month: "Mar", beneficiaries: 230 },
    ],
  },
  alumni: {
    slug: "alumni",
    name: "Alumni Department",
    description:
      "Fostering lifelong connections and professional development for our graduates",
    academicPrograms: {
      active: [],
      inactive: [],
    },
    bannerPrograms: [
      {
        title: "Alumni Mentorship Network",
        description:
          "Connecting successful alumni with current students for career guidance and professional development.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 1000,
        actualBeneficiaries: 650,
      },
    ],
    implementedProjects: [
      {
        title: "Alumni Homecoming 2024",
        date: "February 25, 2024",
        targetBeneficiaries: 500,
        actualBeneficiaries: 420,
        location: "Main Campus",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 1,
      implementedProjects: {
        total: 8,
        target: 10,
        completed: 6,
        ongoing: 2,
        totalBeneficiaries: {
          target: 1000,
          actual: 650,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 150 },
      { month: "Feb", beneficiaries: 420 },
      { month: "Mar", beneficiaries: 80 },
    ],
  },
  ntp: {
    slug: "ntp",
    name: "Non-Teaching Personnel Department",
    description:
      "Supporting professional growth and development of administrative and support staff",
    academicPrograms: {
      active: [],
      inactive: [],
    },
    bannerPrograms: [
      {
        title: "Staff Excellence Program",
        description:
          "Comprehensive professional development initiative focusing on administrative skills, digital literacy, and service excellence for non-teaching staff.",
        status: "Active",
        yearStarted: 2023,
        targetBeneficiaries: 500,
        actualBeneficiaries: 320,
      },
    ],
    implementedProjects: [
      {
        title: "Administrative Systems Training",
        date: "March 18, 2024",
        targetBeneficiaries: 100,
        actualBeneficiaries: 95,
        location: "Main Administrative Building",
        status: "Completed",
      },
    ],
    stats: {
      totalPrograms: 1,
      implementedProjects: {
        total: 8,
        target: 10,
        completed: 6,
        ongoing: 2,
        totalBeneficiaries: {
          target: 500,
          actual: 320,
        },
      },
    },
    analyticsData: [
      { month: "Jan", beneficiaries: 85 },
      { month: "Feb", beneficiaries: 75 },
      { month: "Mar", beneficiaries: 95 },
    ],
  },
};

export const getDepartmentData = (slug: string): DepartmentData | undefined => {
  return departmentsData[slug];
};
