#!/usr/bin/env bash
#
# delete-site.sh — delete a site from sites/<name> and remove its card from
# the homepage gallery (sites/home/src/components/Sites.tsx).
#
# Usage:
#   scripts/delete-site.sh <site-name>          # asks for confirmation
#   scripts/delete-site.sh <site-name> --yes    # skip confirmation (automation)
#
# The deletion only touches the working tree — review with `git status`,
# then commit & push so CI redeploys Pages without the site.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SITES="$ROOT/sites"
GALLERY="$ROOT/sites/home/src/components/Sites.tsx"

# --- args -------------------------------------------------------------------
NAME="${1:-}"
ASSUME_YES=0
for arg in "${@:2}"; do
  case "$arg" in
    --yes|-y) ASSUME_YES=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

if [[ -z "$NAME" ]]; then
  echo "Usage: scripts/delete-site.sh <site-name> [--yes]" >&2
  exit 1
fi

if [[ ! "$NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Invalid name '$NAME'. Site names use lowercase letters, digits and dashes." >&2
  exit 1
fi

if [[ "$NAME" == "home" ]]; then
  echo "Refusing to delete 'home' — it is the workspace homepage, not a generated site." >&2
  exit 1
fi

DEST="$SITES/$NAME"
if [[ ! -d "$DEST" ]]; then
  echo "No site at sites/$NAME. Existing sites:" >&2
  ls -1 "$SITES" 2>/dev/null >&2 || echo "  (none)" >&2
  exit 1
fi

# --- summary + confirmation -------------------------------------------------
SIZE="$(du -sh "$DEST" 2>/dev/null | cut -f1)"
echo "About to delete:"
echo "  sites/$NAME  ($SIZE, including node_modules/android/apk if present)"
if grep -q "name: ['\"]$NAME['\"]" "$GALLERY" 2>/dev/null; then
  echo "  + its card in sites/home/src/components/Sites.tsx"
fi
echo ""

if [[ "$ASSUME_YES" -ne 1 ]]; then
  printf "Type the site name to confirm deletion: "
  if ! read -r CONFIRM; then
    echo "" ; echo "No confirmation input — aborted. Use --yes for non-interactive runs." >&2
    exit 1
  fi
  if [[ "$CONFIRM" != "$NAME" ]]; then
    echo "Confirmation did not match ('$CONFIRM' != '$NAME') — aborted, nothing deleted." >&2
    exit 1
  fi
fi

# --- delete -----------------------------------------------------------------
echo "→ Removing sites/$NAME..."
rm -rf "$DEST"

if [[ -f "$GALLERY" ]]; then
  # Strip the card object with name: '<name>' from the SITES array. Card
  # objects contain no nested braces, so a brace-free match is safe.
  node -e '
    const fs = require("fs")
    const [file, name] = process.argv.slice(1)
    const src = fs.readFileSync(file, "utf8")
    const re = new RegExp("\\n?[ \\t]*\\{[^{}]*?name: [\x27\"]" + name + "[\x27\"][^{}]*?\\},?", "")
    const out = src.replace(re, "")
    if (out === src) {
      console.log("→ No card for \x27" + name + "\x27 in Sites.tsx — nothing to remove there.")
    } else {
      fs.writeFileSync(file, out)
      console.log("→ Removed the \x27" + name + "\x27 card from sites/home/src/components/Sites.tsx")
    }
  ' "$GALLERY" "$NAME"
fi

echo ""
echo "✅ Deleted sites/$NAME (working tree only)."
echo ""
echo "Next steps:"
echo "  git status                       # review"
echo "  git add -A && git commit         # then push — CI redeploys Pages"
echo "                                   # and the /$NAME/ URL disappears."
