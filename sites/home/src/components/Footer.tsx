const REPO = 'https://github.com/chalidade/weeknoo'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Satu repo, satu alur —{' '}
          <a href={REPO} className="text-foreground underline underline-offset-4 hover:text-primary">
            chalidade/weeknoo
          </a>
        </p>
        <p className="font-mono text-xs text-muted-foreground/70">
          Dibangun dengan Claude Code · {new Date().getFullYear()}
        </p>
      </div>
      {/* Oversized wordmark that bleeds off the bottom edge */}
      <div
        aria-hidden
        className="logo-mask mx-auto mt-10 -mb-[4vw] aspect-[1386/263] w-[min(92vw,64rem)] bg-gradient-to-b from-foreground/15 to-transparent"
      />
    </footer>
  )
}
