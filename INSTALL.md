# Memasang workspace ini di komputer sendiri

Repo ini adalah **workspace website**: satu repo, satu alur. Setiap website
hidup mandiri di `sites/<nama>/`, dibuat dari `template/`, dan punya
`node_modules`-nya sendiri. Tidak ada monorepo, tidak ada tooling workspace,
dan **root repo sendiri tidak punya dependensi sama sekali** — jadi tidak perlu
`npm install` di root.

Dokumen ini untuk kamu yang baru mengambil repo ini dan ingin menjalankannya di
laptop sendiri.

## Daftar isi

1. [Syarat minimum](#1-syarat-minimum)
2. [Pasang](#2-pasang)
3. [Bikin website pertama](#3-bikin-website-pertama)
4. [Perkakas tambahan, per fitur](#4-perkakas-tambahan-per-fitur)
5. [Peta repo & bacaan lanjutan](#5-peta-repo--bacaan-lanjutan)
6. [Memakai repo ini untuk akun GitHub sendiri](#6-memakai-repo-ini-untuk-akun-github-sendiri)
7. [Troubleshooting pemasangan](#7-troubleshooting-pemasangan)

---

## 1. Syarat minimum

Cuma tiga, dan dua di antaranya biasanya sudah ada:

| Perkakas | Versi | Cek |
| --- | --- | --- |
| **Node.js + npm** | `^20.19` atau `>=22.12` | `node -v && npm -v` |
| **Git** | apa saja yang wajar | `git --version` |
| **Bash** | 4+ (bawaan Linux/macOS) | `bash --version` |

Batas versi Node datang dari Vite 8. Kalau Node-mu lebih tua, pakai
[nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 22 && nvm use 22
```

**Windows:** semua skrip di `scripts/` adalah bash. Jalankan lewat **WSL2**
(Ubuntu) atau Git Bash. Di WSL2 semuanya bekerja seperti di Linux.

**macOS:** bash bawaan macOS versi 3.2 dan terlalu tua. Pasang yang baru:
`brew install bash`.

Selebihnya opsional dan hanya dibutuhkan kalau kamu memakai fitur terkait —
lihat [bagian 4](#4-perkakas-tambahan-per-fitur).

## 2. Pasang

```bash
git clone https://github.com/chalidade/weeknoo.git
cd weeknoo
```

Sudah. Tidak ada langkah instalasi di root.

Pastikan berjalan:

```bash
npm run sites        # daftar site yang ada di repo
npm run categories   # daftar template kategori
```

Untuk menjalankan salah satu site yang sudah ada, install dependensinya dulu
(sekali per site):

```bash
cd sites/kopi-senja
npm install          # ~330 paket
npm run dev          # buka URL yang muncul
```

Setiap site punya `node_modules` sendiri dan tidak saling berbagi. Itu
disengaja: satu site rusak tidak menyeret yang lain.

## 3. Bikin website pertama

Selalu lewat generator — jangan `npm create vite` sendiri, supaya semua site
tetap satu stack:

```bash
# dari root workspace
npm run new -- situs-saya                          # starter kosong
npm run new -- situs-saya --category restaurant    # halaman utuh dari template kategori
npm run categories                                 # lihat kategori yang tersedia
```

Generator menyalin `template/` ke `sites/situs-saya/`, mengganti placeholder
`__SITE_NAME__`, lalu menjalankan `npm install` otomatis. Nama site harus huruf
kecil, angka, dan strip (`^[a-z0-9][a-z0-9-]*$`).

Lalu:

```bash
cd sites/situs-saya
npm run dev       # dev server
npm run build     # type-check + build produksi — ini gerbang koreksinya
npm run preview   # cek hasil build
```

Tidak ada test runner terpisah. **`npm run build` adalah gerbang koreksinya** —
dia meng-type-check seluruh aplikasi sebelum mem-bundle.

Menghapus site:

```bash
npm run delete -- situs-saya    # minta konfirmasi ketik ulang nama
```

## 4. Perkakas tambahan, per fitur

Semua di bawah ini opsional. Pasang hanya kalau kamu memakai fiturnya.

### Komponen 21st.dev

Untuk memasang komponen dari registry `@21st/*` (`npm run add -- <site> …`),
butuh API key:

```bash
cp .env.example .env
# lalu isi TWENTY_FIRST_API_KEY dengan key dari
# https://21st.dev/settings/api-keys
```

`.env` di-ignore git, dan satu key di root melayani semua site. Tanpa key,
registry menolak dengan `403 Authentication required`. Komponen shadcn/ui biasa
tetap bisa dipasang tanpa key.

### APK Android

| Butuh | Keterangan |
| --- | --- |
| Android SDK | paling gampang lewat Android Studio |
| JDK 21+ | JDK bawaan Android Studio otomatis dipakai kalau `java` tidak ada di PATH |

```bash
npm run apk -- situs-saya            # → sites/situs-saya/situs-saya-debug.apk
npm run apk -- situs-saya --release  # APK rilis tanpa tanda tangan
```

Skrip mencari SDK di `$ANDROID_HOME`, `$ANDROID_SDK_ROOT`, `~/Android/Sdk`,
lalu `/opt/android-sdk`. Kalau tidak ketemu, set sendiri:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
```

Run pertama lambat karena mengunduh Gradle. Detail dan cara menandatangani ada
di [DEPLOY.md](DEPLOY.md).

### Tema WordPress

| Butuh | Wajib? |
| --- | --- |
| `zip` | ✅ (`sudo apt install zip`) |
| Google Chrome / Chromium | opsional — hanya untuk gambar pratinjau tema |
| Python 3 + Pillow | opsional — mengecilkan pratinjau (1,2 MB → ~180 KB) |

```bash
npm run wp -- situs-saya    # → sites/situs-saya/situs-saya-wp-theme.zip
```

Panduan lengkapnya di [WORDPRESS.md](WORDPRESS.md).

### Fitur AI (`@/lib/ai`)

Model jalan di komputer pengunjung lewat Ollama — gratis, tanpa akun, tanpa API
key, dan percakapannya tidak keluar dari perangkat.

```bash
curl -fsSL https://ollama.com/install.sh | sh   # memasang + menyalakan service
ollama pull qwen3:4b                            # ~2,5 GB, model bawaan
```

Installer langsung menyalakan `ollama.service` dan mengaktifkannya saat boot,
jadi menjalankan `ollama serve` manual sesudahnya akan gagal dengan `address
already in use` — itu tandanya jalan, bukan rusak. Cek dengan
`systemctl status ollama`.

`npm run dev` langsung bisa (localhost selalu diizinkan). Untuk site yang sudah
tayang, domainnya harus disebut eksplisit:

```bash
sudo systemctl edit ollama
# Environment="OLLAMA_ORIGINS=https://<akun>.github.io"
sudo systemctl restart ollama
```

Kalau RAM tipis, pakai `qwen3:1.7b`.

### Skill UI/UX Pro Max

Dipakai Claude Code untuk mencari palet, pasangan font, dan gaya. Dipasang
global di `~/.claude/skills/`, butuh Python 3. Tidak wajib untuk membangun
site secara manual.

## 5. Peta repo & bacaan lanjutan

```
.
├── template/          # cetakan — semua site baru dibuat dari sini
├── categories/        # overlay template per kategori (portfolio, restoran, …)
├── scripts/           # generator & tooling (bash + Node)
├── sites/
│   ├── home/          # halaman utama — tampil di root GitHub Pages
│   └── <lainnya>/     # satu folder per website, mandiri
└── .github/workflows/ # CI: build web + APK, publish ke Pages
```

| Dokumen | Isi |
| --- | --- |
| [PANDUAN.md](PANDUAN.md) | panduan lengkap workspace (bahasa Indonesia) — perintah harian, library bawaan, publish, kode akses, troubleshooting |
| [WORDPRESS.md](WORDPRESS.md) | mengemas site jadi tema WordPress |
| [DEPLOY.md](DEPLOY.md) | publish ke Vercel/Netlify/Cloudflare/Pages, dan build + tanda tangan APK |
| [CLAUDE.md](CLAUDE.md) | konvensi repo untuk Claude Code — juga bacaan bagus kalau kamu ingin tahu aturan mainnya |
| [categories/SPEC.md](categories/SPEC.md) | kontrak untuk membuat template kategori baru |

Setiap site membawa library bawaan yang siap pakai: `@/lib/api` (data Al-Qur'an,
tafsir, asbabun nuzul, hadits, wilayah Indonesia), `@/lib/db` (database lokal
Dexie/IndexedDB + backup), dan `@/lib/ai` (chat dengan reasoning lewat Ollama).
Semuanya dijelaskan di [PANDUAN.md bagian 4](PANDUAN.md#4-library-bawaan-setiap-site).

## 6. Memakai repo ini untuk akun GitHub sendiri

Kalau kamu fork atau menyalin repo ini, ada beberapa nilai yang masih menunjuk
ke repo aslinya (`chalidade/weeknoo`). Ganti semuanya sebelum push pertama.

### Wajib diganti

| Berkas | Yang harus diganti |
| --- | --- |
| `.github/workflows/build.yml` | base path Pages `/weeknoo/` → `/<nama-repo-mu>/` (baris `base="…"`, dua tempat) |
| `sites/home/src/components/Sites.tsx` | array `SITES` — URL tiap kartu `https://<akun>.github.io/<repo>/<site>/` |
| `sites/home/src/components/Hero.tsx` | konstanta `REPO` — tujuan issue dari kotak prompt |
| `sites/home/src/components/Footer.tsx` | tautan ke repo GitHub |

### Perlu diperhatikan

**Kode akses halaman utama.** `sites/home/src/components/Gate.tsx` menyimpan
SHA-256 dari kode akses (bukan kodenya). Ganti dengan milikmu:

```bash
echo -n "kode-rahasiamu" | sha256sum
# tempel hasilnya ke ACCESS_HASH
```

Ini gerbang sisi klien untuk pengunjung iseng saja — perlindungan
sesungguhnya ada di sisi pipeline. Baca
[PANDUAN.md bagian 10](PANDUAN.md#10-keamanan-pipeline-prompt).

**Pipeline prompt→issue.** Kotak prompt di halaman utama membuat GitHub issue
berlabel `prompt`. Yang mengerjakannya adalah routine Claude Code di cloud
(`weeknoo-prompt-runner`), yang **tidak ada di dalam repo ini** — itu
dikonfigurasi terpisah di <https://claude.ai/code/routines>. Kalau kamu tidak
memakainya, kotak prompt tetap berfungsi membuat issue; tidak ada yang otomatis
mengerjakannya. Kalau kamu membuat routine sendiri, pertahankan dua
pemeriksaannya: hanya jalankan issue yang **berlabel `prompt`** *dan* **ditulis
oleh pemilik repo**.

**Menyalakan GitHub Pages.** Di repo barumu: **Settings → Pages → Source →
GitHub Actions**. Workflow-nya sudah menangani sisanya — `home` di root, site
lain di `/<repo>/<site>/`.

**Site milik orang lain.** `sites/chalidade-portfolio-sites/` berisi data
pribadi pemilik repo (nama, email, foto, riwayat kerja) di `src/lib/profile.ts`.
Hapus site itu (`npm run delete -- chalidade-portfolio-sites`) atau ganti
seluruh isinya.

**Komentar di `src/lib/ai/ollama.ts`** menyebut `chalidade.github.io` sebagai
contoh `OLLAMA_ORIGINS`. Cuma komentar — tidak wajib diganti, tapi enak kalau
disesuaikan.

## 7. Troubleshooting pemasangan

| Gejala | Sebab & solusi |
| --- | --- |
| `npm run new` → `Unsupported engine` atau error sintaks aneh saat build | Node terlalu tua. Butuh `^20.19` atau `>=22.12`. Cek `node -v`. |
| `scripts/*.sh: bad substitution` atau `declare -A: invalid option` | Bash terlalu tua (macOS bawaan 3.2). `brew install bash`. |
| Skrip tidak jalan di Windows | Skripnya bash. Pakai WSL2 atau Git Bash. |
| `npm run new` → nama ditolak | Nama harus `^[a-z0-9][a-z0-9-]*$` — huruf kecil, angka, strip. |
| `npm run new` → "refuses to overwrite" | Sudah ada `sites/<nama>/`. Pilih nama lain, atau hapus dulu dengan `npm run delete`. |
| `npm run add` → `403 Authentication required` | `TWENTY_FIRST_API_KEY` belum diisi di `.env` root. |
| `npm run apk` → `Android SDK not found` | Pasang Android Studio, atau `export ANDROID_HOME=…`. |
| `npm run apk` → `java not found` | Pasang JDK 21+, atau Android Studio (JDK bawaannya terdeteksi otomatis). |
| `npm run wp` berhenti saat mengemas | `zip` belum ada: `sudo apt install zip`. |
| `npm run build` gagal di site lama setelah pull | Dependensi berubah. `cd sites/<nama> && npm install` lagi. |
| Halaman kosong saat `npm run preview` | `preview` menyajikan `dist/` — pastikan `npm run build` sudah jalan lebih dulu. |
| Fitur AI selalu bilang Ollama mati | Cek `systemctl status ollama`. Untuk site yang sudah tayang, domainnya harus masuk `OLLAMA_ORIGINS`. |

Kalau masih mentok, [PANDUAN.md bagian 12](PANDUAN.md#12-troubleshooting) punya
daftar masalah yang lebih luas seputar pemakaian sehari-hari.
