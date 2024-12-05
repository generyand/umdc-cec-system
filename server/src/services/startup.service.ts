import { PrismaClient } from "@prisma/client";
import type { Server } from "http";

const prisma = new PrismaClient();

export async function testDatabaseConnection() {
  try {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
    console.log("✅ Database connection successful");
    console.log("Server time from DB:", result[0].now);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

export function setupGracefulShutdown(server: Server) {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
    });

    await prisma.$disconnect();
    console.log("Database connection closed");

    process.exit(0);
  });
}
