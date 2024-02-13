import { sql } from "drizzle-orm";
import {
  datetime,
  float,
  int,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const post = mySqlTable("post", {
  id: int("id").autoincrement().primaryKey(),
  restaurantName: varchar("restaurantName", { length: 256 }),
  reviewDescription: varchar("reviewText", { length: 256 }),
  stars: int("stars").default(5),
  price: float("price"),
  date: datetime("date"),
  displayName: varchar("displayName", { length: 256 }),
  username: varchar("username", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
