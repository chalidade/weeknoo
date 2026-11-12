# PUAS Startup — Paket Website

Isi folder ini adalah website statis yang sudah di-build dan dioptimasi. Tidak
perlu Node.js, database, atau PHP di server — cukup upload.

## Cara upload

**cPanel / Hostinger / Niagahoster (Apache/LiteSpeed)**
1. Buka File Manager → masuk ke `public_html` (atau folder subdomain).
2. Upload `puas-startup.zip`, lalu klik **Extract**.
3. Pastikan file `.htaccess` ikut ter-extract (aktifkan "Show Hidden Files").
4. Aktifkan SSL (AutoSSL / Let's Encrypt) di cPanel.

**Netlify / Cloudflare Pages** — drag & drop folder hasil extract. File
`_headers` otomatis dibaca.

**Vercel** — upload folder hasil extract; `vercel.json` otomatis dibaca.

**Nginx (VPS)** — salin isi folder ke `/var/www/puas-startup`, lalu pakai
`nginx.conf.example` sebagai acuan blok `server`.

## Yang sudah disiapkan

**Keamanan**
- Content-Security-Policy ketat: hanya memuat file dari domain sendiri, tanpa
  script/style pihak ketiga, tidak bisa di-iframe (anti-clickjacking).
- HSTS (paksa HTTPS), X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy (kamera/mikrofon/lokasi dimatikan), COOP.
- Directory listing dimatikan; file tersembunyi & dokumen config diblokir.
- Tidak ada form, cookie, tracking, atau pengumpulan data — pendaftaran lewat
  email (`mailto:`) dan WhatsApp (`wa.me`), link eksternal pakai
  `rel="noopener noreferrer"`.

**Kecepatan**
- Font di-host sendiri (WOFF2, hanya subset yang dipakai) — tanpa request ke
  Google Fonts.
- Gambar WebP/JPEG terkompres; skyline berupa SVG (tanpa file gambar).
- Semua JS/CSS/HTML punya versi `.br` (Brotli) dan `.gz` (gzip) siap saji.
- Nama file aset ber-hash → di-cache browser 1 tahun; `index.html` selalu
  dicek ulang sehingga update langsung terlihat.

## Sebelum go-live

Gambar preview link (WhatsApp/LinkedIn/X) di `index.html` masih mengarah ke
`https://chalidade.github.io/weeknoo/puas-startup/og.jpg`. Jika dipasang di
domain sendiri, ganti dua baris `og:image` dan `twitter:image` ke
`https://DOMAIN-ANDA/og.jpg`.

Kontak di halaman: startup@puas.sa · WhatsApp +966 59 142 5388.
Deadline Gelombang 1: 25 Nov 2026, 23:59 waktu Riyadh.
