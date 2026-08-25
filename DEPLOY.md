# Publish / Deploy sebuah Site

Setiap site di `sites/<name>/` adalah aplikasi **Vite statis**. `npm run build`
menghasilkan folder `dist/` berisi file statis murni (HTML/CSS/JS) — jadi
"publish" artinya meng-upload folder `dist/` itu ke hosting statis. Tidak perlu
server Node.

Deploy satu site tidak memengaruhi site lain di repo ini.

## Alur dasar

Selalu mulai dengan build di dalam folder site-nya:

```bash
cd sites/<site-name>
npm run build        # type-check + build → hasilnya di sites/<site-name>/dist/
```

`npm run build` juga merupakan gerbang koreksi (type-check seluruh app), jadi
kalau build lolos, site siap di-deploy.

Untuk mengetes hasil build secara lokal sebelum publish:

```bash
npm run preview
```

Lalu pilih salah satu cara deploy di bawah.

## Opsi 1 — Vercel (rekomendasi)

Paling praktis untuk repo multi-site. Jalankan dari **dalam folder site**
supaya Vercel menganggap folder itu sebagai root project:

```bash
cd sites/<site-name>
npx vercel           # login sekali, jawab prompt → deploy preview
npx vercel --prod    # deploy ke production
```

- Tiap site menjadi project Vercel terpisah dengan URL sendiri
  (`<nama>.vercel.app`).
- Custom domain bisa ditempel gratis lewat dashboard Vercel.
- **Auto-deploy tiap `git push`:** hubungkan repo GitHub di dashboard Vercel,
  lalu set **Root Directory** ke `sites/<site-name>` per project.

## Opsi 2 — Netlify

```bash
cd sites/<site-name>
npx netlify-cli deploy --prod --dir=dist
```

## Opsi 3 — Cloudflare Pages

```bash
cd sites/<site-name>
npx wrangler pages deploy dist
```

## Opsi 4 — GitHub Pages (tidak disarankan untuk workspace ini)

Bisa, tapi ada satu jebakan: site disajikan dari sub-path
(`username.github.io/<repo>/`), jadi kamu **harus** set `base` di
`vite.config.ts` sebelum build:

```ts
export default defineConfig({
  base: '/<repo>/',
  // ...
})
```

Tanpa itu semua asset 404. Untuk multi-site dalam satu repo, pengaturan ini
jadi ribet — pakai Vercel/Netlify/Cloudflare saja.

## Opsi 5 — Hosting sendiri (VPS / shared hosting)

Upload **isi** folder `dist/` ke document root web server (nginx / Apache).
Tidak ada langkah khusus — file statis biasa.

## Build APK Android

Selain di-publish sebagai website, setiap site bisa dibungkus menjadi **APK
Android** dengan [Capacitor](https://capacitorjs.com/). Jalankan dari root
workspace:

```bash
npm run apk -- <site-name>              # debug APK — langsung bisa di-install
npm run apk -- <site-name> --release    # release APK — belum ditandatangani
```

Script `scripts/build-apk.sh` mengurus semuanya:

1. Meng-install Capacitor ke dalam site (hanya di run pertama).
2. Membuat `capacitor.config.json` (appId `com.chalid.<nama>`, webDir `dist`)
   kalau belum ada.
3. `npm run build` — build web seperti biasa.
4. Men-generate project native `android/` kalau belum ada, lalu menyalin
   `dist/` ke dalamnya (`npx cap sync android`).
5. Meng-compile APK dengan Gradle.

Hasilnya disalin ke `sites/<name>/<name>-debug.apk`. Install ke device:

```bash
adb install sites/<name>/<name>-debug.apk
```

**Prasyarat** (terpasang otomatis kalau ada Android Studio): Android SDK
(dicari di `$ANDROID_HOME`, lalu `~/Android/Sdk`) dan JDK 21 — kalau `java`
tidak ada di PATH, script memakai JDK bawaan Android Studio
(`~/android-studio/jbr`).

**Catatan:**

- Folder `sites/*/android/` dan file `*.apk` di-gitignore — keduanya hasil
  generate dan dibuat ulang otomatis oleh script. Kalau kamu mengkustomisasi
  project Android-nya (ikon, splash screen, permission), keluarkan
  `sites/<name>/android/` dari `.gitignore` supaya ikut ter-commit.
- APK **debug** ditandatangani otomatis dengan debug key — cocok untuk dipakai
  sendiri / dibagikan langsung. APK **release** keluar tanpa tanda tangan;
  untuk Play Store kamu harus membuat keystore dan menandatanganinya
  (`apksigner`) sendiri.
- Isi APK adalah snapshot `dist/` saat build — setelah mengubah site, jalankan
  `npm run apk` lagi untuk memperbarui aplikasinya.

## CI otomatis — GitHub Actions

Workflow di `.github/workflows/build.yml` menjalankan build **web + APK untuk
setiap site** di server GitHub pada setiap `git push` ke `main`/`master` —
tanpa Claude, tanpa mesinmu menyala. Site baru terdeteksi otomatis (workflow
membaca isi `sites/`).

Hasilnya muncul sebagai **artifact** di tab *Actions* → pilih run → unduh
`<site>-web` (folder `dist/`) atau `<site>-apk` (file APK). Artifact disimpan
30 hari.

**Mengaktifkan (sekali saja)** — repo ini belum punya remote GitHub:

```bash
git add -A && git commit -m "initial commit"
gh repo create chalid-websites --private --source=. --push
# atau --public; repo publik = menit Actions gratis tanpa batas,
# repo privat = 2.000 menit/bulan gratis
```

Setelah itu setiap `git push` memicu build. Bisa juga dipicu manual dari tab
Actions (tombol *Run workflow*).

**Catatan:**

- Runner GitHub sudah membawa Android SDK, jadi `scripts/build-apk.sh` jalan
  apa adanya — flow CI dan lokal 100% sama.
- Workflow mem-build *semua* site pada setiap push. Dengan 2–3 site ini
  bukan masalah; kalau nanti site-nya banyak, tambahkan filter `paths` supaya
  hanya site yang berubah yang di-build.
- Untuk auto-*publish* web (bukan sekadar build), tetap pakai integrasi
  Vercel/Netlify dari repo GitHub yang sama — lihat bagian Vercel di atas.

## Ringkasan

| Langkah | Perintah |
| --- | --- |
| Build | `cd sites/<name> && npm run build` |
| Tes lokal | `npm run preview` |
| Deploy (Vercel) | `npx vercel --prod` |
| Deploy (Netlify) | `npx netlify-cli deploy --prod --dir=dist` |
| Deploy (Cloudflare) | `npx wrangler pages deploy dist` |
| Build APK Android | `npm run apk -- <name>` (dari root workspace) |
