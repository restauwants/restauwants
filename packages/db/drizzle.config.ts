import type { Config } from "drizzle-kit";

const uri = [
  "mysql://",
  process.env.DB_USERNAME,
  ":",
  process.env.DB_PASSWORD,
  "@",
  process.env.DB_HOST,
  ":",
  process.env.DB_PORT,
  "/",
  process.env.DB_NAME,
].join("");

export default {
  schema: "./src/schema",
  driver: "mysql2",
  dbCredentials: { uri },
  tablesFilter: ["restauwants_*"],
} satisfies Config;
