import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { systemPaths, spinePaths } from "./src/config/spine";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "dist");

// Hub + system landings + the programmatic {system}/{kommun} spine. Every page
// prerenders fully so it ranks without JS; the calculator island hydrates on top.
const routes = ["/", ...systemPaths(), ...spinePaths()];

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
