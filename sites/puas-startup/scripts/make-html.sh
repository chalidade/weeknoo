#!/usr/bin/env bash
# One self-contained HTML file: CSS, JS, font and logo are inlined, so it opens
# from disk and uploads anywhere as a single file. Because everything is
# inline it cannot run under the strict CSP that the zip ships with — use the
# zip (scripts/make-zip.sh) for production hosting.
#   bash scripts/make-html.sh            -> ./puas-startup.html
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="$(pwd)/puas-startup.html"
STAGE="$(mktemp -d)/single"
SITE_URL="${SITE_URL:-https://startup.puas.academy/}"

npx tsc -b
PUAS_SINGLE=1 npx vite build --base=./ --outDir "$STAGE" --emptyOutDir --logLevel warn
node scripts/inline-html.mjs "$STAGE" "$OUT" "$SITE_URL"
echo "OK -> $OUT ($(du -h "$OUT" | cut -f1))"
