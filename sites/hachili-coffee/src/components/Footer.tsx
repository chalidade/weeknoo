import { Logo } from '@/components/Logo'
import { CAFE, waLink } from '@/lib/cafe'

export function Footer() {
  return (
    <footer className="dark border-t bg-background text-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <a href="#beranda" className="flex items-center gap-2">
            <Logo className="size-10" />
            <span className="font-display text-2xl font-extrabold">HA.CHI.LI</span>
          </a>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {CAFE.name} — cafe bertema rumah lebah di Singosari, Malang.{' '}
            <span className="text-primary">{CAFE.tagline}</span>
          </p>
        </div>
        <div>
          <p className="font-display font-bold">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              ['Menu', '#menu'],
              ['Menu Baru', '#baru'],
              ['Paket', '#paket'],
              ['Suasana', '#suasana'],
              ['Lokasi', '#lokasi'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:text-primary">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display font-bold">Kontak</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{CAFE.addressShort}</li>
            <li>
              <a href={waLink()} target="_blank" rel="noreferrer" className="hover:text-primary">
                WA {CAFE.phone}
              </a>
            </li>
            <li>
              <a href={CAFE.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary">
                IG {CAFE.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {CAFE.name}. Harga dapat berubah sewaktu-waktu.
        </p>
      </div>
    </footer>
  )
}
