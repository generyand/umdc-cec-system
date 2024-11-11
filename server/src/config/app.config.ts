import dotenv from "dotenv";
import sourceMapSupport from "source-map-support";

export function initializeConfig() {
  dotenv.config();

  if (process.env.NODE_ENV === "development") {
    sourceMapSupport.install();
    console.log("Source maps enabled for development");
  }

  return {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV,
  };
}
