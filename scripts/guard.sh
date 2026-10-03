#!/usr/bin/env bash
# Temporary GitHub interaction limit for the repo — the emergency brake for a
# spam wave. While on, only collaborators can open issues, comment, or open
# PRs. GitHub caps a limit at six months; run `on` again to renew it.
# Day to day, .github/workflows/guard-issues.yml already closes and locks
# issues from anyone but the owner — this is for when that is not enough.
#
# Usage:
#   scripts/guard.sh status
#   scripts/guard.sh on [one_day|three_days|one_week|one_month|six_months]  (default six_months)
#   scripts/guard.sh off
#
# Needs the repo owner's gh login (admin rights). Override with GUARD_REPO /
# GUARD_USER for a fork.
set -euo pipefail

REPO="${GUARD_REPO:-chalidade/weeknoo}"
USER_LOGIN="${GUARD_USER:-${REPO%%/*}}"
ACTION="${1:-status}"
EXPIRY="${2:-six_months}"

# gh may have several accounts logged in; use the owner's token explicitly
# rather than whichever account happens to be active.
if ! TOKEN="$(gh auth token --user "$USER_LOGIN" 2>/dev/null)"; then
  echo "No gh login for '$USER_LOGIN'. Run: gh auth login (as $USER_LOGIN)" >&2
  exit 1
fi
api() { GH_TOKEN="$TOKEN" gh api -H "Accept: application/vnd.github+json" "$@"; }

show() {
  local out
  out="$(api "repos/$REPO/interaction-limits")"
  if [[ -z "$out" || "$out" == "{}" ]]; then
    echo "○ $REPO: no interaction limit — anyone can open issues (guard-issues.yml closes non-owner ones)."
  else
    echo "$out" | node -e '
      const l = JSON.parse(require("fs").readFileSync(0, "utf8"))
      console.log(`● ${process.argv[1]}: ${l.limit}, expires ${l.expires_at}`)
    ' "$REPO"
  fi
}

case "$ACTION" in
  status) show ;;
  on)
    case "$EXPIRY" in
      one_day|three_days|one_week|one_month|six_months) ;;
      *) echo "Unknown expiry: $EXPIRY" >&2; exit 1 ;;
    esac
    api -X PUT "repos/$REPO/interaction-limits" -f limit=collaborators_only -f expiry="$EXPIRY" >/dev/null
    show ;;
  off)
    api -X DELETE "repos/$REPO/interaction-limits" >/dev/null
    show ;;
  *) echo "Usage: scripts/guard.sh status|on [expiry]|off" >&2; exit 1 ;;
esac
