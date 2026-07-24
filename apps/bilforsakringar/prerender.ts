import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "dist");

// Static content routes are prerendered (full crawlable HTML). /s/:id is a
// dynamic, user-generated search-result route (noindex) and stays client-rendered.
const routes = [
  "/",
  "/jamfor",
  "/basta-bilforsakring-2026",
  "/forsakringsbolag",
  "/forsakringsbolag/if",
  "/forsakringsbolag/trygg-hansa",
  "/forsakringsbolag/gjensidige",
  "/forsakringsbolag/folksam",
  "/forsakringsbolag/lansforsakringar",
  "/guide",
  "/forstagangsbil",
  "/om-oss",
  "/kontakt",
  "/integritetspolicy",
];

const template = fs.readFileSync(path.resolve(dist, "index.html"), "utf-8");
const { render } = await import(
  path.resolve(__dirname, "dist-server/entry-server.js")
);

for (const url of routes) {
  const { html, head } = render(url);

  const page = template
    .replace("<!--app-head-->", head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const filePath =
    url === "/"
      ? path.resolve(dist, "index.html")
      : path.resolve(dist, `.${url}`, "index.html");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, page);
  console.log(`prerendered ${url} -> ${path.relative(dist, filePath)}`);
}

// SPA fallback shell for dynamic routes (/s/:id). It keeps an EMPTY #root so the
// client hydrates cleanly without a server/client markup mismatch (the home page
// was prerendered into index.html and must not be reused for other routes).
const shell = template.replace("<!--app-head-->", "");
fs.writeFileSync(path.resolve(dist, "spa.html"), shell);
console.log("wrote spa.html (empty shell for dynamic routes)");
