import { Dribbble, Github, Instagram, Linkedin } from 'lucide-react'

type FooterLink = { href: string; label: string }

const LINKS: FooterLink[] = [
  { href: '#works', label: 'Karya' },
  { href: '#about', label: 'Tentang' },
  { href: '#services', label: 'Layanan' },
  { href: '#contact', label: 'Kontak' },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold tracking-tight">
            __SITE_NAME__
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Desain & pengembangan web — Jakarta, Indonesia
          </p>
        </div>

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
            aria-label="Dribbble"
            className="flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Dribbble className="size-4" />
          </a>
          <a
            href="#hero"
            aria-label="GitHub"
            className="flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
          </a>
          <a
            href="#hero"
            aria-label="Instagram"
            className="flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="size-4" />
          </a>
          <a
            href="#hero"
            aria-label="LinkedIn"
            className="flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="size-4" />
          </a>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} __SITE_NAME__. Seluruh hak cipta.
        </p>
      </div>
    </footer>
  )
}
