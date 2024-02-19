import { sql } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const review = mySqlTable("review", {
  id: int("id").autoincrement().primaryKey(),
  restaurantName: varchar("restaurantName", { length: 256 }),
  reviewDescription: varchar("reviewText", { length: 256 }),
  stars: int("stars").default(5),
  price: varchar("price", { length: 256 }),
  date: varchar("date", { length: 256 }),
  displayName: varchar("displayName", { length: 256 }),
  username: varchar("username", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
