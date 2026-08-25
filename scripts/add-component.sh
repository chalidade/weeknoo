#!/usr/bin/env bash
#
# add-component.sh — add shadcn/ui or 21st.dev components to a site
#
# Usage:
#   scripts/add-component.sh <site-name> <component> [<component> ...]
#
# A <component> is any of:
#   card                     a stock shadcn/ui component
#   @21st/<author>/<slug>    a 21st.dev component (needs TWENTY_FIRST_API_KEY)
#   any 21st.dev URL         pasted straight from the browser — see normalize_21st
#
# Examples:
#   scripts/add-component.sh acme-landing card dialog
#   scripts/add-component.sh acme-landing @21st/serafimcloud/hero-section
#   scripts/add-component.sh acme-landing https://21st.dev/@mikolajdobrucki/components/hero-section
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- args -------------------------------------------------------------------
NAME="${1:-}"
if [[ -z "$NAME" || $# -lt 2 ]]; then
  echo "Usage: scripts/add-component.sh <site-name> <component> [<component> ...]" >&2
  exit 1
fi
shift
COMPONENTS=("$@")

# --- url normalisation ------------------------------------------------------
# 21st.dev shows a component at several different URLs, but the registry only
# ever needs <author>/<slug>. Reduce whatever was pasted down to that, dropping
# the optional trailing demo/variant segment.
#
#   https://21st.dev/@author/components/slug         -> @21st/author/slug
#   https://21st.dev/@author/components/slug/demo    -> @21st/author/slug
#   https://21st.dev/community/components/author/slug/demo -> @21st/author/slug
#   https://21st.dev/author/slug                     -> @21st/author/slug
#   https://21st.dev/r/author/slug                   -> unchanged (already valid)
# Sets NORMALIZED. Not a $(...) helper — it needs to be able to abort the run.
NORMALIZED=""
normalize_21st() {
  local raw="$1" path rest author slug
  NORMALIZED="$raw"
  case "$raw" in
    https://21st.dev/r/*) return ;;                # registry URL — shadcn takes it as-is
    https://21st.dev/*|http://21st.dev/*) ;;
    *) return ;;                                   # not a 21st.dev URL — leave alone
  esac

  path="${raw#*://21st.dev/}"
  path="${path%%\?*}"          # strip query string
  path="${path%%#*}"           # strip fragment
  path="${path%/}"             # strip trailing slash

  # .../s/<category> is a browse page, not a component. Catch it before the
  # stripping below turns "s" into an author name.
  case "$path" in
    community/components/s/*|s/*)
      echo "That is a category page, not a component: $raw" >&2
      echo "Open a component from the grid and pass its own URL." >&2
      exit 1 ;;
  esac

  path="${path#community/components/}"

  # Anything still under community/ is a profile page (community/<author>).
  case "$path" in
    community/*)
      echo "That is a profile page, not a component: $raw" >&2
      echo "Open one of that author's components and pass its own URL." >&2
      exit 1 ;;
  esac

  path="${path#@}"

  rest="${path#*/}"
  if [[ "$rest" == "$path" ]]; then               # no second segment at all
    echo "Could not read <author>/<slug> out of: $raw" >&2
    echo "That looks like a profile or category page, not a component." >&2
    echo "Open the component itself, or pass @21st/<author>/<slug>." >&2
    exit 1
  fi

  author="${path%%/*}"
  rest="${rest#components/}"
  slug="${rest%%/*}"           # first segment after the author is the slug;
                               # anything further is a demo/variant we discard

  if [[ -z "$author" || -z "$slug" ]]; then
    echo "Could not read <author>/<slug> out of: $raw" >&2
    echo "Pass it as @21st/<author>/<slug> instead." >&2
    exit 1
  fi
  NORMALIZED="@21st/$author/$slug"
}

for i in "${!COMPONENTS[@]}"; do
  normalize_21st "${COMPONENTS[$i]}"
  COMPONENTS[$i]="$NORMALIZED"
done

DEST="$ROOT/sites/$NAME"
if [[ ! -d "$DEST" ]]; then
  echo "No site at sites/$NAME. Existing sites:" >&2
  ls -1 "$ROOT/sites" 2>/dev/null | sed 's/^/  /' >&2
  [[ -d "$ROOT/sites" ]] || echo "  (none yet — run: npm run new -- $NAME)" >&2
  exit 1
fi
if [[ ! -f "$DEST/components.json" ]]; then
  echo "sites/$NAME has no components.json — it is not shadcn-wired." >&2
  echo "Copy one from template/components.json, or regenerate the site." >&2
  exit 1
fi

# --- 21st.dev credentials ---------------------------------------------------
# One key at the workspace root serves every site; shadcn reads it from the
# environment when it expands ${TWENTY_FIRST_API_KEY} in components.json.
if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

WANTS_21ST=0
for c in "${COMPONENTS[@]}"; do
  case "$c" in
    @21st/*|https://21st.dev/*) WANTS_21ST=1 ;;
  esac
done

if [[ "$WANTS_21ST" -eq 1 && -z "${TWENTY_FIRST_API_KEY:-}" ]]; then
  echo "TWENTY_FIRST_API_KEY is not set — 21st.dev components need it." >&2
  echo "" >&2
  echo "  1. Get a key: https://21st.dev/settings/api-keys" >&2
  echo "  2. cp .env.example .env   and put the key in it" >&2
  exit 1
fi

# --- add --------------------------------------------------------------------
echo "→ Adding to sites/$NAME: ${COMPONENTS[*]}"
cd "$DEST"
exec npx shadcn@latest add "${COMPONENTS[@]}"
