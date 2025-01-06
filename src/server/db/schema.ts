// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `logo-game_${name}`);

export const images = createTable(
  "image",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    isDefault: boolean("is_default").default(false),
    cropX: integer("crop_x"),
    cropY: integer("crop_y"),
    cropWidth: integer("crop_width"),
    cropHeight: integer("crop_height"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
export const gameProgress = createTable(
  "game-progress",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("userId", { length: 256 }).notNull(),
    imageId: integer("image_id").notNull(),
    guessedCorrectly: boolean("guessed_correctly").default(false),
    timeToGuess: integer("time_to_guess"),
    incorrectGuesses: integer("incorrect_guesses").default(0),
    pointsEarned: integer("points_earned").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    imageIdIdx: index("image_id_idx").on(table.imageId),
  }),
);
