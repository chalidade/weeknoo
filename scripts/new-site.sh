#!/usr/bin/env bash
#
# new-site.sh — scaffold a new website into sites/<name> from ./template
#
# Usage:
#   scripts/new-site.sh <site-name> [--category <name>] [--no-install]
#   scripts/new-site.sh --list-categories
#
# Example:
#   scripts/new-site.sh acme-landing --category company-profile
#
set -euo pipefail

# Resolve the workspace root (parent of this script's dir) so the script works
# regardless of the directory it's invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$ROOT/template"
SITES="$ROOT/sites"
CATEGORIES="$ROOT/categories"

list_categories() {
  find "$CATEGORIES" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null | sort
}

# --- args -------------------------------------------------------------------
if [[ "${1:-}" == "--list-categories" ]]; then
  list_categories
  exit 0
fi

NAME="${1:-}"
INSTALL=1
CATEGORY=""
ARGS=("${@:2}")
i=0
while [[ $i -lt ${#ARGS[@]} ]]; do
  case "${ARGS[$i]}" in
    --no-install) INSTALL=0 ;;
    --category)
      i=$((i + 1))
      CATEGORY="${ARGS[$i]:-}"
      if [[ -z "$CATEGORY" ]]; then
        echo "--category needs a value. Available:" >&2
        list_categories >&2
        exit 1
      fi
      ;;
    *) echo "Unknown option: ${ARGS[$i]}" >&2; exit 1 ;;
  esac
  i=$((i + 1))
done

if [[ -z "$NAME" ]]; then
  echo "Usage: scripts/new-site.sh <site-name> [--category <name>] [--no-install]" >&2
  echo "       scripts/new-site.sh --list-categories" >&2
  exit 1
fi

if [[ -n "$CATEGORY" && ! -d "$CATEGORIES/$CATEGORY" ]]; then
  echo "Unknown category '$CATEGORY'. Available:" >&2
  list_categories >&2
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

# Apply the category overlay: drop the starter hero, then copy the category's
# files (a full page: Navbar → sections → Footer + its own index.css/index.html)
# over the fresh template. Placeholder replacement below covers overlay files too.
if [[ -n "$CATEGORY" ]]; then
  echo "→ Applying category '$CATEGORY'..."
  rm -f "$DEST/src/components/Hero.tsx"
  cp -R "$CATEGORIES/$CATEGORY/." "$DEST/"
fi

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
if [[ -n "$CATEGORY" ]]; then
  echo "✅ Site ready: sites/$NAME (category: $CATEGORY)"
else
  echo "✅ Site ready: sites/$NAME"
fi
echo ""
echo "Next steps:"
echo "  cd sites/$NAME"
[[ "$INSTALL" -eq 1 ]] || echo "  npm install"
echo "  npm run dev        # start the dev server"
echo ""
echo "Add shadcn/ui components anytime, e.g.:"
echo "  cd sites/$NAME && npx shadcn@latest add card dialog"
