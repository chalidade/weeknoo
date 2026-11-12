import { EMAIL, WA_DISPLAY, mailtoUrl, waUrl } from '@/lib/contact'

export function Footer() {
  return (
    <footer className="border-t border-border pt-14 pb-28 md:pb-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}puas-mark.webp`} alt="" className="size-10" />
            <span className="font-display text-xl font-bold tracking-wide">PUAS</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Program kurasi & pendampingan untuk membawa ide dan startup Indonesia menjadi perusahaan resmi di Saudi
            Arabia.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold">Program</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><a className="hover:text-primary" href="#program">Manfaat</a></li>
              <li><a className="hover:text-primary" href="#proposal">Isi proposal</a></li>
              <li><a className="hover:text-primary" href="#hadiah">Hadiah</a></li>
              <li><a className="hover:text-primary" href="#jadwal">Jadwal</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Kontak</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><a className="hover:text-primary" href={mailtoUrl()}>{EMAIL}</a></li>
              <li><a className="hover:text-primary" href={waUrl()} target="_blank" rel="noopener noreferrer">{WA_DISPLAY}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Deadline</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>Gelombang 1: 25 Nov 2026</li>
              <li>Gelombang 2: Jan – Feb 2027</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-5 text-xs text-muted-foreground">
        © 2026 PUAS. Indonesia 🇮🇩 → Saudi Arabia 🇸🇦
      </p>
    </footer>
  )
}
