import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

// #### Auth Schema ####

export const users = mySqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  reviews: many(reviews),
  userData: one(userData),
  comments: many(comments),
}));

export const accounts = mySqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<"oauth" | "oidc" | "email">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mySqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mySqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// #### Model Schema ####

export const reviews = mySqlTable("review", {
  id: int("id").notNull().primaryKey(),
  userId: int("userId").notNull(),
  restaurantId: int("restaurantId").notNull(),
  rating: int("rating").notNull(),
  price: int("price").notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  visitedAt: timestamp("visitedAt").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users),
  restaurant: one(restaurants),
}));

export const userData = mySqlTable("userData", {
  id: int("id").notNull().primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
});

export const userDataRelations = relations(userData, ({ one }) => ({
  user: one(users),
}));

export const restaurants = mySqlTable("restaurant", {
  id: int("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const restaurantRelations = relations(restaurants, ({ many }) => ({
  reviews: many(reviews),
}));

export const comments = mySqlTable("comment", {
  id: int("id").notNull().primaryKey(),
  userId: int("userId").notNull(),
  reviewId: int("reviewId").notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users),
  review: one(reviews),
}));
