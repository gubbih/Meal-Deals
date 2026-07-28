#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[deploy] $*"
}

fail() {
  echo "[deploy] ERROR: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

require_cmd git
require_cmd npm

<<<<<<< HEAD
APP_DIR="${APP_DIR:-/home/cheapmea/Meal-Deals}"
STATIC_DIR="${STATIC_DIR:-/public_html}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
REPO_SLUG="${GITHUB_REPOSITORY:-}"
GH_DEPLOY_TOKEN="${GH_DEPLOY_TOKEN:-}"
PASSENGER_RESTART_FILE="${PASSENGER_RESTART_FILE:-}"
=======
APP_DIR="${APP_DIR:-/home/cheapmea/api.cheapmeals.dk}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
REPO_SLUG="${GITHUB_REPOSITORY:-}"
GH_DEPLOY_TOKEN="${GH_DEPLOY_TOKEN:-}"
PASSENGER_RESTART_FILE="${PASSENGER_RESTART_FILE:-tmp/restart.txt}"
>>>>>>> f9aeb75aa2ac42713e5c7f924c84c3053cb46d19

cd "$APP_DIR"

if [ ! -d .git ]; then
  fail "${APP_DIR} is not a git repository"
fi

log "Updating source from GitHub (${DEPLOY_BRANCH})"
if [ -n "$GH_DEPLOY_TOKEN" ] && [ -n "$REPO_SLUG" ]; then
  AUTHED_REMOTE="https://x-access-token:${GH_DEPLOY_TOKEN}@github.com/${REPO_SLUG}.git"
  git fetch "$AUTHED_REMOTE" "$DEPLOY_BRANCH" --prune
  git checkout -B "$DEPLOY_BRANCH"
  git reset --hard FETCH_HEAD
else
  git fetch origin "$DEPLOY_BRANCH" --prune
  git checkout "$DEPLOY_BRANCH"
  git reset --hard "origin/$DEPLOY_BRANCH"
fi

log "Installing dependencies (dev mode for build tools)"
export NODE_ENV=development
if npm ci --include=dev; then
  log "npm ci completed"
else
  log "npm ci failed (likely lock mismatch), falling back to npm install"
  npm install --include=dev
fi

log "Building application"
npm run build

<<<<<<< HEAD
if [ ! -d build ]; then
  fail "Build output directory not found: $APP_DIR/build"
fi

log "Deploying static build to ${STATIC_DIR}"
mkdir -p "$STATIC_DIR"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --filter='P .htaccess' \
    --filter='P .well-known' \
    build/ "$STATIC_DIR/"
else
  # Fallback when rsync is unavailable: preserve critical root entries.
  find "$STATIC_DIR" -mindepth 1 -maxdepth 1 \
    ! -name '.htaccess' \
    ! -name '.well-known' \
    -exec rm -rf {} +
  cp -a build/. "$STATIC_DIR/"
fi

=======
>>>>>>> f9aeb75aa2ac42713e5c7f924c84c3053cb46d19
log "Switching to production mode and pruning dev dependencies"
export NODE_ENV=production
npm prune --omit=dev

<<<<<<< HEAD
if [ -n "${PASSENGER_RESTART_FILE:-}" ]; then
  log "Restarting app process"
  mkdir -p "$(dirname "$PASSENGER_RESTART_FILE")"
  touch "$PASSENGER_RESTART_FILE"
fi
=======
log "Restarting Passenger"
mkdir -p "$(dirname "$PASSENGER_RESTART_FILE")"
touch "$PASSENGER_RESTART_FILE"
>>>>>>> f9aeb75aa2ac42713e5c7f924c84c3053cb46d19

log "Deployment completed successfully"
