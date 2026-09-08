#!/usr/bin/env bash
set -euo pipefail

# build-wp.sh — package a site as an installable WordPress block theme.
#
# Usage: build-wp.sh <site-name> [--no-install] [--no-screenshot] [--keep-build]
#
# Prerenders every section of the site with react-dom/server, converts the
# resulting HTML into WordPress block markup, derives theme.json from the
# design tokens in src/index.css, and zips it all into a theme that installs
# through Appearance → Themes → Add New → Upload Theme.
#
# Output: sites/<name>/<name>-wp-theme.zip  (unzipped copy in sites/<name>/wp-theme/)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

die() { echo "error: $*" >&2; exit 1; }
step() { echo; echo "==> $*"; }

NAME="${1:-}"
[ -n "$NAME" ] || die "usage: build-wp.sh <site-name> [--no-install] [--no-screenshot] [--keep-build]"
shift

INSTALL=1
SCREENSHOT=1
KEEP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --no-install) INSTALL=0 ;;
    --no-screenshot) SCREENSHOT=0 ;;
    --keep-build) KEEP_BUILD=1 ;;
    *) die "unknown option: $arg" ;;
  esac
done

SITE_DIR="$ROOT/sites/$NAME"
[ -d "$SITE_DIR" ] || die "site not found: sites/$NAME (run: npm run sites)"
[ -f "$SITE_DIR/src/App.tsx" ] || die "sites/$NAME has no src/App.tsx"

SLUG="$NAME"
BUILD_DIR="$SITE_DIR/.wp-build"
THEME_PARENT="$SITE_DIR/wp-theme"
THEME_DIR="$THEME_PARENT/$SLUG"
ZIP_PATH="$SITE_DIR/$NAME-wp-theme.zip"

# Theme name: the site's own <title>, falling back to a prettified slug.
TITLE="$(sed -n 's/.*<title>\(.*\)<\/title>.*/\1/p' "$SITE_DIR/index.html" 2>/dev/null | head -1)"
if [ -z "$TITLE" ] || [ "$TITLE" = "__SITE_NAME__" ]; then
  TITLE="$(echo "$NAME" | tr '-' ' ' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')"
fi

rm -rf "$BUILD_DIR" "$THEME_PARENT"
mkdir -p "$BUILD_DIR"

# --- dependencies ----------------------------------------------------------
if [ ! -d "$SITE_DIR/node_modules" ]; then
  [ "$INSTALL" -eq 1 ] || die "sites/$NAME has no node_modules and --no-install was given"
  step "npm install (sites/$NAME)"
  (cd "$SITE_DIR" && npm install)
fi

# --- production build (also the type-check gate) ---------------------------
step "Membangun situs (npm run build)"
(cd "$SITE_DIR" && npm run build)

mapfile -t CSS_FILES < <(find "$SITE_DIR/dist/assets" -maxdepth 1 -name '*.css' 2>/dev/null | sort)
[ "${#CSS_FILES[@]}" -gt 0 ] || die "no CSS in sites/$NAME/dist/assets — build produced nothing to style the theme with"

# --- prerender each section ------------------------------------------------
step "Menyiapkan entri prerender"
node "$ROOT/scripts/wp/gen-entry.mjs" "$SITE_DIR" "$BUILD_DIR/entry.tsx"

step "Merender section ke HTML statis"
(cd "$SITE_DIR" && npx vite build --ssr .wp-build/entry.tsx --outDir .wp-build/ssr --logLevel warn)
node "$BUILD_DIR/ssr/entry.js" "$BUILD_DIR/sections.json"

# --- assemble the theme ----------------------------------------------------
step "Merakit tema blok"
CSS_ARGS=()
for f in "${CSS_FILES[@]}"; do CSS_ARGS+=(--css "$f"); done

node "$ROOT/scripts/wp/build-theme.mjs" \
  --site "$SITE_DIR" \
  --sections "$BUILD_DIR/sections.json" \
  --out "$THEME_DIR" \
  --slug "$SLUG" \
  --title "$TITLE" \
  "${CSS_ARGS[@]}"

# --- screenshot.png (what WordPress shows in Appearance → Themes) ----------
if [ "$SCREENSHOT" -eq 1 ]; then
  CHROME=""
  for c in google-chrome google-chrome-stable chromium chromium-browser; do
    command -v "$c" >/dev/null 2>&1 && { CHROME="$c"; break; }
  done
  if [ -n "$CHROME" ]; then
    step "Mengambil screenshot.png"
    PORT=$(( 4200 + RANDOM % 400 ))
    (cd "$SITE_DIR" && npx vite preview --port "$PORT" --strictPort >/dev/null 2>&1) &
    PREVIEW_PID=$!
    for _ in $(seq 1 40); do
      curl -sf "http://localhost:$PORT/" >/dev/null 2>&1 && break
      sleep 0.25
    done
    if curl -sf "http://localhost:$PORT/" >/dev/null 2>&1; then
      "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
        --window-size=1200,900 --virtual-time-budget=8000 \
        --screenshot="$THEME_DIR/screenshot.png" "http://localhost:$PORT/" >/dev/null 2>&1 \
        || echo "   (screenshot gagal — tema tetap valid, hanya tanpa pratinjau)"
      # A raw 1200x900 PNG is often over a megabyte, which matters: plenty of
      # hosts cap theme uploads at 2 MB. Re-encode when Pillow is around.
      if [ -f "$THEME_DIR/screenshot.png" ]; then
        python3 - "$THEME_DIR" <<'SHRINK' 2>/dev/null || true
import os, sys
from PIL import Image

theme = sys.argv[1]
png = os.path.join(theme, "screenshot.png")
img = Image.open(png).convert("RGB")
img.save(png, optimize=True)
if os.path.getsize(png) > 400_000:
    img.save(os.path.join(theme, "screenshot.jpg"), quality=86, optimize=True, progressive=True)
    os.remove(png)
SHRINK
      fi
    else
      echo "   (vite preview tidak merespons — melewati screenshot)"
    fi
    kill "$PREVIEW_PID" 2>/dev/null || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  else
    echo "   (Chrome tidak ditemukan — melewati screenshot)"
  fi
fi

# --- zip -------------------------------------------------------------------
step "Mengemas $NAME-wp-theme.zip"
rm -f "$ZIP_PATH"
(cd "$THEME_PARENT" && zip -qr "$ZIP_PATH" "$SLUG")

[ "$KEEP_BUILD" -eq 1 ] || rm -rf "$BUILD_DIR"

SIZE="$(du -h "$ZIP_PATH" | cut -f1)"
echo
echo "Selesai."
echo "  tema  : $(realpath --relative-to="$ROOT" "$THEME_DIR")"
echo "  paket : $(realpath --relative-to="$ROOT" "$ZIP_PATH")  ($SIZE)"
echo
echo "Pasang di WordPress: Appearance → Themes → Add New → Upload Theme → pilih zip → Activate."
