import { Instagram, Coffee } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 font-display text-lg">
          <Coffee className="size-5 text-primary" />
          Kopi Senja
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Kopi Senja. Diseduh dengan hati di
          Bandung.
        </p>

        <a
          href="https://instagram.com"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Instagram className="size-4" />
          @kopisenja
        </a>
      </div>
    </footer>
  )
}
