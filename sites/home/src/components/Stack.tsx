const STACK = [
  'React 19',
  'Vite',
  'TypeScript',
  'Tailwind CSS v4',
  'shadcn/ui',
  '21st.dev',
  'Motion',
  'Capacitor APK',
  'WordPress theme',
  'Ollama AI',
  'GitHub Pages',
  'Claude Code',
]

export function Stack() {
  return (
    <section aria-label="Teknologi" className="border-y bg-card/30 py-5">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]">
          {[...STACK, ...STACK].map((item, i) => (
            <span
              key={i}
              aria-hidden={i >= STACK.length}
              className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-muted-foreground"
            >
              {item}
              <span className="size-1 rounded-full bg-primary/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
