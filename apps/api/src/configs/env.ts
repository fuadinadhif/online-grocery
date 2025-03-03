import { config } from "dotenv";
import { resolve } from "node:path";

const envFile =
  process.env.NODE_ENV === "development" ? ".env" : ".env.production";

config({ path: resolve(import.meta.dirname, `../../${envFile}`) });
