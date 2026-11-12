#!/usr/bin/env bash
# Build a self-contained, upload-ready zip of this site (relative base, so it
# works in any folder), with pre-compressed assets and server configs.
#   bash scripts/make-zip.sh            -> ./puas-startup.zip
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="$(pwd)/puas-startup.zip"
STAGE="$(mktemp -d)/puas-startup"

npx tsc -b
npx vite build --base=./ --outDir "$STAGE" --emptyOutDir --logLevel warn
cp deploy/.htaccess deploy/_headers deploy/vercel.json deploy/nginx.conf.example deploy/BACA-SAYA.md "$STAGE/"

node -e '
const fs=require("fs"),path=require("path"),zlib=require("zlib");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for (const f of walk(process.argv[1])) {
  if (!/\.(html|js|css|svg)$/.test(f)) continue;
  const b=fs.readFileSync(f);
  fs.writeFileSync(f+".gz", zlib.gzipSync(b,{level:9}));
  fs.writeFileSync(f+".br", zlib.brotliCompressSync(b,{params:{[zlib.constants.BROTLI_PARAM_QUALITY]:11}}));
}' "$STAGE"

rm -f "$OUT"
(cd "$(dirname "$STAGE")" && zip -qr -9 -X "$OUT" puas-startup)
echo "OK -> $OUT ($(du -h "$OUT" | cut -f1))"
