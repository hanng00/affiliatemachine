import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "dist");

// Single-route tool. The page prerenders fully so it ranks without JS; the
// interactive loan calculator hydrates on top as a client-only island.
const routes = ["/"];

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
