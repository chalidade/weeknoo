import { Mail, MapPin, Phone } from 'lucide-react'

type FooterLink = { label: string; href: string }

const NAV_LINKS: FooterLink[] = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Statistik', href: '#statistik' },
  { label: 'Klien', href: '#klien' },
  { label: 'Kontak', href: '#kontak' },
]

const SERVICE_LINKS: FooterLink[] = [
  { label: 'Konsultansi Manajemen', href: '#layanan' },
  { label: 'Alih Daya SDM', href: '#layanan' },
  { label: 'Pelatihan Korporat', href: '#layanan' },
  { label: 'Audit & Kepatuhan', href: '#layanan' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            __SITE_NAME__
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Perusahaan jasa profesional nasional — mendampingi pertumbuhan bisnis
            Indonesia sejak 2008.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <p className="text-sm font-semibold">Navigasi</p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Layanan footer">
          <p className="text-sm font-semibold">Layanan</p>
          <ul className="mt-4 space-y-3">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold">Kantor Pusat</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              Gedung Graha Niaga Lt. 12, Jakarta Selatan
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              (021) 5550 1234
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              halo@perusahaan.co.id
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} __SITE_NAME__. Seluruh hak cipta dilindungi.
          </p>
          <p>Terdaftar sebagai perusahaan jasa konsultansi nasional.</p>
        </div>
      </div>
    </footer>
  )
}
