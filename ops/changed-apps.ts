#!/usr/bin/env bun
/**
 * ops/changed-apps.ts
 *
 * Prints a JSON array of app names (dirs under apps/) affected by a git diff, for
 * the deploy workflow's matrix. An app is affected when a changed file is inside
 * the app, inside a workspace package it depends on (transitively), or is a root
 * file every app builds with (package.json, bun.lock, bunfig.toml, tsconfig.json).
 *
 * Usage:
 *   bun ops/changed-apps.ts <base-sha> [head-sha]   # head defaults to HEAD
 *   bun ops/changed-apps.ts all                     # every app
 */

import { readdirSync, readFileSync, existsSync } from "fs";

const ROOT_FILES = new Set(["package.json", "bun.lock", "bunfig.toml", "tsconfig.json"]);
const WORKSPACE_DIRS = ["apps", "packages", "domains"];

type Pkg = { dir: string; deps: string[] };

const byName = new Map<string, Pkg>();
for (const group of WORKSPACE_DIRS) {
  for (const entry of readdirSync(group)) {
    const file = `${group}/${entry}/package.json`;
    if (!existsSync(file)) continue;
    const json = JSON.parse(readFileSync(file, "utf8"));
    const all = { ...json.dependencies, ...json.devDependencies, ...json.peerDependencies };
    const deps = Object.entries(all)
      .filter(([, v]) => String(v).startsWith("workspace:"))
      .map(([k]) => k);
    byName.set(json.name, { dir: `${group}/${entry}`, deps });
  }
}

const apps = [...byName.values()].filter((p) => p.dir.startsWith("apps/"));

function dirsOf(pkg: Pkg, seen = new Set<string>()): Set<string> {
  if (seen.has(pkg.dir)) return seen;
  seen.add(pkg.dir);
  for (const dep of pkg.deps) {
    const p = byName.get(dep);
    if (p) dirsOf(p, seen);
  }
  return seen;
}

const [base, head = "HEAD"] = process.argv.slice(2);
if (!base) {
  console.error("usage: bun ops/changed-apps.ts <base-sha> [head-sha] | all");
  process.exit(1);
}

let affected: Pkg[];
if (base === "all") {
  affected = apps;
} else {
  const diff = Bun.spawnSync(["git", "diff", "--name-only", base, head]);
  if (diff.exitCode !== 0) {
    console.error(diff.stderr.toString());
    process.exit(1);
  }
  const changed = diff.stdout.toString().split("\n").filter(Boolean);
  const touchesRoot = changed.some((f) => ROOT_FILES.has(f));
  affected = touchesRoot
    ? apps
    : apps.filter((app) => {
        const dirs = dirsOf(app);
        return changed.some((f) => [...dirs].some((d) => f.startsWith(`${d}/`)));
      });
}

console.log(JSON.stringify(affected.map((a) => a.dir.slice("apps/".length)).sort()));
