export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside className="print-avoid my-12 border-l-4 border-royal bg-muted px-6 py-7 sm:px-9" aria-label="Key takeaways">
      <p className="text-xs font-semibold tracking-[0.14em] text-royal uppercase">Executive key takeaways</p>
      <ol className="mt-5 space-y-4">
        {items.map((t, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 text-[0.9875rem] leading-relaxed text-ink">
            <span className="text-lg leading-6 font-semibold text-navy tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            {t}
          </li>
        ))}
      </ol>
    </aside>
  )
}
