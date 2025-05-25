// prisma/seed/index.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.bannerProgram.deleteMany();
  await prisma.academicProgram.deleteMany();
  await prisma.department.deleteMany();
  await prisma.partnerCommunity.deleteMany();
  await prisma.schoolYear.deleteMany();

  // Seed departments first (your existing department seed)
  const departments = [
    {
      name: "Department of Accounting Education",
      abbreviation: "DAE",
      description:
        "Specializes in comprehensive accounting education, preparing students for professional careers in financial accounting, auditing, taxation, and financial management with emphasis on current accounting practices and technologies.",
    },
    {
      name: "Department of Arts and Sciences Education",
      abbreviation: "DASE",
      description:
        "Offers a strong foundation in liberal arts and sciences, promoting critical thinking, research skills, and interdisciplinary studies across natural sciences, social sciences, and humanities.",
    },
    {
      name: "Department of Business Administration",
      abbreviation: "DBA",
      description:
        "Develops future business leaders through programs in management, entrepreneurship, and corporate administration, emphasizing both theoretical knowledge and practical business applications.",
    },
    {
      name: "Department of Criminal Justice Education",
      abbreviation: "DCJE",
      description:
        "Provides comprehensive education in criminal justice, law enforcement, and criminology, preparing students for careers in law enforcement, corrections, security management, and related fields of public safety and justice administration.",
    },
    {
      name: "Department of Teacher Education",
      abbreviation: "DTE",
      description:
        "Prepares future educators through comprehensive teacher training programs, focusing on modern pedagogical methods, educational technology, and practical teaching experience in various educational settings.",
    },
    {
      name: "Department of Technical Programs",
      abbreviation: "DTP",
      description:
        "Provides industry-driven technical education and training programs focused on developing skilled professionals in various technical fields including information technology, engineering technology, and industrial trades.",
    },
    {
      name: "Senior High School",
      abbreviation: "SHS",
      description:
        "Offers academic, technical-vocational-livelihood, sports, and arts and design tracks to prepare students for tertiary education, middle-level skills development, employment, and entrepreneurship.",
    },
  ];

  // Create departments and store their IDs
  const departmentMap = new Map();
  for (const dept of departments) {
    const department = await prisma.department.create({
      data: dept,
    });
    departmentMap.set(department.abbreviation, department.id);
    console.log(
      `Created department: ${department.name} (${department.abbreviation})`
    );
  }

  const bannerPrograms = [
    // DAE Programs
    {
      name: "KASUSYO",
      abbreviation: "KASUSYO",
      description:
        "Community outreach program focusing on financial literacy and basic accounting education for local communities.",
      status: "ACTIVE",
      yearStarted: 2013,
      departmentId: departmentMap.get("DAE"),
    },

    // DASE Programs
    {
      name: "Kabataan Isulong Lahing Pinoy",
      abbreviation: "KISLAP",
      description:
        "Youth development program promoting Filipino culture and values through educational activities.",
      status: "ACTIVE",
      yearStarted: 2012,
      departmentId: departmentMap.get("DASE"),
    },
    {
      name: "Healing of Emotional and Mental Adversities for Renewed Townsmen",
      abbreviation: "UM-HEART",
      description:
        "Mental health awareness and support program for local communities.",
      status: "ACTIVE",
      yearStarted: 2022,
      departmentId: departmentMap.get("DASE"),
    },

    // DBA Programs
    {
      name: "UM at Ako SIgurado sa Negosyo Aasenso",
      abbreviation: "UMASINSO",
      description:
        "Entrepreneurship development program supporting local business initiatives.",
      status: "ACTIVE",
      yearStarted: 2012,
      departmentId: departmentMap.get("DBA"),
    },
    {
      name: "TURISMO MISMO",
      abbreviation: "TURISMO MISMO",
      description:
        "Tourism promotion and development program for local destinations.",
      status: "ACTIVE",
      yearStarted: 2023,
      departmentId: departmentMap.get("DBA"),
    },

    // DCJE Programs
    {
      name: "Barangay ay TUlungan ng TAmang DEPENSA",
      abbreviation: "BATUTA DEPENSA",
      description: "Community safety and security awareness program.",
      status: "ACTIVE",
      yearStarted: 2012,
      departmentId: departmentMap.get("DCJE"),
    },

    // DTE Programs
    {
      name: "Alagaan Natin ang Kabataan ng Umunlad at Mapagkalinga",
      abbreviation: "ANAK NG UM",
      description: "Child education and development support program.",
      status: "ACTIVE",
      yearStarted: 2012,
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "MUNTING PAARALAN",
      abbreviation: "MUNTING PAARALAN",
      description: "Alternative learning program for underprivileged children.",
      status: "ACTIVE",
      yearStarted: 2013,
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "PROJECT WELLNESS",
      abbreviation: "PROJECT WELLNESS",
      description: "Health and wellness education program for schools.",
      status: "ACTIVE",
      yearStarted: 2023,
      departmentId: departmentMap.get("DTE"),
    },

    // DTP Programs
    {
      name: "Baranggay at UM Magka-agapay sa Tamang Impormasyon para sa Kaunlaran",
      abbreviation: "BUMATI KA",
      description: "Technology literacy and information dissemination program.",
      status: "ACTIVE",
      yearStarted: 2012,
      departmentId: departmentMap.get("DTP"),
    },
    {
      name: "UM at Barangay ay Uunlad na May Bagong Teknolohiya",
      abbreviation: "UMUNA",
      description: "Community technology advancement and training program.",
      status: "ACTIVE",
      yearStarted: 2022,
      departmentId: departmentMap.get("DTP"),
    },
  ];

  // Create banner programs and store their IDs
  const bannerProgramMap = new Map();
  for (const program of bannerPrograms) {
    const bannerProgram = await prisma.bannerProgram.create({
      data: program,
    });
    bannerProgramMap.set(bannerProgram.abbreviation, bannerProgram.id);
    console.log(
      `Created banner program: ${bannerProgram.name} (${bannerProgram.abbreviation})`
    );
  }

  const academicPrograms = [
    // KASUSYO Programs
    {
      name: "Bachelor of Science in Accountancy",
      abbreviation: "BSA",
      description:
        "Comprehensive program preparing students for careers in accounting, auditing, and financial management with emphasis on CPA licensure.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DAE"),
      bannerProgramId: bannerProgramMap.get("KASUSYO"),
    },
    {
      name: "Bachelor of Science in Management Accounting",
      abbreviation: "BSMA",
      description:
        "Program focusing on management accounting, financial analysis, and strategic business decision-making.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DAE"),
      bannerProgramId: bannerProgramMap.get("KASUSYO"),
    },

    // KISLAP Programs
    {
      name: "Bachelor of Arts in Political Science",
      abbreviation: "AB POLSCI",
      description:
        "Program studying political theory, governance, and public policy analysis.",
      totalStudents: 150,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
      bannerProgramId: bannerProgramMap.get("KISLAP"),
    },
    {
      name: "Bachelor of Arts in Communication",
      abbreviation: "AB COM",
      description:
        "Program developing expertise in mass communication, media production, and strategic communication.",
      totalStudents: 160,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
      bannerProgramId: bannerProgramMap.get("KISLAP"),
    },
    {
      name: "Bachelor of Science in Social Work",
      abbreviation: "BSSW",
      description:
        "Program preparing students for professional social work practice and community development.",
      totalStudents: 80,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
      bannerProgramId: bannerProgramMap.get("KISLAP"),
    },
    {
      name: "Bachelor of Science in English",
      abbreviation: "ABENG",
      description:
        "Program focusing on English language, literature, and communication studies.",
      totalStudents: 0,
      status: "INACTIVE",
      departmentId: departmentMap.get("DASE"),
      bannerProgramId: null,
    },

    // UM-HEART Programs
    {
      name: "Bachelor of Science in Psychology",
      abbreviation: "BSP",
      description:
        "Program studying human behavior, mental processes, and psychological theories and applications.",
      totalStudents: 170,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
      bannerProgramId: bannerProgramMap.get("UM-HEART"),
    },

    // UMASINSO Programs
    {
      name: "Bachelor of Science in Business Administration",
      abbreviation: "BSBA",
      description:
        "Program developing business leaders with focus on management, marketing, and entrepreneurship.",
      totalStudents: 190,
      status: "ACTIVE",
      departmentId: departmentMap.get("DBA"),
      bannerProgramId: bannerProgramMap.get("UMASINSO"),
    },

    // TURISMO MISMO Programs
    {
      name: "Bachelor of Science in Tourism Management",
      abbreviation: "BSTM",
      description:
        "Program preparing professionals for the tourism and hospitality industry.",
      totalStudents: 160,
      status: "ACTIVE",
      departmentId: departmentMap.get("DBA"),
      bannerProgramId: bannerProgramMap.get("TURISMO MISMO"),
    },

    // BATUTA DEPENSA Programs
    {
      name: "Bachelor of Science in Criminology",
      abbreviation: "BSC",
      description:
        "Program preparing students for careers in law enforcement and criminal justice system.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DCJE"),
      bannerProgramId: bannerProgramMap.get("BATUTA DEPENSA"),
    },

    // ANAK NG UM Programs
    {
      name: "Bachelor of Science in Secondary Education",
      abbreviation: "BSED",
      description:
        "Program preparing teachers for secondary education with various specializations.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
      bannerProgramId: bannerProgramMap.get("ANAK NG UM"),
    },

    // MUNTING PAARALAN Programs
    {
      name: "Bachelor in Elementary Education",
      abbreviation: "BEED",
      description:
        "Program preparing teachers for elementary education with focus on foundational teaching methods.",
      totalStudents: 170,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
      bannerProgramId: bannerProgramMap.get("MUNTING PAARALAN"),
    },

    // PROJECT WELLNESS Programs
    {
      name: "Bachelor of Physical Education",
      abbreviation: "BPED",
      description:
        "Program focusing on physical education, sports science, and athletic development.",
      totalStudents: 150,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
      bannerProgramId: bannerProgramMap.get("PROJECT WELLNESS"),
    },
    {
      name: "Bachelor of Science in Special Needs Education",
      abbreviation: "BSNED",
      description:
        "Program preparing teachers for special needs education with focus on inclusive teaching methods.",
      totalStudents: 0,
      status: "INACTIVE",
      departmentId: departmentMap.get("DTE"),
      bannerProgramId: null,
    },
    {
      name: "Bachelor of Technical-Vocational Teacher Education",
      abbreviation: "BTVTED",
      description:
        "Program preparing teachers for technical-vocational education and training.",
      totalStudents: 70,
      status: "INACTIVE",
      departmentId: departmentMap.get("DTE"),
      bannerProgramId: null,
    },

    // BUMATI KA Programs
    {
      name: "Bachelor of Science in Information Technology",
      abbreviation: "BSIT",
      description:
        "Program focusing on information systems, software development, and IT infrastructure.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTP"),
      bannerProgramId: bannerProgramMap.get("BUMATI KA"),
    },

    // UMUNA Programs
    {
      name: "Bachelor of Science in Computer Engineering",
      abbreviation: "BSCPE",
      description:
        "Program combining computer science and electronic engineering principles.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTP"),
      bannerProgramId: bannerProgramMap.get("UMUNA"),
    },
  ];

  // Create academic programs
  for (const program of academicPrograms) {
    const academicProgram = await prisma.academicProgram.create({
      data: program,
    });
    console.log(
      `Created academic program: ${academicProgram.name} (${academicProgram.abbreviation})`
    );
  }

  const communities = [
    {
      name: "Barangay San Miguel",
      communityType: "Barangay",
      address: "San Miguel, Digos City, Davao del Sur",
      adoptionStart: new Date("2023-01-15"),
      adoptionEnd: null,
      status: "ACTIVE",
      contactPerson: "Hon. Maria Santos",
      contactEmail: "sanmiguel.digos@gmail.com",
      contactNumber: "09123456789",
      description:
        "A progressive barangay known for its agricultural activities and strong community engagement in educational programs.",
      islandGroup: "Mindanao",
      region: "Region 11",
      province: "Davao del Sur",
      city: "Digos City",
      postalCode: "8002",
      coordinates: "6.7491° N, 125.3572° E",
      elevationLevel: 32.0,
      population: 5000,
      povertyPopulation: 1000,
      history:
        "Barangay San Miguel has a rich history of community involvement and agricultural development.",
    },
    {
      name: "Barangay Dawis",
      communityType: "Barangay",
      address: "Dawis, Digos City, Davao del Sur",
      adoptionStart: new Date("2023-03-01"),
      adoptionEnd: null,
      status: "ACTIVE",
      contactPerson: "Hon. Pedro Reyes",
      contactEmail: "dawis.digos@gmail.com",
      contactNumber: "09234567890",
      description:
        "A developing barangay with focus on youth development and environmental sustainability initiatives.",
      islandGroup: "Mindanao",
      region: "Region 11",
      province: "Davao del Sur",
      city: "Digos City",
      postalCode: "8002",
      coordinates: "6.7491° N, 125.3572° E",
      elevationLevel: 30.0,
      population: 3000,
      povertyPopulation: 800,
      history:
        "Barangay Dawis is known for its commitment to sustainable development and youth programs.",
    },
    {
      name: "Barangay Ruparan",
      communityType: "Barangay",
      address: "Ruparan, Digos City, Davao del Sur",
      adoptionStart: new Date("2023-02-15"),
      adoptionEnd: null,
      status: "ACTIVE",
      contactPerson: "Hon. Juan Dela Cruz",
      contactEmail: "ruparan.digos@gmail.com",
      contactNumber: "09345678901",
      description:
        "An emerging barangay with strong emphasis on community-based learning and social development programs.",
      islandGroup: "Mindanao",
      region: "Region 11",
      province: "Davao del Sur",
      city: "Digos City",
      postalCode: "8002",
      coordinates: "6.7491° N, 125.3572° E",
      elevationLevel: 28.0,
      population: 4000,
      povertyPopulation: 900,
      history:
        "Barangay Ruparan has a history of fostering community learning and social development.",
    },
  ];

  for (const community of communities) {
    const partnerCommunity = await prisma.partnerCommunity.create({
      data: community,
    });
    console.log(`Created partner community: ${partnerCommunity.name}`);
  }

  // Add school years seeding
  const schoolYears = [
    {
      year: "2023-2024",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-05-31"),
      isCurrent: true,
      status: "ACTIVE"
    },
    {
      year: "2022-2023",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-05-31"),
      isCurrent: false,
      status: "COMPLETED"
    },
    {
      year: "2024-2025",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2025-05-31"),
      isCurrent: false,
      status: "UPCOMING"
    }
  ];

  for (const schoolYear of schoolYears) {
    const createdSchoolYear = await prisma.schoolYear.create({
      data: schoolYear
    });
    console.log(`Created school year: ${createdSchoolYear.year}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
