import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const THEME_KEY = 'jaim:theme'

export function Header() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      // private mode — theme for this visit only
    }
  }, [dark])

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <img src="./icon.svg" alt="" className="size-8 rounded-lg" />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">JAIM</p>
            <p className="text-[11px] text-muted-foreground">Jaga Iman</p>
          </div>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Mode terang' : 'Mode gelap'}
          className="inline-flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  )
}
