# Tema WordPress dari sebuah Site

Setiap site di `sites/<nama>/` bisa dikemas jadi **tema blok WordPress** yang
tinggal di-upload lewat halaman admin. Satu perintah, satu berkas `.zip`.

```bash
npm run wp -- <nama-site>
```

Prosesnya jalan sepenuhnya di laptopmu — skrip bash + Node biasa, tanpa AI,
tanpa API key, tanpa layanan apa pun. Sama seperti `npm run apk`.

## Daftar isi

1. [Apa yang kamu dapat](#1-apa-yang-kamu-dapat)
2. [Syarat](#2-syarat)
3. [Cara pakai](#3-cara-pakai)
4. [Memasang di WordPress](#4-memasang-di-wordpress)
5. [Isi temanya](#5-isi-temanya)
6. [Yang bisa diedit di WordPress, yang tidak](#6-yang-bisa-diedit-di-wordpress-yang-tidak)
7. [Memperbarui tema setelah site berubah](#7-memperbarui-tema-setelah-site-berubah)
8. [Site mana yang cocok](#8-site-mana-yang-cocok)
9. [Menguji sendiri di WordPress lokal](#9-menguji-sendiri-di-wordpress-lokal)
10. [Cara kerjanya (untuk yang mau mengubah generator)](#10-cara-kerjanya-untuk-yang-mau-mengubah-generator)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Apa yang kamu dapat

Sebuah tema blok WordPress lengkap — bukan sekadar HTML yang dibungkus:

- **Halaman depan yang sama persis** dengan versi React-nya. Diuji berdampingan
  di WordPress sungguhan: identik piksel demi piksel.
- **Palet dan font ikut pindah.** Token `:root` di `src/index.css` diterjemahkan
  ke `theme.json`, jadi warna site muncul di color picker WordPress.
- **Teks bisa diedit** langsung di Site Editor — judul dan paragraf jadi blok
  Heading/Paragraph biasa.
- **Tiap section jadi block pattern**, bisa disisipkan ulang di halaman lain.
- **Halaman dan artikel WordPress tetap jalan** — template `page`, `single`,
  `archive`, `search`, dan `404` ikut dibuat dengan tipografi yang serasi.
- **Animasi muncul saat di-scroll**, versi CSS dari animasi Motion di site asli.

Yang **tidak** ikut: interaksi React. Tema ini snapshot statis — lihat
[bagian 8](#8-site-mana-yang-cocok).

## 2. Syarat

| Perkakas | Wajib? | Kalau tidak ada |
| --- | --- | --- |
| Node.js `^20.19` atau `>=22.12` + npm | ✅ | tidak jalan |
| `zip` | ✅ | gagal saat mengemas (`sudo apt install zip`) |
| Google Chrome / Chromium | opsional | tema tetap valid, hanya tanpa gambar pratinjau di daftar tema WordPress |
| Python 3 + Pillow | opsional | pratinjau tidak dikecilkan — zip jadi ~1,2 MB, bukan ~180 KB |

Di sisi WordPress: **versi 6.6 ke atas** (butuh dukungan `theme.json` v3).
Diuji pada WordPress 7.1.

Run pertama untuk sebuah site butuh internet kalau folder site-nya belum pernah
di-`npm install`. Setelah itu offline pun bisa.

## 3. Cara pakai

Dari **root workspace**:

```bash
npm run wp -- kopi-senja
```

Keluarannya dua, keduanya di-ignore git:

```
sites/kopi-senja/kopi-senja-wp-theme.zip   ← ini yang di-upload
sites/kopi-senja/wp-theme/kopi-senja/      ← salinan terbuka, untuk diperiksa
```

Contoh keluaran di terminal:

```
==> Membangun situs (npm run build)
==> Menyiapkan entri prerender
sections: Hero, Menu, Testimonials, Visit, Footer
==> Merender section ke HTML statis
==> Merakit tema blok
theme:     Kopi Senja (kopi-senja)
sections:  5 (footer: Footer)
patterns:  hero, menu, testimonials, visit, footer
palette:   15 warna, 1 keluarga font
blocks:    8 heading, 8 paragraf, 40 group, 34 html
==> Mengambil screenshot.png
==> Mengemas kopi-senja-wp-theme.zip
```

### Opsi

| Opsi | Gunanya |
| --- | --- |
| `--no-screenshot` | lewati pengambilan pratinjau lewat Chrome — lebih cepat |
| `--no-install` | jangan `npm install` otomatis; gagal kalau `node_modules` belum ada |
| `--keep-build` | simpan `.wp-build/` (entri prerender + HTML antara) untuk diperiksa |

### Nama tema

Diambil dari `<title>` di `index.html` site-nya. Kalau kosong atau masih
`__SITE_NAME__`, dipakai nama foldernya dengan huruf awal kapital. Deskripsi
tema diambil dari `<meta name="description">`.

## 4. Memasang di WordPress

1. Masuk ke admin WordPress.
2. **Appearance → Themes → Add New Theme → Upload Theme**.
3. Pilih `sites/<nama>/<nama>-wp-theme.zip` → **Install Now**.
4. **Activate**.

Selesai. Buka halaman depan situsnya.

> **Kalau upload ditolak "exceeds the maximum upload size"** — banyak hosting
> membatasi upload di 2 MB. Zip tema biasanya ~100–200 KB jadi aman, tapi kalau
> site-mu punya banyak berkas di `public/`, ukurannya bisa membengkak. Naikkan
> `upload_max_filesize` di PHP, atau upload folder `wp-theme/<nama>/` lewat FTP
> ke `wp-content/themes/`.

Kalau punya akses WP-CLI, lebih cepat:

```bash
wp theme install /path/ke/kopi-senja-wp-theme.zip --activate
```

## 5. Isi temanya

```
kopi-senja/
├── style.css              # header tema (nama, versi, lisensi) — WordPress membacanya dari sini
├── theme.json             # palet + font, diturunkan dari src/index.css
├── functions.php          # memuat CSS, webfont, dan resource hint
├── screenshot.jpg         # pratinjau di daftar tema (1200×900)
├── assets/
│   └── theme.css          # CSS Tailwind hasil compile + blok interop WordPress
├── templates/
│   ├── index.html         # halaman depan — susunannya mengikuti App.tsx
│   ├── page.html          # halaman WordPress
│   ├── single.html        # artikel
│   ├── archive.html       # daftar artikel
│   ├── search.html        # hasil pencarian
│   └── 404.html
├── parts/
│   ├── header.html        # dari section bernama Nav / Navbar / Header
│   └── footer.html        # dari section bernama Footer
├── patterns/
│   ├── hero.php           # satu pattern per section
│   ├── menu.php
│   └── …
└── public/                # salinan public/ milik site, kalau ada
```

**Pemetaan nama section:**

| Nama section di `App.tsx` | Jadi apa |
| --- | --- |
| `Nav`, `Navbar`, `Header`, `Topbar`, `Menubar`, `SiteHeader` | `parts/header.html` |
| `Footer` | `parts/footer.html` |
| selain itu | isi `templates/index.html`, di dalam `<main>` |

Semua section — termasuk header dan footer — juga dibuatkan pattern-nya, jadi
bisa disisipkan di halaman lain lewat menu **Patterns** di editor.

**Pemetaan token warna** (`src/index.css` → `theme.json`): `background`,
`foreground`, `primary`, `primary-foreground`, `secondary`,
`secondary-foreground`, `muted`, `muted-foreground`, `accent`,
`accent-foreground`, `card`, `card-foreground`, `destructive`, `border`, `ring`.
Font diambil dari `--font-display`, `--font-sans`, `--font-serif`, `--font-mono`
kalau ada.

## 6. Yang bisa diedit di WordPress, yang tidak

### Bisa diedit langsung

- **Judul dan paragraf** — jadi blok Heading dan Paragraph. Klik, ketik, simpan.
- **Warna dan font** — dari **Appearance → Editor → Styles**, karena berasal dari
  `theme.json`.
- **Urutan dan susunan section** — tiap section jadi blok Group yang bisa
  dipindah, digandakan, atau dihapus.
- **Isi halaman dan artikel** — seperti WordPress biasa.

### Tersimpan apa adanya sebagai blok HTML

Ikon, gambar, dan elemen yang markup-nya tidak akan bertahan bolak-balik lewat
`save()` milik blok inti. Tampilannya dijamin persis benar; mengeditnya lewat
markup, bukan lewat kolom teks.

Alasannya bukan kemalasan: kalau markup tersimpan berbeda sedikit saja dari
yang dihasilkan blok inti, WordPress menandainya *"This block contains
unexpected or invalid content"* di editor. Generator ini memilih aman —
mengubah jadi blok inti **hanya** kalau hasilnya pasti sama.

### Hilang

- **Interaksi React** — form, tab, akordeon, chart, apa pun yang butuh state.
- **Animasi Motion** — diganti animasi CSS saat di-scroll
  (`animation-timeline: view()`). Sengaja pakai CSS, bukan JavaScript: kalau
  browser-nya tidak mendukung, kontennya tetap tampil — tidak pernah
  tersembunyi selamanya. Section pertama tidak dianimasikan karena ada di atas
  lipatan.

## 7. Memperbarui tema setelah site berubah

Jangan edit isi `sites/<nama>/wp-theme/` — folder itu **dihapus dan dibuat ulang
setiap build**. Ubah site-nya, lalu:

```bash
npm run wp -- kopi-senja
```

Upload ulang zip-nya. WordPress akan bertanya apakah mau mengganti tema yang
sudah ada — pilih **Replace current with uploaded**.

> ⚠️ **Perubahan yang kamu buat lewat Site Editor akan tetap bertahan** dan
> justru menimpa tema barunya. WordPress menyimpan template yang sudah diedit
> di database, bukan di berkas tema. Kalau ingin kembali ke bawaan tema:
> **Appearance → Editor → Templates → pilih template → Reset**. Jadi tentukan
> di awal: mau mengedit di React lalu generate ulang, atau mengedit di
> WordPress. Mencampur keduanya bikin bingung.

## 8. Site mana yang cocok

| Cocok | Kurang cocok |
| --- | --- |
| Portfolio, company profile, landing product, restoran, blog, sekolah, fotografi, usaha lokal | Aplikasi: `ask` (chat AI), `jaim` (tracker ibadah), `motion-app` |

Site berupa aplikasi tetap bisa di-build, tapi yang kamu dapat cuma tampilan
awalnya tanpa fungsi apa pun. Untuk itu pakai site biasa (GitHub Pages) atau
APK.

`motion-app` bahkan akan ditolak dengan pesan jelas, karena `App.tsx`-nya tidak
mengikuti konvensi satu-berkas-per-section:

```
error: no sections found in src/App.tsx — App must import and render
self-closing section components (see CLAUDE.md "Design direction")
```

## 9. Menguji sendiri di WordPress lokal

Tidak perlu hosting. WordPress bisa jalan di laptop pakai SQLite dan server
bawaan PHP. Butuh PHP 7.4+ dengan ekstensi `pdo_sqlite` (`php -m | grep sqlite`).

```bash
mkdir -p ~/wp-test && cd ~/wp-test

# 1. Unduh WordPress, plugin SQLite, dan WP-CLI
curl -sSL -o latest.zip  https://wordpress.org/latest.zip
curl -sSL -o sqlite.zip  https://downloads.wordpress.org/plugin/sqlite-database-integration.zip
curl -sSL -o wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
unzip -q latest.zip
unzip -q sqlite.zip -d wordpress/wp-content/plugins/

# 2. Pasang drop-in SQLite (salin apa adanya — placeholder di dalamnya
#    sudah punya fallback ke lokasi yang benar)
cp wordpress/wp-content/plugins/sqlite-database-integration/db.copy \
   wordpress/wp-content/db.php

# 3. wp-config.php minimal
cat > wordpress/wp-config.php <<'EOF'
<?php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', '' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );
define( 'AUTH_KEY', 'a' ); define( 'SECURE_AUTH_KEY', 'b' ); define( 'LOGGED_IN_KEY', 'c' );
define( 'NONCE_KEY', 'd' ); define( 'AUTH_SALT', 'e' ); define( 'SECURE_AUTH_SALT', 'f' );
define( 'LOGGED_IN_SALT', 'g' ); define( 'NONCE_SALT', 'h' );
$table_prefix = 'wp_';
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
if ( ! defined( 'ABSPATH' ) ) { define( 'ABSPATH', __DIR__ . '/' ); }
require_once ABSPATH . 'wp-settings.php';
EOF

# 4. Instal WordPress
cd wordpress
php ../wp-cli.phar core install --url=http://localhost:8099 --title="Uji Tema" \
  --admin_user=admin --admin_password=admin123 --admin_email=uji@example.com --skip-email

# 5. Pasang temamu
php ../wp-cli.phar theme install ~/Documents/Project/Chalid/sites/kopi-senja/kopi-senja-wp-theme.zip --activate

# 6. Jalankan
PHP_CLI_SERVER_WORKERS=6 php -S localhost:8099 -t .
```

Buka <http://localhost:8099> untuk halaman depan, `/wp-admin` untuk admin
(`admin` / `admin123`).

Untuk memasang ulang setelah generate ulang, tambahkan `--force`:

```bash
php ../wp-cli.phar theme install <path-zip> --force
```

Cek error PHP di `wordpress/wp-content/debug.log` — kalau kosong, bersih.

## 10. Cara kerjanya (untuk yang mau mengubah generator)

Berkasnya:

```
scripts/build-wp.sh            # orkestrator: build → prerender → rakit → zip
scripts/wp/gen-entry.mjs       # baca App.tsx, tulis entri SSR
scripts/wp/build-theme.mjs     # HTML → markup blok, rakit semua berkas tema
scripts/wp/lib/html.mjs        # parser HTML kecil untuk keluaran React
scripts/wp/lib/blocks.mjs      # aturan konversi elemen → blok WordPress
```

Alurnya:

1. **`npm run build`** di dalam site — tetap gerbang type-check, sekaligus
   sumber CSS Tailwind terkompilasi yang jadi stylesheet tema.
2. **`gen-entry.mjs`** membaca `src/App.tsx`, mengambil komponen yang di-import
   dan di-render sebagai tag self-closing (`<Hero />`), lalu menulis entri SSR
   yang merender **tiap section sendiri-sendiri** dengan `renderToStaticMarkup`.
   Di sinilah konvensi satu-berkas-per-section terbayar: batas antar-section
   selamat sampai ke tema.
3. **`vite build --ssr`** mengompilasi entri itu, lalu Node menjalankannya dan
   menghasilkan satu HTML per section.
4. **`build-theme.mjs`** membersihkan HTML-nya, mengubahnya jadi markup blok,
   dan menulis seluruh berkas tema.

### Aturan konversi

Sebuah elemen jadi blok inti **hanya** kalau keluaran `save()` blok itu pasti
identik dengan markup yang sudah ada — kalau tidak, WordPress menandainya
sebagai konten tidak valid di editor. Praktisnya:

| Elemen | Jadi |
| --- | --- |
| `<h1>`–`<h6>` berisi teks/inline saja | `core/heading` |
| `<p>` berisi teks/inline saja | `core/paragraph` |
| `<div>`, `<section>`, `<header>`, `<footer>`, `<main>`, `<article>`, `<aside>` yang anaknya semua elemen | `core/group` |
| selebihnya (ikon SVG, `<img>`, `<ul>`, elemen dengan atribut `data-*`/`aria-*`, konten campur teks+elemen) | `core/html` |

Atribut yang boleh ikut hanya `class` (jadi `className`) dan `id` (jadi
`anchor`). Ada atribut lain → langsung `core/html`.

### Dua jebakan yang menentukan bentuk implementasinya

**1. Cascade layer.** Tailwind v4 menaruh semua keluarannya di dalam `@layer`
(`properties`, `theme`, `base`, `components`, `utilities`). CSS blok bawaan
WordPress **tanpa layer** — dan dalam CSS, aturan tanpa layer mengalahkan
aturan berlayer *berapa pun spesifisitasnya*. Akibat nyatanya:
`:where(figure){margin:0 0 1em}` milik WordPress mengalahkan preflight Tailwind
dan menambah 16px di bawah satu section.

Karena itu `build-theme.mjs` **melucuti pembungkus `@layer`** dari CSS Tailwind
sebelum menulis `assets/theme.css`, supaya kedua stylesheet bersaing pada
spesifisitas biasa — di situ utility Tailwind (`.mx-auto`, 0-1-0) menang atas
`:where(...)` milik WordPress (0-0-0).

Konsekuensinya: **jangan menulis reset menyeluruh** di blok interop
`build-theme.mjs`. Aturan seperti `.wp-block-group { margin: 0 }` akan
mengalahkan `mx-auto` dan `mt-6` pada section — itu persis bug yang bikin hero
melenceng ke kiri saat pertama dibangun. Tulis yang sempit dan spesifik.

**2. Tailwind hanya meng-compile kelas yang benar-benar dipakai site.** Jangan
pernah menggayakan template `page`/`single`/`404` dengan utility Tailwind —
`text-4xl` yang kebetulan tidak dipakai section mana pun **tidak ada** di CSS
hasil compile, dan judul halaman jadi kecil tanpa gejala lain. Template-template
itu memakai kelas milik tema sendiri (`site-main`, `site-content`, `site-title`)
yang digayakan di blok interop.

### Hal kecil lain yang sudah ditangani

- React 19 merender `<link rel="preload">` sebaris dengan markup; itu
  dipindahkan ke `wp_head` lewat `functions.php`.
- Motion merender state awalnya sebagai inline style (`opacity:0`), yang di
  server berarti section terkirim dalam keadaan tak terlihat — deklarasi itu
  dibuang.
- Vite menyajikan `public/` dari root; di WordPress berkasnya pindah ke dalam
  tema, jadi URL root-relative ditulis ulang.
- `<main class="site-main">` ditambahkan mengikuti `App.tsx`, plus pola sticky
  footer supaya halaman pendek tidak menyisakan ruang kosong di bawah footer.

## 11. Troubleshooting

| Gejala | Sebab & solusi |
| --- | --- |
| `error: no sections found in src/App.tsx` | `App.tsx` tidak mengikuti konvensi. Harus meng-import dan merender komponen section sebagai tag self-closing (`<Hero />`). |
| `error: site not found: sites/<nama>` | Salah nama. Cek dengan `npm run sites`. |
| `error: no CSS in sites/<nama>/dist/assets` | `npm run build` gagal — perbaiki error TypeScript-nya dulu. |
| `error: could not unwrap Tailwind cascade layers cleanly` | Pengaman. Format keluaran Tailwind berubah dan pelucut `@layer` tidak lagi cocok. Lihat `stripCascadeLayers()` di `build-theme.mjs`. |
| Skrip berhenti di langkah zip | `zip` belum terpasang: `sudo apt install zip`. |
| `(Chrome tidak ditemukan — melewati screenshot)` | Wajar. Tema tetap valid, hanya tanpa gambar pratinjau. Boleh taruh `screenshot.png` (1200×900) sendiri di folder tema sebelum di-zip. |
| Tema aktif tapi halaman depan kosong / tampil default | Cek **Settings → Reading**; kalau "Your homepage displays" diarahkan ke sebuah halaman statis, WordPress memakai template `page`, bukan `index`. Pilih "Your latest posts". |
| Tata letak berantakan setelah upgrade WordPress | Kemungkinan CSS blok inti berubah. Generate ulang temanya; kalau masih, tambahkan aturan sempit di blok interop `build-theme.mjs` (baca [bagian 10](#10-cara-kerjanya-untuk-yang-mau-mengubah-generator) soal cascade layer). |
| Editor menandai "unexpected or invalid content" | Laporkan — artinya ada aturan konversi yang meleset. Sementara itu tampilan di halaman depan tetap benar. |
| Perubahan dari generate ulang tidak muncul | Template yang pernah diedit di Site Editor tersimpan di database dan menimpa berkas tema. **Appearance → Editor → Templates → Reset**. |
| Tulisan di halaman/artikel tampak polos | Preflight Tailwind memang meratakan heading dan list. Tipografinya dikembalikan lewat aturan `.wp-block-post-content` di blok interop — kalau kurang, tambahkan di sana. |

---

Dokumen terkait: [PANDUAN.md](PANDUAN.md) (panduan workspace),
[INSTALL.md](INSTALL.md) (memasang repo ini), [DEPLOY.md](DEPLOY.md) (publish
web & APK).
