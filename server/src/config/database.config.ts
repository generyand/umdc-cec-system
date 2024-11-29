import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
// import fs from "fs";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "umdc_cecms_dev",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  // ssl: process.env.DB_SSL === "require",
  ssl: {
    rejectUnauthorized: false, // for development
    // for production:
    // ca: fs.readFileSync("src/certs/ca.pem"),
    // ca: process.env.DB_CA_CERT
    //   ? Buffer.from(process.env.DB_CA_CERT, "base64").toString()
    //   : undefined,
  },
};

console.log("dbConfig", dbConfig);

const pool = new Pool(dbConfig);

// Add error handling
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
