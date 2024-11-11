import { DatabaseService } from "./database.service.js";
import type { Server } from "http";

export async function testDatabaseConnection() {
  try {
    const result = await DatabaseService.query("SELECT NOW()");
    console.log("✅ Database connection successful");
    console.log("Server time from DB:", result.rows[0].now);
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
    await DatabaseService.close();
    process.exit(0);
  });
}
