import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

import * as schema from "./schema";

export { schema };

export { mySqlTable as tableCreator } from "./schema/table";

export * from "drizzle-orm";
export { alias } from "drizzle-orm/mysql-core";

const config = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: parseInt(process.env.DB_PORT!),
};

const connection = mysql.createConnection(config);

export const db = drizzle(connection, { schema, mode: "default" });

export type Database = typeof db;
