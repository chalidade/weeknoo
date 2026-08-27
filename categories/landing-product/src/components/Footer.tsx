import { Zap } from 'lucide-react'

type FooterLink = { label: string; href: string }

const LINKS: FooterLink[] = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Harga', href: '#harga' },
  { label: 'FAQ', href: '#faq' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <a href="#beranda" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            __SITE_NAME__
          </span>
        </a>
        <nav className="flex flex-wrap items-center justify-center gap-6">
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
        <p className="text-sm text-muted-foreground">
          © 2026 __SITE_NAME__. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  )
}
