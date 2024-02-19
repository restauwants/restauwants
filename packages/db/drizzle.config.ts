import type { Config } from "drizzle-kit";

import { isLocal } from "./src/local";

const uri = [
  "mysql://",
  process.env.DB_USERNAME,
  ":",
  process.env.DB_PASSWORD,
  "@",
  process.env.DB_HOST,
  ":",
  isLocal ? process.env.LOCAL_UNPROXIED_DB_PORT : process.env.DB_PORT,
  "/",
  process.env.DB_NAME,
  isLocal ? "" : '?ssl={"rejectUnauthorized":true}',
].join("");

export default {
  schema: "./src/schema",
  driver: "mysql2",
  dbCredentials: { uri },
  tablesFilter: ["t3turbo_*"],
} satisfies Config;
