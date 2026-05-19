const now = Date.now();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMetrics(siteId: number, baseClicks: number, baseImpressions: number) {
  const today = new Date();
  const statements: string[] = [];

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    const seasonMultiplier = date.getMonth() >= 3 && date.getMonth() <= 8 ? 1.2 : 0.9;
    const trendMultiplier = 1 + (365 - i) / 1000;

    const clicks = Math.round(
      baseClicks * weekendMultiplier * seasonMultiplier * trendMultiplier * (0.7 + Math.random() * 0.6)
    );
    const impressions = Math.round(
      baseImpressions * weekendMultiplier * seasonMultiplier * trendMultiplier * (0.7 + Math.random() * 0.6)
    );
    const conversionRate = 0.02 + Math.random() * 0.03;
    const avgOrderValue = 150 + Math.random() * 100;
    const revenue = Math.round(clicks * conversionRate * avgOrderValue * 100) / 100;

    statements.push(
      `INSERT INTO metrics_snapshots (site_id, date, clicks, impressions, revenue_sek, period_type) VALUES (${siteId}, '${dateStr}', ${clicks}, ${impressions}, ${revenue}, 'daily');`
    );
  }

  return statements;
}

const sql = `
-- Insert sites
INSERT INTO sites (name, domain, ga4_id, gtm_id, adtraction_program_id, created_at)
VALUES ('Elsparkcyklar', 'elsparkcyklar.se', 'G-XXXXXXXXXX', 'GTM-WXHXDX9P', 'adtr-001', ${now})
ON CONFLICT(domain) DO NOTHING;

INSERT INTO sites (name, domain, ga4_id, gtm_id, adtraction_program_id, created_at)
VALUES ('Robotdammsugare', 'robotdammsugare.se', 'G-YYYYYYYYYY', 'GTM-YYYYYYYY', 'adtr-002', ${now})
ON CONFLICT(domain) DO NOTHING;

-- Metrics for Elsparkcyklar (site_id = 1)
${generateMetrics(1, 35, 2500).join("\n")}

-- Metrics for Robotdammsugare (site_id = 2)
${generateMetrics(2, 25, 1800).join("\n")}
`;

console.log(sql);
