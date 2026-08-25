import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Asterisk, Lock } from 'lucide-react'

// Only the SHA-256 hash of the access code lives in the page. To change the
// code: echo -n "kode-baru" | sha256sum, paste the hash here, redeploy.
// NOTE: this is a client-side gate — it keeps casual visitors out, but the
// repo (and this hash) are public. The real protection against strangers
// consuming Claude runs is on the pipeline side: only repo collaborators can
// label issues `prompt`, and the runner only executes labeled issues from
// the owner.
const ACCESS_HASH = 'fdc8eddc2fd5f0fe36b6aa984a20256298ebfe133c619ea76bfa5850efa56a0f'
const STORAGE_KEY = 'weeknoo:access'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function Gate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(STORAGE_KEY) === ACCESS_HASH)
    } catch {
      setUnlocked(false)
    }
  }, [])

  const submit = async () => {
    if (!code.trim()) return
    const hash = await sha256Hex(code.trim())
    if (hash === ACCESS_HASH) {
      try {
        localStorage.setItem(STORAGE_KEY, hash)
      } catch {
        // private mode — unlock for this visit only
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked === null) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-lg shadow-black/20"
      >
        <div className="mb-6 inline-flex items-center gap-1.5 font-medium">
          <Asterisk className="size-5 text-primary" />
          weeknoo
        </div>
        <Lock className="mx-auto size-5 text-muted-foreground" />
        <h1 className="font-display mt-4 text-2xl">Halaman privat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan kode akses untuk melanjutkan.
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit()
          }}
          placeholder="Kode akses"
          autoFocus
          className="mt-6 w-full rounded-lg border bg-background px-4 py-2.5 text-center text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
        />
        {error && (
          <p className="mt-2 text-xs text-destructive">Kode salah — coba lagi.</p>
        )}
        <button
          onClick={() => void submit()}
          disabled={!code.trim()}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          Masuk
        </button>
      </motion.div>
    </div>
  )
}
