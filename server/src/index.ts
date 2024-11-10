import express from "express";
import dotenv from "dotenv";
import sourceMapSupport from "source-map-support";

dotenv.config();

// Only enable source maps in development
if (process.env.NODE_ENV === "development") {
  sourceMapSupport.install();
  console.log("Source maps enabled for development");
} else {
  console.log("Source maps disabled for production");
}

console.log(`Current environment: ${process.env.NODE_ENV}`);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
