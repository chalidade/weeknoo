# Category templates — SPEC

Folder `categories/<name>/` adalah **overlay** di atas `template/`. Saat
`scripts/new-site.sh <site> --category <name>` dijalankan:

1. `template/` di-copy ke `sites/<site>/` (seperti biasa),
2. starter `src/components/Hero.tsx` bawaan template dihapus,
3. isi `categories/<name>/` di-copy **menimpa** hasilnya,
4. placeholder `__SITE_NAME__` diganti nama site,
5. `npm install`.

Artinya sebuah kategori hanya berisi file yang berbeda dari template —
minimal `index.html`, `src/index.css`, `src/App.tsx`, dan `src/components/*.tsx`.
Jangan pernah menaruh `package.json`, config, atau `src/lib/` di overlay.

## Aturan wajib (semua kategori)

- **Halaman utuh satu layar penuh**: `Navbar` → `Hero` → section konten →
  `Footer`. `App.tsx` hanya menyusun section, tanpa markup sendiri:

  ```tsx
  import { Navbar } from '@/components/Navbar'
  // ...
  export default function App() {
    return (
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        {/* ...section lain... */}
        <Footer />
      </main>
    )
  }
  ```

- **Satu file per section** di `src/components/<Section>.tsx`, self-contained
  (copy, data dummy, dan animasi milik section itu sendiri; tidak membaca
  apa pun dari section lain). Data dummy = array literal bertipe di file itu.
- **Dependensi**: hanya yang sudah ada di `template/package.json` —
  `react`, `motion/react` (BUKAN framer-motion), `lucide-react`,
  `@/components/ui/button`, `@/lib/utils` (`cn`). Dilarang menambah dependensi,
  dilarang import `@/lib/api` atau `@/lib/db` (template kategori harus statis).
- **`Button` bukan `asChild`** (tidak ada Radix Slot). CTA berupa link ditulis:

  ```tsx
  import { buttonVariants } from '@/components/ui/button'
  <a href="#kontak" className={cn(buttonVariants({ size: 'lg' }))}>Hubungi Kami</a>
  ```

- **Styling hanya lewat token shadcn** (`bg-background`, `text-muted-foreground`,
  `border-border`, `bg-primary`, …). Tanpa warna hard-coded di komponen;
  identitas warna kategori diatur di `src/index.css`.
- **`src/index.css`** = salinan milik template dengan **hanya nilai token**
  `:root` / `.dark` yang diubah (palet kategori), plus font di blok
  `@theme inline`:

  ```css
  --font-sans: "Nama Font Body", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Nama Font Display", serif;
  ```

  `--font-sans` otomatis mengganti font seluruh halaman; heading pakai
  utility `font-display`. Struktur file selain itu (import, `@custom-variant`,
  `@layer base`) tidak boleh diubah.
- **`index.html`** = salinan milik template + `<link>` Google Fonts
  (preconnect + stylesheet, weight yang dipakai saja), `lang="id"`, dan untuk
  kategori bertema gelap: `class="dark"` pada `<html>`. Placeholder
  `__SITE_NAME__` di `<title>` harus tetap ada.
- **Tanpa gambar eksternal** (URL foto pihak ketiga dilarang — bisa mati
  sewaktu-waktu). Placeholder visual dibuat dengan gradient/pattern CSS +
  ikon lucide, mis.
  `<div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 via-muted to-accent" />`.
- **Brand = `__SITE_NAME__`** di Navbar dan Footer (jadi otomatis nama site).
  Seluruh copy berbahasa **Indonesia**, realistis untuk industri kategori itu
  (bukan lorem ipsum), tapi generik (tanpa nama orang/bisnis sungguhan).
- **Navigasi anchor**: link Navbar menunjuk `id` section (`<section id="menu">`),
  scroll-behavior halus via `scroll-smooth` di elemen root section container
  atau kelas pada `<html>` (boleh set lewat Navbar `href="#..."` saja).
  Navbar sticky (`sticky top-0 z-50 border-b bg-background/80 backdrop-blur`),
  dengan menu mobile sederhana (`useState` hamburger, ikon `Menu`/`X`).
- **Animasi** pakai pola rumah dari `template/src/components/Hero.tsx`:
  `container` + `staggerChildren` dan varian `fadeUp`. Untuk section di bawah
  lipatan gunakan `whileInView="show"` + `viewport={{ once: true }}` alih-alih
  `animate`.
- **Form** (RSVP, kontak, newsletter) hanya shell:
  `onSubmit={e => e.preventDefault()}` — tanpa backend.
- **Responsif** wajib (grid `sm:`/`lg:`, tanpa overflow horizontal).
  Aksesibilitas dasar: elemen semantik, `aria-label` pada tombol ikon.
- **Harus lolos `npm run build`** (tsc strict: tanpa import/variabel tak
  terpakai, semua data bertipe). Verifikasi build dilakukan terpusat dari root
  (lihat bawah), bukan oleh penulis kategori.

## Verifikasi build (dari root workspace)

```bash
bash scripts/check-categories.sh            # semua kategori
bash scripts/check-categories.sh wedding    # satu kategori
```

Script itu membuat site percobaan sekali (`npm install` sekali), lalu untuk
tiap kategori: reset `src/` + `index.html` ke template, timpa overlay, ganti
placeholder, `npm run build`.

## 20 kategori

Tiap kategori: tema (light/dark), font (display / body), hue `--primary`,
dan daftar section **berurutan** (semua diapit Navbar + Footer, file
PascalCase persis seperti tertulis).

> **Status:** yang sudah dibangun adalah folder yang ada di `categories/`
> (cek `npm run categories`). Baris lain di tabel ini adalah roadmap —
> bangun sesuai spesifikasi barisnya bila diminta.

| # | Kategori | Tema | Font display / body | Primary | Section (antara Navbar & Footer) | Konteks copy |
|---|---|---|---|---|---|---|
| 1 | `portfolio` | dark | Space Grotesk / default | ungu violet | Hero, Works, About, Services, Testimonials, Contact | Desainer/developer kreatif memamerkan karya |
| 2 | `company-profile` | light | Lora / default | biru korporat | Hero, About, Services, Stats, Clients, Cta | Perusahaan jasa B2B nasional |
| 3 | `landing-product` | light | Sora / Sora | indigo | Hero, Features, HowItWorks, Pricing, Faq, Cta | Satu produk digital/fisik, fokus konversi |
| 4 | `saas` | dark | Manrope / Manrope | cyan | Hero, Logos, Features, Pricing, Testimonials, Faq, Cta | Aplikasi SaaS B2B (harga bulanan Rp) |
| 5 | `ecommerce` | light | Plus Jakarta Sans / sama | oranye | Hero, Categories, Products, Benefits, Testimonials, Newsletter | Toko online fashion/lifestyle (harga Rp, badge diskon; ikon keranjang di Navbar) |
| 6 | `restaurant` | light hangat (krem) | Playfair Display / default | amber/cokelat | Hero, Menu, Story, Gallery, Location, Cta | Restoran keluarga masakan Nusantara (menu + harga Rp, jam buka) |
| 7 | `blog` | light | Newsreader / default | merah bata | Hero (post unggulan), Posts, Categories, Newsletter | Blog/majalah online tulisan teknologi & budaya |
| 8 | `agency` | dark | Bricolage Grotesque / default | lime | Hero, Works, Services, Process, Team, Cta | Agensi digital branding & web |
| 9 | `event` | dark | Unbounded / default | fuchsia | Hero (tanggal+venue), Speakers, Schedule, Tickets, Sponsors, Faq | Konferensi teknologi 2 hari di Jakarta |
| 10 | `wedding` | light (krem lembut) | Cormorant Garamond / default | rose | Hero (nama pasangan+tanggal), Story, Details (akad & resepsi), Gallery, Rsvp, Gifts | Undangan pernikahan digital (nama dummy "Raka & Salma") |
| 11 | `education` | light | Nunito / Nunito | teal-hijau | Hero, Programs, WhyUs, Teachers, Testimonials, Admission | Lembaga kursus / sekolah (program, biaya, pendaftaran) |
| 12 | `nonprofit` | light | Public Sans / sama | oranye hangat | Hero, Mission, Programs, Impact, Donate, Volunteers | Yayasan sosial pendidikan & lingkungan |
| 13 | `real-estate` | light | DM Serif Display / DM Sans | navy (aksen emas) | Hero, Listings, WhyUs, Agents, Testimonials, Cta | Agen properti (listing rumah, harga Rp, luas m²) |
| 14 | `medical` | light | Figtree / Figtree | teal | Hero, Services, Doctors, Facilities, Schedule, Contact | Klinik keluarga (poli, jadwal dokter, janji temu) |
| 15 | `travel` | light | Albert Sans / sama | biru laut | Hero, Destinations, Packages, WhyUs, Testimonials, Cta | Agen open trip & private tour Nusantara |
| 16 | `fitness` | dark | Archivo (800/900) / default | volt lime | Hero, Programs, Trainers, Pricing, Schedule, Cta | Gym & studio kelas (membership Rp/bulan) |
| 17 | `photography` | dark | Inter Tight / sama | monokrom (primary nyaris putih) | Hero, Gallery, About, Packages, Testimonials, Contact | Fotografer wedding & potret |
| 18 | `news` | light | Source Serif 4 / default | merah | Hero (headline+trending), Latest, Sections, Newsletter | Portal berita nasional (rubrik: Nasional, Ekonomi, Teknologi, Olahraga) |
| 19 | `resume` | light | IBM Plex Sans / sama | biru slate | Hero (nama+peran), Experience (timeline), Skills, Projects, Education, Contact | CV online profesional (dummy generik) |
| 20 | `local-business` | light | Fraunces / default | hijau | Hero, Services, WhyUs, Gallery, Testimonials, Contact | Jasa UMKM lokal (salon/bengkel/laundry — pilih satu, konsisten; CTA WhatsApp shell) |

Nilai oklch persis tiap palet bebas ditentukan penulis kategori selama
kontras aksesibel (teks di atas `primary` memakai `--primary-foreground`
yang terbaca) dan identitas tiap kategori berbeda jelas.

## Menambah kategori baru

Buat `categories/<nama>/` mengikuti aturan di atas (nama match
`^[a-z0-9][a-z0-9-]*$`), tambahkan barisnya ke tabel ini, jalankan
`bash scripts/check-categories.sh <nama>`, lalu update PANDUAN.md.
