#!/usr/bin/env bash
#
# new-site.sh — scaffold a new website into sites/<name> from ./template
#
# Usage:
#   scripts/new-site.sh <site-name> [--no-install]
#
# Example:
#   scripts/new-site.sh acme-landing
#
set -euo pipefail

# Resolve the workspace root (parent of this script's dir) so the script works
# regardless of the directory it's invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$ROOT/template"
SITES="$ROOT/sites"

# --- args -------------------------------------------------------------------
NAME="${1:-}"
INSTALL=1
for arg in "${@:2}"; do
  case "$arg" in
    --no-install) INSTALL=0 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

if [[ -z "$NAME" ]]; then
  echo "Usage: scripts/new-site.sh <site-name> [--no-install]" >&2
  exit 1
fi

# Validate: lowercase letters, digits, dashes (npm-friendly package name)
if [[ ! "$NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Invalid name '$NAME'. Use lowercase letters, digits and dashes, e.g. 'acme-landing'." >&2
  exit 1
fi

DEST="$SITES/$NAME"
if [[ -e "$DEST" ]]; then
  echo "A site already exists at sites/$NAME — choose a different name." >&2
  exit 1
fi
if [[ ! -d "$TEMPLATE" ]]; then
  echo "Template not found at $TEMPLATE" >&2
  exit 1
fi

# --- scaffold ---------------------------------------------------------------
echo "→ Creating sites/$NAME from template..."
mkdir -p "$SITES"
cp -R "$TEMPLATE" "$DEST"

# Replace the __SITE_NAME__ placeholder in all text files.
grep -rl --binary-files=without-match '__SITE_NAME__' "$DEST" | while read -r file; do
  sed -i "s/__SITE_NAME__/$NAME/g" "$file"
done

# --- install ----------------------------------------------------------------
if [[ "$INSTALL" -eq 1 ]]; then
  echo "→ Installing dependencies (npm install)..."
  ( cd "$DEST" && npm install )
else
  echo "→ Skipped npm install (--no-install)."
fi

echo ""
echo "✅ Site ready: sites/$NAME"
echo ""
echo "Next steps:"
echo "  cd sites/$NAME"
[[ "$INSTALL" -eq 1 ]] || echo "  npm install"
echo "  npm run dev        # start the dev server"
echo ""
echo "Add shadcn/ui components anytime, e.g.:"
echo "  cd sites/$NAME && npx shadcn@latest add card dialog"
