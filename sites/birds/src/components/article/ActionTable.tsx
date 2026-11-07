export function ActionTable({ caption, columns, rows }: { caption?: string; columns: string[]; rows: string[][] }) {
  return (
    <figure className="print-avoid my-12 md:-mx-16">
      {caption && <figcaption className="mb-3 text-xs font-semibold tracking-[0.12em] text-royal uppercase">{caption}</figcaption>}
      <div className="overflow-x-auto border-t-2 border-navy">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-muted">
              {columns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 text-xs font-semibold tracking-wide text-navy uppercase">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border transition-colors hover:bg-muted/60">
                {r.map((cell, j) => (
                  <td key={j} className={j === 0 ? 'px-4 py-4 align-top font-semibold text-ink' : 'px-4 py-4 align-top leading-relaxed text-deck'}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
