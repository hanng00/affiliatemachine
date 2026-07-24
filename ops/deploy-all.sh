#!/usr/bin/env bash
# Deploy every site + the admin worker in one shot.
#
# Gate-first: typecheck + build ALL targets before deploying ANY of them, so a
# red build never results in a half-deployed portfolio. Deploys run only after
# every gate passes.
#
# Usage:
#   bun run deploy:all                 # gate + deploy everything
#   ops/deploy-all.sh --check          # gate only, no deploy (dry run)
#   ops/deploy-all.sh elsparkcyklar    # gate + deploy a single site (+ admin skipped)
set -euo pipefail

cd "$(dirname "$0")/.."

SITES=(robotdammsugare elsparkcyklar bilforsakringar solceller bastaelcykeln samlalanet)
CHECK_ONLY=false
ONLY_SITE=""

for arg in "$@"; do
  case "$arg" in
    --check) CHECK_ONLY=true ;;
    *) ONLY_SITE="$arg" ;;
  esac
done

if [[ -n "$ONLY_SITE" ]]; then
  SITES=("$ONLY_SITE")
fi

log() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()  { printf "\033[1;32m✓ %s\033[0m\n" "$1"; }
die() { printf "\033[1;31m✗ %s\033[0m\n" "$1" >&2; exit 1; }

# --- Gate: typecheck + build every site (no deploy yet) ---
log "Gate: typecheck + build (${SITES[*]})"
for site in "${SITES[@]}"; do
  [[ -d "apps/$site" ]] || die "unknown site: apps/$site"
  printf "  • %s typecheck… " "$site"
  bun run --cwd "apps/$site" typecheck >/dev/null 2>&1 || die "$site typecheck failed (run: bun run --cwd apps/$site typecheck)"
  printf "build… "
  bun run --cwd "apps/$site" build >/dev/null 2>&1 || die "$site build failed (run: bun run --cwd apps/$site build)"
  ok "$site"
done

# Admin worker is gated too (only when deploying the full portfolio).
if [[ -z "$ONLY_SITE" ]]; then
  printf "  • admin typecheck… "
  bun run --cwd apps/admin typecheck >/dev/null 2>&1 || die "admin typecheck failed"
  ok "admin"
fi

if [[ "$CHECK_ONLY" == true ]]; then
  log "All gates green (--check: skipping deploy)."
  exit 0
fi

# --- Deploy ---
log "Deploying sites"
for site in "${SITES[@]}"; do
  printf "  • deploying %s…\n" "$site"
  bun run --cwd "apps/$site" deploy || die "$site deploy failed"
  ok "$site deployed"
done

if [[ -z "$ONLY_SITE" ]]; then
  log "Deploying admin worker (binds GOOGLE_OAUTH_* → live metrics)"
  bun run --cwd apps/admin worker:deploy || die "admin worker deploy failed"
  ok "admin worker deployed"
fi

log "Done."
