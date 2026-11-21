import { EMAIL, WA_DISPLAY, mailtoUrl, waUrl } from '@/lib/contact'

const LINKS = [
  { href: '#program', label: 'Program' },
  { href: '#hadiah', label: 'Hadiah' },
  { href: '#jadwal', label: 'Jadwal' },
  { href: '#proposal', label: 'Proposal' },
  { href: '#faq', label: 'FAQ' },
]

export function Footer() {
  return (
    <footer className="wrap pt-10 pb-28 md:pb-10">
      <div className="flex flex-col gap-8 px-2 sm:px-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <img
            src={`${import.meta.env.BASE_URL}puas-logo.webp`}
            alt="PUAS"
            width={257}
            height={88}
            loading="lazy"
            className="h-10 w-auto"
          />
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Program kurasi &amp; pendampingan untuk mengubah ide bisnis dan startup Indonesia menjadi perusahaan
            resmi di Saudi Arabia.
          </p>
        </div>

        <nav aria-label="Bagian halaman">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium md:flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="underline-offset-4 hover:underline" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="space-y-2 font-medium">
          <li>
            <a className="underline-offset-4 hover:underline" href={mailtoUrl()}>
              {EMAIL}
            </a>
          </li>
          <li>
            <a className="underline-offset-4 hover:underline" href={waUrl()} target="_blank" rel="noopener noreferrer">
              WhatsApp {WA_DISPLAY}
            </a>
          </li>
        </ul>
      </div>
      <p className="mt-10 px-2 text-sm text-muted-foreground sm:px-3">© 2026 PUAS</p>
    </footer>
  )
}
