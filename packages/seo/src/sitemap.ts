export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function generateSitemap(baseUrl: string, urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string, options?: { disallow?: string[]; sitemap?: boolean }): string {
  const { disallow = [], sitemap = true } = options || {};

  let content = `User-agent: *
Allow: /
`;

  for (const path of disallow) {
    content += `Disallow: ${path}\n`;
  }

  if (sitemap) {
    content += `\nSitemap: ${baseUrl}/sitemap.xml`;
  }

  return content;
}
