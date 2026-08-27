import { WashingMachine } from 'lucide-react'

type FooterLink = { label: string; href: string }

const LINKS: FooterLink[] = [
  { label: 'Layanan', href: '#layanan' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Kontak', href: '#kontak' },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <a href="#beranda" className="inline-flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <WashingMachine className="size-4" />
              </span>
              <span className="font-display text-lg font-semibold">__SITE_NAME__</span>
            </a>
            <p className="mt-3 text-sm text-muted-foreground text-pretty">
              Laundry kiloan & satuan dengan antar-jemput gratis — bersih,
              wangi, dan selesai tepat waktu.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Tautan footer">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 __SITE_NAME__. Semua hak dilindungi.</p>
          <p>Setiap hari 07.00–21.00 WIB · Jl. Melati Raya No. 12</p>
        </div>
      </div>
    </footer>
  )
}
