import { isValidElement, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Jawaban model ditulis dalam Markdown, jadi harus dirender sebagai Markdown —
 * kalau tidak, tabel jadi deretan garis tegak dan kode jadi teks biasa.
 * remark-gfm menambah tabel, daftar centang, dan coretan; rehype-highlight
 * mewarnai kode (warnanya diatur di index.css memakai token palet, bukan tema
 * bawaan highlight.js yang bentrok dengan warna situs ini).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,

          // Kode sebaris dan blok kode memakai elemen yang sama, jadi gaya
          // sebarisnya dinetralkan lagi saat berada di dalam <pre>.
          code: ({ className, children }) => (
            <code
              className={cn(
                'rounded bg-secondary px-1.5 py-0.5 text-[0.85em] text-foreground',
                '[pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit',
                className,
              )}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1 [&>p]:inline">{children}</li>,

          // Tabel lebar harus bisa digeser sendiri — jangan sampai halamannya
          // yang ikut melar ke samping.
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/60">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-border px-3 py-2 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => <td className="border-b border-border/60 px-3 py-2">{children}</td>,

          h1: ({ children }) => <h1 className="mt-4 text-lg font-semibold">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-4 text-base font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-3 text-sm font-semibold">{children}</h3>,

          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent underline underline-offset-2"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [disalin, setDisalin] = useState(false)
  const bahasa = bahasaDari(children)

  async function salin() {
    try {
      await navigator.clipboard.writeText(teksDari(children))
      setDisalin(true)
      setTimeout(() => setDisalin(false), 1500)
    } catch {
      // Menyalin bisa ditolak browser; tombolnya diam saja, bukan urusan penting.
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] text-muted-foreground">{bahasa || 'kode'}</span>
        <button
          type="button"
          onClick={() => void salin()}
          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {disalin ? <Check className="size-3" /> : <Copy className="size-3" />}
          {disalin ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed">{children}</pre>
    </div>
  )
}

/** Mengambil teks mentah dari isi <pre>, untuk tombol salin. */
function teksDari(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(teksDari).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return teksDari(node.props.children)
  return ''
}

/** Nama bahasa dari kelas "language-ts" yang dipasang Markdown. */
function bahasaDari(node: ReactNode): string {
  if (Array.isArray(node)) {
    for (const anak of node) {
      const found = bahasaDari(anak)
      if (found) return found
    }
    return ''
  }
  if (isValidElement<{ className?: string }>(node)) {
    const cocok = /language-(\w+)/.exec(node.props.className ?? '')
    return cocok?.[1] ?? ''
  }
  return ''
}
