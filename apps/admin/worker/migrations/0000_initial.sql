CREATE TABLE `sites` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `domain` text NOT NULL,
  `ga4_id` text,
  `gtm_id` text,
  `adtraction_program_id` text,
  `created_at` integer NOT NULL
);

CREATE UNIQUE INDEX `sites_domain_unique` ON `sites` (`domain`);

CREATE TABLE `metrics_snapshots` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `site_id` integer NOT NULL REFERENCES `sites`(`id`),
  `date` text NOT NULL,
  `clicks` integer NOT NULL DEFAULT 0,
  `impressions` integer NOT NULL DEFAULT 0,
  `revenue_sek` real NOT NULL DEFAULT 0,
  `period_type` text NOT NULL DEFAULT 'daily'
);

CREATE INDEX `metrics_site_date_idx` ON `metrics_snapshots` (`site_id`, `date`);
