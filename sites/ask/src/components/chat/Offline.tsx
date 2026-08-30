import { RefreshCw, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OLLAMA_MODEL, OLLAMA_URL } from '@/lib/ai'

/**
 * Yang tampil kalau AI-nya belum bisa dipakai. Ini keadaan yang wajar, bukan
 * kerusakan: modelnya jalan di komputer pembaca, jadi orang yang belum memasang
 * Ollama memang akan sampai di sini — makanya diberi langkahnya, bukan error.
 */
export function Offline({ reason, onRetry }: { reason: 'offline' | 'nomodel'; onRetry: () => void }) {
  const steps =
    reason === 'offline'
      ? ['curl -fsSL https://ollama.com/install.sh | sh', `ollama pull ${OLLAMA_MODEL}`]
      : [`ollama pull ${OLLAMA_MODEL}`]

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Terminal className="size-5" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight">
          {reason === 'offline' ? 'Ollama belum jalan' : 'Belum ada model'}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {reason === 'offline' ? (
            <>
              AI di halaman ini jalan di komputermu sendiri, bukan di server — jadi
              tidak ada yang bisa dijawab sampai Ollama hidup di{' '}
              <code className="rounded bg-secondary px-1 py-0.5 text-xs">{OLLAMA_URL}</code>.
            </>
          ) : (
            <>Ollama sudah hidup, tapi belum ada model yang diunduh. Ambil satu dulu.</>
          )}
        </p>

        <div className="mt-5 space-y-2 text-left">
          {steps.map((cmd) => (
            <pre
              key={cmd}
              className="overflow-x-auto rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
            >
              <code>{cmd}</code>
            </pre>
          ))}
        </div>

        <Button onClick={onRetry} variant="secondary" className="mt-5">
          <RefreshCw className="size-4" />
          Cek lagi
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Sekali dipasang, Ollama menyala sendiri setiap komputer dinyalakan.
        </p>
      </div>
    </div>
  )
}
