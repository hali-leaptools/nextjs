import { sql } from "drizzle-orm";
import { check, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const roomsTable = sqliteTable("rooms_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  imageUrl: text().notNull(),
  imagePreviewUrl: text().notNull(),
  ownerId: int().references(() => usersTable.id),
  createdAt: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const communitiesTable = sqliteTable(
  "community_table",
  {
    id: int().primaryKey({ autoIncrement: true }),
    roomId: int().references(() => roomsTable.id),
    authorId: int().references(() => usersTable.id),
    products: int().notNull(),
    createdAt: text()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    check("products_check1", sql`${table.products} BETWEEN 1 AND 10`),
  ],
);
