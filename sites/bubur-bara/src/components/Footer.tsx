import { CookingPot, MessageCircle } from 'lucide-react'
import { waLink } from '@/lib/bara'

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Konsep', href: '#konsep' },
  { label: 'Outlet', href: '#outlet' },
  { label: 'Kemitraan', href: '#kemitraan' },
]

export function Footer() {
  return (
    <footer className="border-t bg-background pb-28 sm:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <a href="#beranda" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <CookingPot className="size-5" />
            </span>
            Bubur<span className="-ml-1.5 text-primary">Bara</span>
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            Sarapan bubur bakar claypot, wonton, dan dim sum. Lahir dari dapur kecil, dibuat untuk keluarga Indonesia.
          </p>
        </div>
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={waLink('Halo Bubur Bara!')}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border px-4 text-sm font-bold hover:bg-muted"
        >
          <MessageCircle className="size-4" /> Hubungi kami
        </a>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bubur Bara · Dibuat dengan weeknoo
      </div>
    </footer>
  )
}
