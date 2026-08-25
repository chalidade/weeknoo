import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, Lock, LoaderCircle, UserPlus } from 'lucide-react'
import { db, type User } from '@/lib/db/db'
import { useSession } from '@/lib/auth'

export function Login() {
  const { login, register } = useSession()
  const [users, setUsers] = useState<User[] | null>(null)
  const [mode, setMode] = useState<'list' | 'create'>('list')
  const [pinFor, setPinFor] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void db.users.toArray().then((rows) => {
      rows.sort((a, b) => a.createdAt - b.createdAt)
      setUsers(rows)
      if (rows.length === 0) setMode('create')
    })
  }, [])

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setBusy(false)
    }
  }

  const pickUser = (u: User) => {
    setError(null)
    setPin('')
    if (u.pinHash) setPinFor(u)
    else void run(() => login(u))
  }

  const submitPin = (e: FormEvent) => {
    e.preventDefault()
    if (pinFor) void run(() => login(pinFor, pin))
  }

  const submitCreate = (e: FormEvent) => {
    e.preventDefault()
    void run(() => register(name, pin || undefined))
  }

  const back = () => {
    setPinFor(null)
    setMode(users && users.length > 0 ? 'list' : 'create')
    setError(null)
    setPin('')
  }

  const inputCls =
    'w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border bg-card p-6"
      >
        <div className="flex flex-col items-center text-center">
          <img src="./icon.svg" alt="" className="size-14 rounded-2xl" />
          <h1 className="mt-3 text-lg font-bold tracking-tight">JAIM — Jaga Iman</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {pinFor
              ? `Masukkan PIN untuk ${pinFor.name}`
              : mode === 'create'
                ? 'Buat profil untuk mulai mencatat ibadahmu'
                : 'Siapa yang memakai JAIM?'}
          </p>
        </div>

        {users === null ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">Memuat…</p>
        ) : pinFor ? (
          <form onSubmit={submitPin} className="mt-6 space-y-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className={`${inputCls} text-center tracking-[0.5em]`}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy || pin.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {busy && <LoaderCircle className="size-4 animate-spin" />}
              Masuk
            </button>
            <button
              type="button"
              onClick={back}
              className="inline-flex w-full items-center justify-center gap-1 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-3" />
              Kembali
            </button>
          </form>
        ) : mode === 'create' ? (
          <form onSubmit={submitCreate} className="mt-6 space-y-3">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
              className={inputCls}
            />
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN (opsional)"
              className={inputCls}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy || name.trim().length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {busy && <LoaderCircle className="size-4 animate-spin" />}
              Buat profil & masuk
            </button>
            {users.length > 0 && (
              <button
                type="button"
                onClick={back}
                className="inline-flex w-full items-center justify-center gap-1 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-3" />
                Kembali ke daftar profil
              </button>
            )}
          </form>
        ) : (
          <div className="mt-6 space-y-2">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => pickUser(u)}
                disabled={busy}
                className="flex w-full items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-left transition-colors hover:border-ring disabled:opacity-60"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {u.name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 text-sm font-medium">{u.name}</span>
                {u.pinHash && <Lock className="size-3.5 text-muted-foreground" />}
              </button>
            ))}
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={() => {
                setMode('create')
                setError(null)
                setName('')
                setPin('')
              }}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <UserPlus className="size-4" />
              Buat profil baru
            </button>
          </div>
        )}

        <p className="mt-5 text-center text-[11px] text-muted-foreground/70">
          Data tersimpan di perangkat ini, terpisah per profil.
        </p>
      </motion.div>
    </div>
  )
}
