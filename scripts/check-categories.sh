#!/usr/bin/env bash
#
# check-categories.sh — type-check + build every category overlay (or a few).
#
# Usage:
#   scripts/check-categories.sh                 # check all categories
#   scripts/check-categories.sh wedding saas    # check specific categories
#
# Creates a throwaway site at sites/.catcheck (git-ignored, npm install runs
# once), then for each category: resets src/ + index.html to the template,
# applies the overlay, replaces the placeholder and runs `npm run build`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$ROOT/template"
CATEGORIES="$ROOT/categories"
CHECK="$ROOT/sites/.catcheck"

if [[ $# -gt 0 ]]; then
  CATS=("$@")
else
  mapfile -t CATS < <(find "$CATEGORIES" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort)
fi
if [[ ${#CATS[@]} -eq 0 ]]; then
  echo "No categories found in $CATEGORIES" >&2
  exit 1
fi

# One-time throwaway site (deps only — src gets swapped per category).
if [[ ! -d "$CHECK/node_modules" ]]; then
  echo "→ Preparing throwaway site at sites/.catcheck (npm install once)..."
  mkdir -p "$CHECK"
  cp -R "$TEMPLATE/." "$CHECK/"
  grep -rl --binary-files=without-match '__SITE_NAME__' "$CHECK" | while read -r f; do
    sed -i "s/__SITE_NAME__/catcheck/g" "$f"
  done
  ( cd "$CHECK" && npm install --no-audit --no-fund )
fi

FAILED=()
for cat in "${CATS[@]}"; do
  if [[ ! -d "$CATEGORIES/$cat" ]]; then
    echo "✗ $cat — no such category"; FAILED+=("$cat"); continue
  fi
  echo ""
  echo "── Checking category: $cat ──"
  rm -rf "$CHECK/src" "$CHECK/index.html"
  cp -R "$TEMPLATE/src" "$CHECK/src"
  cp "$TEMPLATE/index.html" "$CHECK/index.html"
  rm -f "$CHECK/src/components/Hero.tsx"
  cp -R "$CATEGORIES/$cat/." "$CHECK/"
  grep -rl --binary-files=without-match '__SITE_NAME__' "$CHECK/src" "$CHECK/index.html" 2>/dev/null | while read -r f; do
    sed -i "s/__SITE_NAME__/catcheck/g" "$f"
  done
  if ( cd "$CHECK" && npm run build > /tmp/catcheck-$cat.log 2>&1 ); then
    echo "✓ $cat builds"
  else
    echo "✗ $cat FAILED — tail of /tmp/catcheck-$cat.log:"
    tail -n 25 "/tmp/catcheck-$cat.log"
    FAILED+=("$cat")
  fi
done

echo ""
if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "❌ ${#FAILED[@]} category(ies) failed: ${FAILED[*]}"
  exit 1
fi
echo "✅ All ${#CATS[@]} category(ies) build."
