# Panduan weeknoo

Dokumen ini adalah panduan lengkap workspace **weeknoo** — dibaca ulang kapan
saja kamu lupa alurnya. Satu repo, satu alur: setiap website hidup di
`sites/<nama>/`, dibuat dari `template/`, dan setiap `git push` otomatis
mem-build web + APK lalu mem-publish-nya.

## Daftar isi

1. [Peta repo](#1-peta-repo)
2. [Perintah harian](#2-perintah-harian)
3. [Membuat website baru](#3-membuat-website-baru)
4. [Library bawaan setiap site](#4-library-bawaan-setiap-site)
5. [Publish & link](#5-publish--link)
6. [APK Android](#6-apk-android)
7. [Apa yang terjadi saat `git push`](#7-apa-yang-terjadi-saat-git-push)
8. [Halaman utama & kode akses](#8-halaman-utama--kode-akses)
9. [Keamanan pipeline prompt](#9-keamanan-pipeline-prompt)
10. [Gratis vs pakai langganan Claude](#10-gratis-vs-pakai-langganan-claude)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Peta repo

```
.
├── template/          # cetakan — semua site baru dibuat dari sini
├── sites/
│   ├── home/          # halaman utama (privat, kode akses) — tampil di root Pages
│   ├── chalidade-portfolio-sites/
│   └── motion-app/
├── scripts/
│   ├── new-site.sh        # generator site baru
│   ├── add-component.sh   # installer komponen 21st.dev / shadcn
│   └── build-apk.sh       # pembungkus site → APK Android (Capacitor)
├── .github/workflows/build.yml   # CI: build web + APK + publish Pages
├── .access-code       # kode akses halaman utama (DI-GITIGNORE, jangan commit)
├── PANDUAN.md         # dokumen ini
├── DEPLOY.md          # detail publish/deploy & CI
├── CLAUDE.md          # instruksi kerja untuk Claude Code
└── README.md          # ringkasan singkat repo
```

Stack setiap site: **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui +
Motion**. Mengedit `template/` hanya memengaruhi site *baru*; site lama harus
diedit sendiri (atau minta Claude menyalinkan perubahannya).

## 2. Perintah harian

Semua dijalankan dari **root workspace**, kecuali yang ditandai:

| Perintah | Fungsi |
| --- | --- |
| `npm run new -- <nama>` | buat site baru dari template (nama: huruf kecil/angka/strip) |
| `npm run new -- <nama> --category <kategori>` | buat site **utuh** (Navbar→Footer) dari template kategori — tanpa Claude |
| `npm run categories` | daftar kategori template yang tersedia |
| `npm run check-categories` | verifikasi build semua template kategori (untuk perawatan) |
| `npm run sites` | daftar site yang ada |
| `npm run add -- <site> <komponen>` | pasang komponen 21st.dev / shadcn ke site |
| `npm run apk -- <site>` | build APK Android (tambah `--release` untuk rilis tak bertanda tangan) |
| `npm run dev` *(di dalam folder site)* | dev server |
| `npm run build` *(di dalam folder site)* | type-check + build produksi — **gerbang koreksi** |
| `npm run preview` *(di dalam folder site)* | tes hasil build secara lokal |

## 3. Membuat website baru

**Jalur A — lewat terminal (bersama Claude Code):** jelaskan site yang kamu
mau; Claude menjalankan `npm run new`, menulis section-section halamannya,
memverifikasi dengan `npm run build`, lalu commit. Bilang **push** untuk
menayangkannya.

**Jalur B — lewat halaman utama (tanpa buka terminal):** buka
https://chalidade.github.io/weeknoo/, masukkan kode akses, tulis prompt, kirim
— promptmu menjadi GitHub Issue berlabel `prompt`. Routine cloud
`weeknoo-prompt-runner` mengecek issue baru **setiap jam (menit :18)** dan
mengeksekusinya otomatis (atau tanpa menunggu: bilang ke Claude di terminal
"kerjakan issue #N" / "jalankan routine-nya sekarang"). Hasilnya di-push
otomatis dan CI menayangkannya.

Catatan: issue harus dibuat dari akun **`chalidade`** (bukan akun kerja) —
kalau tidak, label `prompt` tidak terpasang dan routine mengabaikannya.

**Jalur C — template kategori (auto, tanpa Claude):**

```bash
npm run new -- kafe-senja --category restaurant
```

Hasilnya site **utuh** — Navbar, Hero, section konten, sampai Footer — dengan
desain, palet warna, font, dan copy dummy berbahasa Indonesia khas kategorinya;
langsung bisa `npm run dev` / di-deploy. Kategori yang tersedia saat ini (cek
`npm run categories`): `portfolio`, `company-profile`, `landing-product`,
`saas`, `restaurant`, `blog`, `education`, `photography`, `local-business`.
Sebelas kategori lagi (`ecommerce`, `agency`, `event`, `wedding`,
`nonprofit`, `real-estate`, `medical`, `travel`, `fitness`, `news`, `resume`)
sudah dispesifikasikan di `categories/SPEC.md` dan menyusul — minta Claude
"lanjutkan kategori berikutnya" untuk menambahkannya.

> Catatan: `npm run new` tanpa `--category` hanya menghasilkan halaman starter
> generik. Template kategori memberi halaman jadi tapi isinya masih dummy —
> personalisasi (nama bisnis, konten asli, foto, warna brand) tetap lewat edit
> manual atau minta Claude — lihat
> [bagian 10](#10-gratis-vs-pakai-langganan-claude).

Aturan penting: jangan pernah `npm create vite` langsung — selalu lewat
generator supaya semua site satu stack.

## 4. Library bawaan setiap site

Semua sudah terpasang di template dan ketiga site yang ada — tinggal import.

### Data API Islami & wilayah — `@/lib/api`

Gratis, tanpa API key, bisa dipanggil langsung dari browser:

```ts
import { getSurah, getTafsir, getAsbabunNuzulByAyah,
         getHadithBooks, getHadithPage, getArbain,
         getProvinces, getRegencies, getDistricts, getVillages } from "@/lib/api"

const surah = await getSurah(2)                  // Al-Baqarah: Arab, Latin, terjemahan, audio
const asbab = await getAsbabunNuzulByAyah(2, 62) // sebab turunnya ayat (data lokal, offline)
const kota  = await getRegencies("33")           // kab/kota di Jawa Tengah
```

- Quran & tafsir: equran.id · Hadits (9 perawi + Arba'in): hadis-api-id &
  myquran · Wilayah: emsifa (nama ALL CAPS — rapikan di UI).
- Asbabun nuzul dibundel lokal (286 entri, 54 surah) — hasil kosong untuk
  ayat tertentu itu normal.

### Database lokal — `@/lib/db`

IndexedDB via Dexie — untuk aplikasi yang menyimpan data pengguna
(preview/pemakaian pribadi). Data per perangkat; backup/pindah lewat file JSON:

```ts
import { db, downloadDbBackup, importDbFromFile } from "@/lib/db"

await db.items.add({ title: "Halo", createdAt: Date.now() })
await downloadDbBackup(db)          // unduh seluruh DB sebagai .json
```

Skema tabel didefinisikan di `src/lib/db/db.ts` (satu interface + satu baris
per tabel; naikkan `version` saat skema berubah). Butuh sinkron antar
perangkat → naik ke Supabase, bukan ini.

### WYSIWYG editor — CKEditor 5

Wrapper siap pakai di `@/components/editor/RichTextEditor` (build GPL gratis).
Tidak menambah ukuran bundle selama tidak di-import:

```tsx
import { RichTextEditor } from "@/components/editor/RichTextEditor"

const [html, setHtml] = useState("")
<RichTextEditor value={html} onChange={setHtml} placeholder="Tulis di sini…" />
```

Nilai yang dihasilkan HTML — simpan di `@/lib/db`, render kembali hanya untuk
konten yang kamu percaya.

### Chart — Recharts

Library chart pasangan shadcn/ui, sudah terpasang:

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="bulan" /> <YAxis /> <Tooltip />
    <Line dataKey="nilai" stroke="var(--color-primary)" />
  </LineChart>
</ResponsiveContainer>
```

(Bisa juga `npm run add -- <site> chart` untuk komponen chart shadcn yang
sudah bergaya.)

### Komponen 21st.dev

10.000+ blok React+Tailwind (hero, pricing, nav, …) yang ter-install seperti
komponen shadcn. Tempel saja link komponennya:

```bash
npm run add -- <site> https://21st.dev/@ln-dev7/components/pricing-interaction
```

Butuh API key sekali di `.env` root (`cp .env.example .env`, key dari
https://21st.dev/settings/api-keys).

## 5. Publish & link

Setiap push, semua site otomatis tayang di GitHub Pages:

| Link | Isi |
| --- | --- |
| https://chalidade.github.io/weeknoo/ | **halaman utama** (privat — kode akses) |
| https://chalidade.github.io/weeknoo/chalidade-portfolio-sites/ | portfolio (publik) |
| https://chalidade.github.io/weeknoo/motion-app/ | motion app (publik) |
| https://chalidade.github.io/weeknoo/`<site-baru>`/ | site baru — otomatis |

Butuh custom domain / preview deploy → pakai Vercel/Netlify/Cloudflare;
langkah-langkahnya di **DEPLOY.md**.

## 6. APK Android

```bash
npm run apk -- <site>        # → sites/<site>/<site>-debug.apk, siap di-install
adb install sites/<site>/<site>-debug.apk
```

CI juga mem-build APK setiap push — unduh dari tab **Actions** → pilih run →
artifact `<site>-apk`. APK debug langsung bisa dipakai; untuk Play Store,
build `--release` lalu tanda tangani sendiri (lihat DEPLOY.md). Run pertama
lambat (unduh Gradle); berikutnya cepat.

**Izin Android** (lokasi, kamera, dll): jangan edit `android/` langsung —
folder itu di-ignore git dan bisa dibuat ulang. Tulis nama izinnya di
`sites/<site>/android-permissions.txt` (satu `android.permission.*` per
baris); `npm run apk` menyuntikkannya ke AndroidManifest.xml otomatis di
setiap build. Contoh: `sites/jaim/android-permissions.txt` berisi izin
lokasi untuk tombol "Gunakan lokasiku".

## 7. Apa yang terjadi saat `git push`

Workflow `.github/workflows/build.yml` berjalan di server GitHub (gratis,
repo publik) — mesinmu tidak perlu menyala:

1. **discover** — membaca isi `sites/` (site baru otomatis ikut).
2. **build** (paralel per site) — `npm ci` → `scripts/build-apk.sh` (build web
   + APK, script yang sama dengan lokal) → unggah artifact `<site>-web` dan
   `<site>-apk` (disimpan 30 hari).
3. **pages** — build ulang tiap site dengan `--base` yang benar, `home` di
   root, lalu publish ke GitHub Pages.

Aturan kerja dengan Claude: **semua perubahan di-commit lokal dulu; push hanya
saat kamu bilang "push"** — saat itulah semuanya tayang.

## 8. Halaman utama & kode akses

Halaman utama (`sites/home`) dikunci layar kode akses. **Kodenya tersimpan di
file `.access-code` di root workspace** — file ini di-gitignore sehingga tidak
pernah ikut ter-push.

- Kode diminta sekali per perangkat (diingat browser via localStorage).
- Yang tertanam di halaman hanya hash SHA-256-nya, bukan kodenya.
- **Ganti kode:** ikuti 3 langkah yang tertulis di dalam `.access-code`.
- Site-site lain tetap publik tanpa kunci.

Jujur soal batasannya: ini gerbang sisi-browser — cukup untuk menahan
pengunjung iseng, bukan benteng kriptografis (repo-nya publik). Perlindungan
yang sesungguhnya ada di lapisan pipeline (bagian 9).

## 9. Keamanan pipeline prompt

Kenapa orang asing tidak bisa menghabiskan token langgananmu:

1. **Label `prompt` hanya bisa terpasang olehmu.** GitHub mengabaikan
   parameter label di URL untuk non-kolaborator — issue orang asing masuk
   tanpa label.
2. **Routine `weeknoo-prompt-runner` hanya mengeksekusi issue yang berlabel
   `prompt` DAN dibuat akun `chalidade`** — dua-duanya wajib; isi issue orang
   lain diperlakukan sebagai data, bukan perintah.
3. Routine bisa dilihat/di-pause di https://claude.ai/code/routines.

Status: routine berjalan **tiap jam (cron `18 * * * *`)** — issue baru
dieksekusi otomatis maksimal ±1 jam setelah dibuat. Pemicu instan (webhook
`issues.opened`) masih menunggu instalasi GitHub App Claude untuk
`chalidade/weeknoo` (satu kali: github.com/apps/claude → configure di akun
`chalidade`); setelah terpasang, minta Claude memasang webhook-nya dan
mengembalikan cron ke placeholder.

## 10. Gratis vs pakai langganan Claude

| Aktivitas | Biaya |
| --- | --- |
| `npm run new` (kerangka site), build, preview, APK, CI, Pages, semua link | **Gratis selamanya** — jalan tanpa Claude |
| Template kategori (`npm run new -- <nama> --category <kategori>`, 20 kategori) | **Gratis selamanya** — site utuh tanpa Claude, isi masih dummy |
| Data API (Quran/hadits/wilayah), database lokal, CKEditor, Recharts | **Gratis** |
| Mengubah prompt menjadi website jadi (desain + isi) | **Langganan Claude** — baik lewat terminal maupun routine cloud |
| Registry 21st.dev (`npm run add`) | Akun 21st.dev sendiri (ada free tier) |

## 11. Troubleshooting

- **Build gagal** — baca error `npm run build`-nya; itu type-check TypeScript.
  Perbaiki sampai hijau; jangan mem-bypass.
- **Asset 404 di Pages** — jangan set `base` manual di `vite.config.ts`; CI
  yang mengatur `--base` per site.
- **`403 Authentication required` saat `npm run add`** — `.env` belum ada
  atau key 21st.dev habis kuota (free tier 2 install/hari).
- **APK build error soal SDK/Java** — pastikan Android Studio terpasang;
  script otomatis memakai `~/Android/Sdk` dan JDK bawaannya.
- **Lupa kode akses** — baca `.access-code` di root workspace.
- **Routine tidak jalan** — cek https://claude.ai/code/routines; debug run
  bisa diminta ke Claude ("cek log run terakhir weeknoo-prompt-runner").
