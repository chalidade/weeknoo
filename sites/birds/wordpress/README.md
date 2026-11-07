# Birds untuk WordPress — tema + plugin Elementor

Versi WordPress dari Birds yang **isinya bisa diatur** (bukan snapshot statis):
artikel adalah post WordPress biasa, series adalah kategori, dan semua komponen
Birds tersedia sebagai **widget Elementor** sekaligus **shortcode**.

```
sites/birds/wordpress/
├── theme/birds/                 # tema "Birds" — layout, header, footer, Customizer
├── plugin/birds-elements/       # plugin "Birds Elements" — widget, kontributor, member, demo
└── tools/export-demo.mjs        # ekspor ulang konten demo dari src/data
```

## 1. Membuat paketnya

Dari root workspace:

```bash
npm run wp -- birds
```

Keluarannya (di-ignore git):

```
sites/birds/birds-elements.zip     ← plugin
sites/birds/birds-wp-theme.zip     ← tema
```

`build-wp.sh` mengenali folder `wordpress/` ini dan mengemasnya apa adanya
(setelah `php -l` tiap berkas) — generator snapshot statis tidak dipakai untuk Birds.

## 2. Memasang

1. **Plugins → Add New → Upload Plugin** → `birds-elements.zip` → Activate.
2. **Appearance → Themes → Add New → Upload Theme** → `birds-wp-theme.zip` → Activate.
   Tema otomatis membuat halaman **Saved** dan mengisi tagline situs.
3. (Opsional) **Settings → Birds → Import demo content** — 10 artikel contoh,
   7 series, 13 kontributor, artwork, dan video hero. Bisa dihapus lagi dengan
   satu klik (*Remove demo content*). Orang, perusahaan, dan angka chart di demo
   adalah contoh fiktif.
4. **Settings → Permalinks** → pilih *Post name* (URL artikel jadi rapi).

Elementor **tidak wajib**: tanpa Elementor semua tetap jalan lewat editor blok
dan shortcode. Dengan Elementor, panel widget mendapat kategori **Birds**.

Butuh WordPress 6.4+ dan PHP 7.4+. Diuji pada WordPress 6.8 + Elementor (versi
pengembangan dari GitHub) di PHP 8.3.

## 3. Mengatur konten

| Yang mau diubah | Di mana |
| --- | --- |
| Artikel (judul, deck, isi) | **Posts** — *deck* = kolom **Excerpt** |
| Gambar utama | **Featured image** artikel |
| Akses Free / Member, kicker, hero video, waktu baca, key takeaways, penulis, pakar | Kotak **Birds — article settings** di bawah editor artikel |
| Penulis & pakar (foto bulat, jabatan, perusahaan, bio, bio perusahaan, LinkedIn, situs) | Menu **Contributors** — foto = *Portrait* (featured image), bio = isi editor |
| 7 series + deskripsinya | **Posts → Categories** — kategori anak jadi item dropdown |
| Menu atas | Otomatis dari pohon kategori; atau buat menu di **Appearance → Menus** (lokasi *Primary*) |
| Nama/wordmark, tagline, warna (Dark Blue, Royal Blue, Light Grey) | **Appearance → Customize → Birds → Brand** |
| Section halaman depan (hero, latest insights, chip filter, banner member, section per series) | **Customize → Birds → Home page** |
| Artikel unggulan di hero | Customizer, atau tandai artikel **Sticky** |
| Teks footer | **Customize → Birds → Footer** (+ area widget *Footer*) |
| Panjang pratinjau artikel member, registrasi instan | **Settings → Birds** |

### Hero video

Briefing unggulan memakai **brand film Birds** (`media/birds-film.mp4`, 24 detik,
1080p, ±2,8 MB, loop mulus, musik ambient). Film ini dirender dari
`sites/birds/video/brand-film.html` — ubah teks/angka di sana lalu jalankan
`node video/render.mjs` (butuh Playwright/Chromium + ffmpeg), kemudian
`node wordpress/tools/export-demo.mjs` agar demo WordPress ikut terbarui.
Isinya sengaja diletakkan di sisi kanan supaya judul hero di kiri tetap terbaca.

Upload `.mp4` ke Media Library, salin URL-nya ke *Hero presentation → Looping
muted video* di article settings. Video diputar tanpa suara di atas featured
image dengan tombol play/pause dan mute.

## 4. Widget Elementor (kategori "Birds")

| Widget | Isi yang bisa diatur |
| --- | --- |
| **Birds Chart** | tipe (column, bar, line, donut), judul, subjudul, satuan, label seri & benchmark, data (repeater: label, nilai, benchmark, warna), sumber, penomoran *Exhibit* |
| **Birds Pull Quote** | kutipan, nama, jabatan |
| **Birds Key Takeaways** | dari article settings, atau ditulis manual |
| **Birds Photo & Quote Carousel** | slide: gambar, kutipan (jadi kartu kutipan), caption, atribusi |
| **Birds Action Table** | caption, kolom (`a | b | c`), baris (satu per baris) |
| **Birds Author & Experts** | dari artikel, atau pilih kontributor manual |
| **Birds Member Gate** | penanda: pembaca yang belum masuk berhenti di sini |
| **Birds Article Grid** | layout (feature + list ala McKinsey, grid, list), series, akses, jumlah, offset, kolom, chip filter |
| **Birds Featured Hero** | artikel (atau otomatis sticky/terbaru), eyebrow, tombol, strip cerita lain |
| **Birds Membership Banner** | eyebrow, judul, teks, perks, tombol, teks untuk member |
| **Birds Series Sections** | jumlah artikel per series, teks link |
| **Birds Article Header** | untuk template single Elementor Pro: kicker, judul, deck, meta, tombol Listen/Save/Share/PDF |

**Halaman depan dengan Elementor:** buat Page, edit dengan Elementor, susun
*Featured Hero → Article Grid → Membership Banner → Series Sections*, lalu
**Settings → Reading → A static page** → pilih page itu. Template **Birds
canvas** memberi lebar penuh dengan header & footer Birds tetap ada.

**Artikel dengan Elementor:** hero, header, kontributor, dan takeaways dipasang
otomatis oleh tema; isi badan dibangun dengan widget. Kalau widget Key
Takeaways atau Author & Experts dipakai di layout, versi otomatisnya tidak
ditampilkan dua kali.

## 5. Shortcode (editor blok / klasik)

```
[birds_chart type="column" title="…" subtitle="…" unit="%" value_label="Demand" benchmark_label="Supply" source="…"]
AI & data | 182 | 121
Cloud & cyber | 164 | 118
[/birds_chart]

[birds_quote author="Nama" title="Jabatan, Perusahaan"]Isi kutipan[/birds_quote]
[birds_takeaways]                          ← pakai key takeaways artikel
[birds_carousel]
[birds_slide image="123" attribution="Birds Research Desk"]Caption foto[/birds_slide]
[birds_slide image="124" quote="Isi kutipan"]Nama, Jabatan[/birds_slide]
[/birds_carousel]
[birds_table caption="…"]Kolom | Kolom
Isi | Isi[/birds_table]
[birds_member_gate]                        ← artikel member berhenti di sini
[birds_contributors]  [birds_articles layout="feature" category="mind-in-motion" count="6"]
[birds_marquee]  [birds_membership_banner]  [birds_series_sections]
```

`image` menerima ID attachment atau URL. Artikel demo memakai persis
shortcode ini di blok *Shortcode*, jadi bisa dicontoh langsung.

## 6. Akses Free vs Member

- Member = user WordPress berperan **Subscriber**. Tombol *Join free* di kartu
  unlock membuat akun dan langsung masuk (tanpa pembayaran); email berisi link
  untuk mengatur password dikirim WordPress. *Sign in* memakai email + password.
- Artikel member **dipotong di server** untuk pembaca yang belum masuk: bagian
  tersembunyi tidak pernah dikirim ke browser, ke RSS, maupun ke REST API.
  Potongannya di `[birds_member_gate]` / widget *Member Gate*, atau — kalau
  tidak ada — setelah N section (Settings → Birds, default 2).
- Untuk artikel Elementor, setiap elemen artikel member dirender per pembaca
  (melewati *element cache* Elementor), jadi cache tidak bisa membocorkan isi
  member ke pembaca lain.
- Proteksi form: nonce, honeypot, batas 10 percobaan/jam per IP. Member tidak
  melihat admin bar maupun dashboard.

## 7. Fitur di halaman artikel

Progress bar baca, hero gambar/video, **Listen** (dibacakan browser via
SpeechSynthesis), **Save** (disimpan di browser; daftar di halaman *Saved*),
**Share** (salin link + toast, LinkedIn, X, email), **Download PDF** (dossier
A4 bermerek lewat dialog cetak → *Save as PDF*; untuk artikel member hanya
setelah masuk).

## 8. Mengubah konten demo

Konten demo diambil dari data situs React (`src/data/*.ts`). Setelah data itu
berubah:

```bash
cd sites/birds && node wordpress/tools/export-demo.mjs
```

Ini menulis ulang `plugin/birds-elements/demo/articles.json` dan merender
artwork ke JPG (butuh Playwright/Chromium).

## 9. Menguji di WordPress lokal

Ikuti resep di [WORDPRESS.md § 9](../../../WORDPRESS.md#9-menguji-sendiri-di-wordpress-lokal),
tetapi pasang **plugin** dulu, baru tema:

```bash
php ../wp-cli.phar plugin install /path/ke/sites/birds/birds-elements.zip --activate
php ../wp-cli.phar theme install /path/ke/sites/birds/birds-wp-theme.zip --activate
```

Lalu *Settings → Birds → Import demo content*.
