# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **website workspace**: one git repo, one flow. Every website is an independent
app under `sites/<name>/`, generated from `template/`. There is no shared
`node_modules` and no workspace/monorepo tooling — each site installs its own
dependencies. Keep it that way unless the user explicitly asks for workspaces.

## Creating a new website

Always scaffold via the generator — never hand-roll a new site or run
`npm create vite` directly, so every site stays on the same stack:

```bash
npm run new -- <site-name>                          # blank starter
npm run new -- <site-name> --category <category>    # full page from a category template
npm run categories                                  # list available categories
# or: bash scripts/new-site.sh <site-name> [--category <name>] [--no-install]
```

The generator copies `template/` to `sites/<name>/`, replaces the
`__SITE_NAME__` placeholder, and runs `npm install`. Site names must match
`^[a-z0-9][a-z0-9-]*$`. It refuses to overwrite an existing site.

To delete a site, use `npm run delete -- <site-name>` (wrapper for
`scripts/delete-site.sh`) — it asks the user to re-type the site name
(`--yes` skips, for automation), removes `sites/<name>/`, and strips the
site's card from `sites/home/src/components/Sites.tsx`. It touches only the
working tree; committing and pushing is what takes the site off Pages. It
refuses to delete `home`.

With `--category`, the matching `categories/<name>/` overlay is copied over
the fresh template (after removing the starter `Hero.tsx`), yielding a
complete page — Navbar → Hero → content sections → Footer — with
category-specific palette, fonts and Indonesian dummy copy. Available now:
portfolio, company-profile, landing-product, saas, restaurant, blog,
education, photography, local-business — `npm run categories` lists the
current set. Eleven more (ecommerce, agency, event, wedding, nonprofit,
real-estate, medical, travel, fitness, news, resume) are specced in
`categories/SPEC.md` but not yet built; build them on request following that
spec.
**`categories/SPEC.md` is the contract** for every category (allowed imports,
token-only styling, no external images, `__SITE_NAME__` branding) — read it
before editing or adding one, and verify with
`npm run check-categories [-- <name>...]` (builds each overlay against a
throwaway site at `sites/.catcheck`, git-ignored). When the user's request
matches a category, prefer scaffolding with it and then personalizing, over
building from the blank starter.

## Component library: 21st.dev

[21st.dev](https://21st.dev/) is this workspace's component library — 10,000+
shadcn/ui-based React + Tailwind components. It is wired into `template/` as a
shadcn **namespaced registry**, so components install like any other shadcn
component. Reach for it before hand-writing a hero, pricing table, nav, or any
other marketing block.

```bash
npm run add -- <site-name> @21st/<author>/<slug>   # wrapper for scripts/add-component.sh
npm run add -- <site-name> card dialog             # stock shadcn/ui still works
npm run add -- <site-name> https://21st.dev/@ln-dev7/components/pricing-interaction
```

### Turning a 21st.dev link into an install

A component's URL already contains everything the registry needs — there is
nothing to look up. `scripts/add-component.sh` normalises all of these to
`@21st/<author>/<slug>`, so a link pasted from the browser works verbatim:

| Pasted | Installs |
| --- | --- |
| `21st.dev/@ln-dev7/components/pricing-interaction` | `@21st/ln-dev7/pricing-interaction` |
| `21st.dev/@ln-dev7/components/pricing-interaction/default` | same — the trailing demo/variant is dropped |
| `21st.dev/community/components/easemize/pixel-perfect-hero/default` | `@21st/easemize/pixel-perfect-hero` |
| `21st.dev/mikolajdobrucki/hero-section` | `@21st/mikolajdobrucki/hero-section` |
| `21st.dev/r/<author>/<slug>` | passed through unchanged |

Category pages (`/community/components/s/hero`) and profile pages
(`/community/<author>`) are rejected with a message — they are not installable.

**Do not try to read a component page to find its install command.** 21st.dev is
client-rendered: fetching a component page returns no install command, and
fetching a large category page (e.g. `/s/hero`, 1000+ items) returns navigation
chrome with no component list at all. Smaller category pages do list components
with authors and slugs, but this is unreliable — ask for the component's own link,
or use the MCP below, which searches the catalog server-side.

**Setup (once):** the registry requires an API key.

```bash
cp .env.example .env    # then paste a key from https://21st.dev/settings/api-keys
```

`scripts/add-component.sh` sources the root `.env`, so one key serves every site.
Without it the registry returns `403 Authentication required`. Free tier is
search-free with 2 installs/day.

**Optional — the 21st MCP server** lets Claude Code *search* the catalog and
generate components without leaving the session, instead of you finding slugs by
hand:

```bash
npx @21st-dev/cli@latest init --client claude
```

It talks to `https://21st.dev/api/mcp` with an `x-api-key` header — the same key.

## The homepage (`sites/home`) and the prompt pipeline

`sites/home` is the workspace's landing page. CI deploys it at the Pages
**root** (https://chalidade.github.io/weeknoo/) while every other site lives
under `/weeknoo/<site>/` — this split is handled in the `pages` job of
`.github/workflows/build.yml`.

- Its prompt box turns the visitor's text into a **prefilled GitHub issue**
  labeled `prompt` on chalidade/weeknoo. A cloud routine
  (`weeknoo-prompt-runner`, see https://claude.ai/code/routines) picks such
  issues up, builds the requested site following this file, commits, pushes,
  comments, and closes the issue. When asked to "kerjakan issue #N" locally,
  do the same flow in this workspace.
- **When a new site is added, add its card to the `SITES` array in
  `sites/home/src/components/Sites.tsx`** (url:
  `https://chalidade.github.io/weeknoo/<site>/`).
- The homepage's display font is Instrument Serif (Google Fonts, loaded in
  its `index.html`; `font-display` utility via `--font-display` in its
  `index.css`). It renders dark-only (`class="dark"` on `<html>`).
- The homepage is gated by an access code (`Gate.tsx` — only the SHA-256
  hash is embedded; to rotate: `echo -n "kode" | sha256sum`, replace
  `ACCESS_HASH`). It is a client-side gate for casual visitors; the real
  abuse protection is pipeline-side: GitHub ignores the `labels` URL param
  for non-collaborators, and the runner routine only executes issues that
  are BOTH labeled `prompt` AND authored by `chalidade`. Keep both checks
  when editing the routine.

## Data APIs (bundled library)

Every site carries typed API clients in `src/lib/api/` (import from
`@/lib/api`) for Indonesian Islamic + regional data. All sources are free,
keyless, CORS-enabled, and verified working — do not hand-roll fetches for
this data, use the library:

```ts
import { getSurah, getTafsir, getAsbabunNuzulBySurah,
         getHadithPage, getArbain, getProvinces, getRegencies } from "@/lib/api"
```

- **`quran.ts`** — equran.id v2: `getSurahList()`, `getSurah(1–114)` (Arabic,
  Latin, terjemahan, murottal audio per ayah), `getTafsir(nomor)` (Kemenag).
- **`asbabun-nuzul.ts`** — `getAsbabunNuzul()`, `getAsbabunNuzulBySurah(surah)`,
  `getAsbabunNuzulByAyah(surah, ayah)`. The upstream API has no CORS, so the
  full 286-entry dataset (Kemenag) is bundled at `src/lib/api/data/` and
  lazy-loaded (~450 kB stays out of the main bundle). 54 of 114 surahs have
  entries — empty results are normal.
- **`hadith.ts`** — hadis-api-id: `getHadithBooks()` (9 narrators + totals),
  `getHadithPage(slug, page, limit)`, `getHadith(slug, number)`; plus
  `getArbain(1–42)` from api.myquran.com.
- **`wilayah.ts`** — emsifa api-wilayah-indonesia, cascading:
  `getProvinces()` → `getRegencies(provinceId)` → `getDistricts(regencyId)` →
  `getVillages(districtId)`. Names come back ALL CAPS — title-case them for UI.

The library needs `"resolveJsonModule": true` in `tsconfig.app.json` (already
set in the template and both existing sites).

## Local database (bundled library)

Every site carries `src/lib/db/` (import from `@/lib/db`) — an on-device
database for apps that need to store user-written data, aimed at
preview/personal use. Use it instead of localStorage:

- **`db.ts`** — the site's Dexie (IndexedDB) database, named after the site.
  Define one interface + one `stores` entry per table and bump the schema
  `version` on change. The starter schema has an example `items` table —
  replace it with the site's real tables.
- **`backup.ts`** — file-based backup that works on any Dexie instance:
  `exportDbJson(db)`, `downloadDbBackup(db)` (saves a .json file),
  `importDbJson(db, json, {merge})`, `importDbFromFile(db, file)` (from an
  `<input type="file">`). This is the migration path between devices.

```ts
import { db, downloadDbBackup } from "@/lib/db"
await db.items.add({ title: "Halo", createdAt: Date.now() })
const all = await db.items.orderBy("createdAt").toArray()
await downloadDbBackup(db)
```

For live React views use `useLiveQuery` from `dexie-react-hooks` (install it
in the site first). Data is per-device — it does not sync between devices or
browsers; read-only content belongs in bundled JSON (see the asbabun nuzul
pattern), and cross-device sync needs a hosted DB (e.g. Supabase), not this.

## AI / LLM (bundled library)

Every site carries `src/lib/ai/` (import from `@/lib/ai`) — chat against a
model with **reasoning**, running through Ollama on the visitor's own machine
(`http://localhost:11434`). Free with no cap, no account, no API key, works
offline, and the conversation never leaves the device. There is deliberately
no hosted provider here; don't add one without asking.

```ts
import { chat, chatStream, isOllamaRunning } from "@/lib/ai"

const reply = await chat([{ role: "user", content: "Halo!" }])
reply.content    // the answer
reply.reasoning  // the chain of thought, split out — "" for non-reasoning models

for await (const chunk of chatStream(messages, { think: true })) {
  setThinking((t) => t + chunk.reasoning)
  setAnswer((a) => a + chunk.content)
}
```

`reasoning` is always separate from `content`: `reasoning.ts` strips
`<think>…</think>` out of the answer — incrementally while streaming, so a tag
split across two chunks still resolves — and prefers Ollama's own `thinking`
field when it sends one. Render it in a collapsible panel, never inline in the
answer.

**Default model:** `qwen3:4b` (~2.5 GB, thinks). Override per call with
`{ model }`, and list what is actually installed with `getOllamaModels()`.
`llama3.1:8b` is a fine alternative but has **no** reasoning mode —
`reasoning` comes back empty.

**Never pass `think: false`.** Measured on Ollama 0.33.2 + qwen3:4b, it does
not stop the model thinking — it only stops Ollama labelling the thinking, so
the chain of thought arrives in `content` untagged and cannot be split out.
Leave `think` unset (thinks, cleanly separated) or pass `true`. For a fast
non-thinking answer, switch model rather than the flag.

**Speed is the real constraint, not correctness.** A 4B model on a CPU-only
machine runs at roughly 3–9 tokens/sec, so a thinking answer takes 30–120
seconds — and a reasoning model spends most of its tokens deliberating before
it writes anything. Always stream (`chatStream`) and show the thinking as it
arrives; a non-streaming `chat()` looks frozen for a minute. On a machine that
is short on RAM, prefer `qwen3:1.7b`.

**Setup** — Ollama has to be installed and a model pulled:

```bash
curl -fsSL https://ollama.com/install.sh | sh   # installs + starts a systemd service
ollama pull qwen3:4b
```

The installer starts `ollama.service` and enables it at boot, so it is already
listening — running `ollama serve` by hand afterwards fails with `address
already in use`, which means it is working, not broken. Use
`systemctl status ollama` to check it.

Ollama only answers browsers whose origin it trusts. localhost on any port is
allowed out of the box, so `npm run dev` just works; a **deployed** site has to
be named explicitly, otherwise the fetch fails CORS:

```bash
sudo systemctl edit ollama    # Environment="OLLAMA_ORIGINS=https://chalidade.github.io"
sudo systemctl restart ollama
```

**The model runs on the visitor's machine, not on a server.** A published site
therefore has working AI only for visitors who installed Ollama themselves —
for everyone else `isOllamaRunning()` is false. Gate the UI on it and explain
what is missing, rather than letting the first message throw. Treat AI features
as local-first tools (your own machine, an APK, a preview), not as something
every visitor to Pages will get.

## Building an Android APK

Any site can be wrapped into an Android APK via Capacitor. Always go through
the script — it bootstraps Capacitor into the site on first run and resolves
the Android SDK / JDK automatically (Android Studio's bundled JDK is used when
`java` is not on PATH):

```bash
npm run apk -- <site-name>              # wrapper for scripts/build-apk.sh
npm run apk -- <site-name> --release    # unsigned release APK
```

Output lands at `sites/<name>/<name>-debug.apk`. The generated
`sites/*/android/` project and `*.apk` files are git-ignored (regenerated on
demand). See DEPLOY.md for details and signing notes.

Android runtime permissions (location, camera, …) must NOT be hand-edited
into `android/` — it is regenerable. Declare them in
`sites/<name>/android-permissions.txt` (one `android.permission.*` name per
line); `build-apk.sh` injects them into the manifest idempotently on every
build. Native device APIs go through the matching Capacitor plugin (e.g.
`@capacitor/geolocation` — the WebView's own `navigator.geolocation` never
gets a permission prompt in the APK), with a web fallback via
`Capacitor.isNativePlatform()`.

## Per-site commands (run inside `sites/<name>/`)

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build  (this is the type-check + build gate)
npm run preview   # preview the production build
npm run lint      # oxlint
npx shadcn@latest add <component>   # add shadcn/ui or @21st/<author>/<slug> components
```

There is no separate test runner configured. `npm run build` is the correctness
gate — it type-checks the whole app before bundling.

## Stack & conventions (baked into `template/`)

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4** via `@tailwindcss/vite`
  (no `tailwind.config.js` — theme lives in `src/index.css` under `@theme inline`).
- **shadcn/ui** is pre-wired: `components.json` (new-york, neutral, lucide),
  the `@/*` path alias (in both `tsconfig` and `vite.config.ts`), the `cn()`
  helper in `src/lib/utils.ts`, a starter `Button` in `src/components/ui/`, and
  the `@21st` registry namespace. Install components rather than writing them by
  hand — see **Component library: 21st.dev** above.
- **Motion** for animation — import from `motion/react` (NOT `framer-motion`).
  The `Hero` component shows the house pattern: a `container` variant with
  `staggerChildren` driving `fadeUp` children.
- **CKEditor 5** (WYSIWYG) is pre-installed with a prewired wrapper at
  `@/components/editor/RichTextEditor` (GPL build, `licenseKey: "GPL"`) —
  use it for rich-text input instead of adding another editor. It costs
  nothing in the bundle until imported.
- **Recharts** is the chart library (pairs with shadcn; `npm run add --
  <site> chart` adds the styled shadcn chart components). Don't add other
  chart libs.
- The user-facing manual is **PANDUAN.md** (Indonesian) — keep it updated
  when workspace behavior changes (new commands, new bundled libraries, new
  pipeline steps).
- Design tokens are semantic shadcn CSS variables (`bg-background`,
  `text-muted-foreground`, `border-border`, …) with light/dark via the `.dark`
  class. Style with these tokens, not hard-coded colors.

## Design direction

- **Reference:** match [21st.dev community heroes](https://21st.dev/community/components/s/hero)
  (React + Tailwind + shadcn). When the user picks a specific component, install
  it via the `@21st` registry rather than reproducing it by hand. Only rebuild
  from a screenshot when the component isn't installable.
- **Build a full page as one file per section.** `App.tsx` only composes; it
  holds no markup of its own. Each section is a self-contained `<section>` in
  `src/components/<Section>.tsx` that owns its own copy, data and animation and
  reads nothing from its siblings — see `Hero.tsx` for the shape.

  ```tsx
  <main className="min-h-screen">
    <Hero /><Features /><Pricing /><FAQ /><CTA /><Footer />
  </main>
  ```

  This is what makes "regenerate the whole page, then revise one section later"
  safe: a later edit rewrites a single file, and the rest of the page cannot
  regress. Shared values (palette, radius, fonts) belong in `src/index.css` as
  tokens, never duplicated per section — one token edit restyles every section
  at once. Sections should be reorderable by moving a line in `App.tsx`.
- **UI/UX Pro Max** skill is installed globally at `~/.claude/skills/`. Use its
  `search.py` (e.g. `python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain color`)
  for palettes, typography pairings, styles, and chart choices. It needs Python 3.

## Editing the template

Changing files in `template/` affects **future** generated sites only — it does
not touch existing `sites/*`. To roll a template change into an existing site,
apply the same edit there (or regenerate).

## Housekeeping

- `ui-ux-pro-max-skill/` (if present) is a clone of the globally-installed skill
  and is git-ignored — it is not part of this repo's product.
