#!/usr/bin/env bash
set -euo pipefail

# build-apk.sh — package a site's production build into an Android APK.
#
# Usage: build-apk.sh <site-name> [--release]
#
# Wraps the site with Capacitor (installed into the site on first run),
# generates the native android/ project when missing, then builds the APK
# with Gradle. Debug APKs are auto-signed and installable on any device;
# --release produces an unsigned APK that must be signed before distribution.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

die() { echo "error: $*" >&2; exit 1; }

NAME="${1:-}"
[ -n "$NAME" ] || die "usage: build-apk.sh <site-name> [--release]"
shift
VARIANT="debug"
for arg in "$@"; do
  case "$arg" in
    --release) VARIANT="release" ;;
    *) die "unknown option: $arg" ;;
  esac
done

SITE_DIR="$ROOT/sites/$NAME"
[ -d "$SITE_DIR" ] || die "site not found: sites/$NAME (run: npm run sites)"

# --- toolchain -------------------------------------------------------------
if [ -z "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" ]; then
  for c in "$HOME/Android/Sdk" "/opt/android-sdk"; do
    if [ -d "$c" ]; then export ANDROID_HOME="$c"; break; fi
  done
fi
[ -d "${ANDROID_HOME:-/nonexistent}" ] || die "Android SDK not found — install it via Android Studio, or set ANDROID_HOME"

if ! command -v java >/dev/null 2>&1; then
  if [ -x "$HOME/android-studio/jbr/bin/java" ]; then
    export JAVA_HOME="$HOME/android-studio/jbr"
    export PATH="$JAVA_HOME/bin:$PATH"
  else
    die "java not found — install a JDK (21+) or Android Studio (its bundled JDK is picked up automatically)"
  fi
fi

cd "$SITE_DIR"

# --- Capacitor (first run only) --------------------------------------------
if [ ! -d node_modules/@capacitor/android ]; then
  echo "==> Installing Capacitor into sites/$NAME"
  npm install @capacitor/core @capacitor/android
  npm install -D @capacitor/cli
fi

if [ ! -f capacitor.config.json ] && [ ! -f capacitor.config.ts ] && [ ! -f capacitor.config.js ]; then
  # Java package segments cannot contain dashes or start with a digit.
  pkg="$(echo "$NAME" | tr -d '-')"
  case "$pkg" in [0-9]*) pkg="app$pkg" ;; esac
  cat > capacitor.config.json <<EOF
{
  "appId": "com.chalid.$pkg",
  "appName": "$NAME",
  "webDir": "dist"
}
EOF
  echo "==> Created capacitor.config.json (appId com.chalid.$pkg)"
fi

# --- build -----------------------------------------------------------------
echo "==> Building web app"
npm run build

if [ ! -d android ]; then
  echo "==> Generating native Android project"
  npx cap add android
fi

echo "==> Syncing dist/ into the Android project"
npx cap sync android

echo "==> Building $VARIANT APK"
( cd android && ./gradlew "assemble${VARIANT^}" )

APK="android/app/build/outputs/apk/$VARIANT/app-$VARIANT.apk"
if [ ! -f "$APK" ]; then
  # release builds come out as app-release-unsigned.apk
  APK="$(ls "android/app/build/outputs/apk/$VARIANT/"*.apk 2>/dev/null | head -1 || true)"
fi
[ -n "${APK:-}" ] && [ -f "$APK" ] || die "build finished but no APK found under android/app/build/outputs/apk/$VARIANT"

OUT="$SITE_DIR/$NAME-$VARIANT.apk"
cp "$APK" "$OUT"
echo
echo "APK ready: sites/$NAME/$(basename "$OUT")"
if [ "$VARIANT" = "release" ]; then
  echo "note: release APKs are unsigned — sign them with apksigner before distributing."
else
  echo "install on a connected device with: adb install sites/$NAME/$(basename "$OUT")"
fi
