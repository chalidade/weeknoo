import { BarChart3 } from 'lucide-react'

type FooterColumn = {
  title: string
  links: { label: string; href: string }[]
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Produk',
    links: [
      { label: 'Fitur', href: '#fitur' },
      { label: 'Harga', href: '#harga' },
      { label: 'Testimoni', href: '#testimoni' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Mulai Gratis', href: '#mulai' },
      { label: 'Klien Kami', href: '#klien' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a href="#beranda" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="size-4" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              __SITE_NAME__
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Platform keuangan untuk bisnis kecil dan menengah Indonesia —
            faktur, rekonsiliasi, dan laporan dalam satu dasbor.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {column.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
          © 2026 __SITE_NAME__. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  )
}
