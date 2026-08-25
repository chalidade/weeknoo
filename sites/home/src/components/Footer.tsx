import { Asterisk } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          <Asterisk className="size-4 text-primary" />
          weeknoo
        </span>
        <p>
          Satu repo, satu alur —{' '}
          <a
            href="https://github.com/chalidade/weeknoo"
            className="underline underline-offset-4 hover:text-foreground"
          >
            chalidade/weeknoo
          </a>
        </p>
      </div>
    </footer>
  )
}
