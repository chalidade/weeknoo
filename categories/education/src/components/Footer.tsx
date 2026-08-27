import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="inline-flex items-center gap-2 font-display text-lg font-extrabold">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-4.5" />
              </span>
              __SITE_NAME__
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground text-pretty">
              Lembaga kursus dan pelatihan dengan kelas kecil, kurikulum terstruktur,
              dan laporan perkembangan untuk setiap siswa.
            </p>
          </div>
          <nav aria-label="Program">
            <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Program
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#program" className="text-muted-foreground transition-colors hover:text-foreground">
                  Matematika SD–SMA
                </a>
              </li>
              <li>
                <a href="#program" className="text-muted-foreground transition-colors hover:text-foreground">
                  Bahasa Inggris
                </a>
              </li>
              <li>
                <a href="#program" className="text-muted-foreground transition-colors hover:text-foreground">
                  Coding untuk Anak
                </a>
              </li>
              <li>
                <a href="#pendaftaran" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pendaftaran
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Hubungi Kami
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                Jl. Cendana Raya No. 12, Kota Anda
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                0812-3456-7890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                halo@lembagakursus.id
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} __SITE_NAME__. Hak cipta dilindungi.</p>
          <p>Senin–Sabtu · 09.00–20.00 WIB</p>
        </div>
      </div>
    </footer>
  )
}
