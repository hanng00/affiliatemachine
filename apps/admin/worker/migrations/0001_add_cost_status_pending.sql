-- Add cost_monthly and status to sites
ALTER TABLE `sites` ADD COLUMN `cost_monthly` real NOT NULL DEFAULT 0;
ALTER TABLE `sites` ADD COLUMN `status` text NOT NULL DEFAULT 'healthy';

-- Add revenue_pending_sek to metrics_snapshots
ALTER TABLE `metrics_snapshots` ADD COLUMN `revenue_pending_sek` real NOT NULL DEFAULT 0;
