// prisma/seed/index.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.department.deleteMany();

  // Seed departments
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

  for (const dept of departments) {
    const department = await prisma.department.create({
      data: dept,
    });
    console.log(
      `Created department: ${department.name} (${department.abbreviation})`
    );
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);

    // Exit the process with an error code
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
