// prisma/seed/index.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.academicProgram.deleteMany();
  await prisma.department.deleteMany();

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

  // Seed academic programs
  const academicPrograms = [
    // DAE Programs
    {
      name: "Bachelor of Science in Accountancy",
      abbreviation: "BSA",
      description:
        "Comprehensive program preparing students for careers in accounting, auditing, and financial management with emphasis on CPA licensure.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DAE"),
    },
    {
      name: "Bachelor of Science in Management Accounting",
      abbreviation: "BSMA",
      description:
        "Program focusing on management accounting, financial analysis, and strategic business decision-making.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DAE"),
    },

    // DASE Programs
    {
      name: "Bachelor of Arts in Political Science",
      abbreviation: "AB POLSCI",
      description:
        "Program studying political theory, governance, and public policy analysis.",
      totalStudents: 150,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
    },
    {
      name: "Bachelor of Arts in Communication",
      abbreviation: "AB COM",
      description:
        "Program developing expertise in mass communication, media production, and strategic communication.",
      totalStudents: 160,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
    },
    {
      name: "Bachelor of Science in Social Work",
      abbreviation: "BSSW",
      description:
        "Program preparing students for professional social work practice and community development.",
      totalStudents: 140,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
    },
    {
      name: "Bachelor of Science in Psychology",
      abbreviation: "BSP",
      description:
        "Program studying human behavior, mental processes, and psychological theories and applications.",
      totalStudents: 170,
      status: "ACTIVE",
      departmentId: departmentMap.get("DASE"),
    },
    {
      name: "Bachelor of Arts in English",
      abbreviation: "ABENG",
      description:
        "Program focusing on English language, literature, and linguistics.",
      totalStudents: 0,
      status: "INACTIVE",
      departmentId: departmentMap.get("DASE"),
    },

    // DBA Programs
    {
      name: "Bachelor of Science in Business Administration",
      abbreviation: "BSBA",
      description:
        "Program developing business leaders with focus on management, marketing, and entrepreneurship.",
      totalStudents: 190,
      status: "ACTIVE",
      departmentId: departmentMap.get("DBA"),
    },
    {
      name: "Bachelor of Science in Tourism Management",
      abbreviation: "BSTM",
      description:
        "Program preparing professionals for the tourism and hospitality industry.",
      totalStudents: 160,
      status: "ACTIVE",
      departmentId: departmentMap.get("DBA"),
    },

    // DCJE Programs
    {
      name: "Bachelor of Science in Criminology",
      abbreviation: "BSC",
      description:
        "Program preparing students for careers in law enforcement and criminal justice system.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DCJE"),
    },

    // DTE Programs
    {
      name: "Bachelor of Science in Secondary Education",
      abbreviation: "BSED",
      description:
        "Program preparing teachers for secondary education with various specializations.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "Bachelor in Elementary Education",
      abbreviation: "BEED",
      description:
        "Program preparing teachers for elementary education with focus on foundational teaching methods.",
      totalStudents: 170,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "Bachelor of Physical Education",
      abbreviation: "BPED",
      description:
        "Program focusing on physical education, sports science, and athletic development.",
      totalStudents: 150,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "Bachelor of Technical Vocational Teacher Education",
      abbreviation: "BTVTED",
      description:
        "Program preparing educators for technical and vocational education.",
      totalStudents: 140,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTE"),
    },
    {
      name: "Bachelor of Science in Nursing Education",
      abbreviation: "BSNED",
      description:
        "Program combining nursing and education principles for healthcare education.",
      totalStudents: 0,
      status: "INACTIVE",
      departmentId: departmentMap.get("DTE"),
    },

    // DTP Programs
    {
      name: "Bachelor of Science in Information Technology",
      abbreviation: "BSIT",
      description:
        "Program focusing on information systems, software development, and IT infrastructure.",
      totalStudents: 200,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTP"),
    },
    {
      name: "Bachelor of Science in Computer Engineering",
      abbreviation: "BSCPE",
      description:
        "Program combining computer science and electronic engineering principles.",
      totalStudents: 180,
      status: "ACTIVE",
      departmentId: departmentMap.get("DTP"),
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
