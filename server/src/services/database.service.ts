import pool from "../config/database.config.js";
import { QueryResult } from "pg";

export const DatabaseService = {
  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log("Executed query", { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },

  async getClient() {
    const client = await pool.connect();
    return client;
  },

  async close() {
    await pool.end();
  },
};
