import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const demos = sqliteTable("synera_demos", {
  userId: text("user_id").primaryKey(),
  state: text("state").notNull(),
  version: integer("version").notNull().default(0),
});
