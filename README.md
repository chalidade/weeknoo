# Chalid Websites

One repo, one flow. Every website lives in its own folder under `sites/`, all
built from the same stack and generated from a single template.

> **📖 Panduan lengkap (Bahasa Indonesia): [PANDUAN.md](PANDUAN.md)** — peta
> repo, perintah harian, library bawaan, publish, APK, kode akses, dan
> troubleshooting dalam satu dokumen.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — pre-wired (`components.json`, `@/*` alias, `cn()` helper, a `Button` to start)
- **Motion** (`motion/react`) for animation
- **lucide-react** icons
- **Data APIs** in `src/lib/api/` (`@/lib/api`) — typed clients for Al-Qur'an
  (equran.id), tafsir, asbabun nuzul (bundled Kemenag dataset), hadits
  (9 narrators + Arba'in), and wilayah Indonesia (provinsi → kelurahan).
  Free, keyless, browser-ready.
- **Local database** in `src/lib/db/` (`@/lib/db`) — Dexie/IndexedDB per site
  with JSON export/import backup helpers, for apps that store user data
  (preview/personal use; per-device, no server).

**Design reference:** [21st.dev community heroes](https://21st.dev/community/components/s/hero).
**Design intelligence:** the globally-installed **UI/UX Pro Max** Claude skill
(`~/.claude/skills/`) — palettes, typography, styles, charts across 22 stacks.

## Create a new website

```bash
npm run new -- my-site        # or: bash scripts/new-site.sh my-site
```

This creates `sites/my-site/`, fills in the name, and installs dependencies.
Then:

```bash
cd sites/my-site
npm run dev                   # dev server
npm run build                 # type-check + production build
```

Names must be lowercase letters, digits and dashes (npm-friendly).
Pass `--no-install` to skip the automatic `npm install`.

## Add shadcn/ui components

Each site is shadcn-ready out of the box:

```bash
cd sites/my-site
npx shadcn@latest add card dialog input
```

## Publish a site

Build inside the site folder, then deploy its `dist/` to any static host —
see [DEPLOY.md](DEPLOY.md) for the full guide (Vercel, Netlify, Cloudflare
Pages, GitHub Pages, self-hosted).

A site can also be packaged as an **Android APK** via Capacitor:

```bash
npm run apk -- my-site        # → sites/my-site/my-site-debug.apk
```

## Layout

```
.
├── template/        # the starter every site is generated from
├── scripts/
│   └── new-site.sh  # the generator
├── sites/           # all generated websites live here
└── CLAUDE.md        # workflow guidance for Claude Code
```
