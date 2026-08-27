import { Aperture, Instagram, Youtube } from 'lucide-react'

type FooterLink = { href: string; label: string }

const LINKS: FooterLink[] = [
  { href: '#gallery', label: 'Galeri' },
  { href: '#about', label: 'Tentang' },
  { href: '#packages', label: 'Paket' },
  { href: '#contact', label: 'Kontak' },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center">
        <a
          href="#hero"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.2em] uppercase"
        >
          <Aperture className="size-4" />
          __SITE_NAME__
        </a>

        <nav className="flex flex-wrap justify-center gap-6">
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

        <div className="flex gap-3">
          <a
            href="#hero"
            aria-label="Instagram"
            className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="size-4" />
          </a>
          <a
            href="#hero"
            aria-label="YouTube"
            className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Youtube className="size-4" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} __SITE_NAME__ — fotografi wedding & potret.
        </p>
      </div>
    </footer>
  )
}
