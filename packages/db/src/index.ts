import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { isLocal } from "./local";
import * as schema from "./schema";

export { schema };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";
export { alias } from "drizzle-orm/mysql-core";

const config = isLocal
  ? {
      uri: [
        "http://",
        process.env.DB_USERNAME,
        ":",
        process.env.DB_PASSWORD,
        "@",
        process.env.DB_HOST,
        ":",
        process.env.DB_PORT,
      ].join(""),
    }
  : {
      host: process.env.DB_HOST!,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
    };

const connection = await mysql.createConnection(config);

export const db = drizzle(connection, { schema, mode: "default" });

export type Database = typeof db;
