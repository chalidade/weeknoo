// Local login — user profiles live in the on-device database; the active
// profile id is remembered in localStorage. PINs are optional and stored only
// as a salted SHA-256 hash.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { db, type User } from '@/lib/db/db'

const SESSION_KEY = 'jaim:session'

function newId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

interface Session {
  /** false until the saved session has been looked up */
  ready: boolean
  user: User | null
  login: (user: User, pin?: string) => Promise<void>
  register: (name: string, pin?: string) => Promise<void>
  logout: () => void
}

const SessionContext = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const id = localStorage.getItem(SESSION_KEY)
        if (id) {
          const saved = await db.users.get(id)
          if (!cancelled && saved) setUser(saved)
        }
      } catch {
        // private mode / missing profile — start logged out
      }
      if (!cancelled) setReady(true)
    }
    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const activate = useCallback((u: User) => {
    setUser(u)
    try {
      localStorage.setItem(SESSION_KEY, u.id)
    } catch {
      // private mode — session for this visit only
    }
  }, [])

  const login = useCallback(
    async (u: User, pin?: string) => {
      if (u.pinHash) {
        const hash = await hashPin(pin ?? '', u.salt)
        if (hash !== u.pinHash) throw new Error('PIN salah')
      }
      activate(u)
    },
    [activate],
  )

  const register = useCallback(
    async (name: string, pin?: string) => {
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Nama tidak boleh kosong')
      const existing = await db.users.toArray()
      if (existing.some((u) => u.name.toLowerCase() === trimmed.toLowerCase())) {
        throw new Error('Nama profil sudah dipakai')
      }
      const salt = newId()
      const u: User = {
        id: newId(),
        name: trimmed,
        pinHash: pin ? await hashPin(pin, salt) : null,
        salt,
        createdAt: Date.now(),
      }
      await db.users.add(u)
      activate(u)
    },
    [activate],
  )

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  return (
    <SessionContext.Provider value={{ ready, user, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): Session {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}

/** The logged-in user — only call from screens rendered behind the login gate. */
export function useUser(): User {
  const { user } = useSession()
  if (!user) throw new Error('useUser called while logged out')
  return user
}
