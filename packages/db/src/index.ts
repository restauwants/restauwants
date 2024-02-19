import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { isLocal } from "./local";
import * as schema from "./schema";

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const config = isLocal
  ? {
      url: [
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

const connection = connect(config);

export const db = drizzle(connection, { schema });
