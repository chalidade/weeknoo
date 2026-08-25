import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { profile } from '@/lib/profile'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

function useTheme() {
  const [dark, setDark] = useState(() =>
    typeof window === 'undefined'
      ? false
      : localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, () => setDark((d) => !d)] as const
}

export function Nav() {
  const [dark, toggle] = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-60"
        >
          chalid<span className="text-brand-ink">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-sm bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-85 sm:inline-block"
          >
            Hire me
          </a>
        </div>
      </nav>
    </header>
  )
}
