import { pgTable, serial, varchar, text, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Enum for user roles
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table - stores all demo videos (backgrounds, clips, etc)
 */
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  duration: integer("duration"), // in seconds
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Missions table - Client projects (e.g. Declics, L'Oreal)
 */
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(), // e.g. "Declics Project"
  clientName: varchar("clientName", { length: 255 }), // e.g. "Declics"
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  isPublished: boolean("isPublished").default(false).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;

/**
 * Workflows table - Technical workflows linked to missions
 */
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  missionId: integer("missionId").references(() => missions.id),
  title: varchar("title", { length: 255 }).notNull(), // e.g. "Auto-prompt Pipeline"
  description: text("description"),
  toolsUsed: text("toolsUsed"), // JSON or comma-separated list of tools
  demoUrl: text("demoUrl"), // Link to Vibe/AI Studio demo
  codeSnippet: text("codeSnippet"), // Optional code block
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

/**
 * Experience Posts table - R&D, Knowledge Base, Notebooks
 */
export const experiencePosts = pgTable("experience_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  content: text("content"), // Rich text or Markdown
  type: varchar("type", { length: 50 }).notNull(), // 'notebook', 'video', 'podcast', 'article'
  mediaUrl: text("mediaUrl"), // URL to NotebookLM, YouTube, etc.
  tags: text("tags"), // JSON or comma-separated tags
  isPublished: boolean("isPublished").default(false).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ExperiencePost = typeof experiencePosts.$inferSelect;
export type InsertExperiencePost = typeof experiencePosts.$inferInsert;

/**
 * Services table - stores service offerings and pricing
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  features: text("features").notNull(), // JSON array of features
  priceDescription: varchar("priceDescription", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
