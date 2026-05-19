import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  domain: text("domain").notNull().unique(),
  ga4Id: text("ga4_id"),
  gtmId: text("gtm_id"),
  adtractionProgramId: text("adtraction_program_id"),
  costMonthly: real("cost_monthly").notNull().default(0),
  status: text("status", { enum: ["healthy", "warning", "error"] })
    .notNull()
    .default("healthy"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const metricsSnapshots = sqliteTable("metrics_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteId: integer("site_id")
    .notNull()
    .references(() => sites.id),
  date: text("date").notNull(),
  clicks: integer("clicks").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  revenueSek: real("revenue_sek").notNull().default(0),
  revenuePendingSek: real("revenue_pending_sek").notNull().default(0),
  periodType: text("period_type", { enum: ["daily", "weekly", "monthly"] })
    .notNull()
    .default("daily"),
});

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type MetricsSnapshot = typeof metricsSnapshots.$inferSelect;
export type NewMetricsSnapshot = typeof metricsSnapshots.$inferInsert;
