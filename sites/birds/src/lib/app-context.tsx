import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Member } from '@/lib/db'
import type { Article } from '@/data/types'

interface Toast {
  id: number
  message: string
}

interface AppState {
  member: Member | null
  bookmarks: string[]
  isSaved: (id: string) => boolean
  toggleBookmark: (id: string) => Promise<void>
  join: (fullName: string, email: string) => Promise<void>
  signIn: (email: string) => Promise<boolean>
  signOut: () => Promise<void>
  authOpen: boolean
  authReason: string | null
  openAuth: (reason?: string) => void
  closeAuth: () => void
  shareArticle: Article | null
  openShare: (a: Article) => void
  closeShare: () => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  toasts: Toast[]
  toast: (message: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const member =
    useLiveQuery(async () => {
      const s = await db.session.get('current')
      return s ? ((await db.members.get(s.memberId)) ?? null) : null
    }) ?? null
  const bookmarks =
    useLiveQuery(async () => (await db.bookmarks.orderBy('savedAt').reverse().toArray()).map((b) => b.articleId)) ?? []

  const [authOpen, setAuthOpen] = useState(false)
  const [authReason, setAuthReason] = useState<string | null>(null)
  const [shareArticle, setShareArticle] = useState<Article | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const toggleBookmark = useCallback(
    async (id: string) => {
      if (await db.bookmarks.get(id)) {
        await db.bookmarks.delete(id)
        toast('Removed from your library')
      } else {
        await db.bookmarks.put({ articleId: id, savedAt: Date.now() })
        toast('Saved to your library')
      }
    },
    [toast],
  )

  const startSession = async (memberId: number) => db.session.put({ key: 'current', memberId })

  const join = useCallback(
    async (fullName: string, email: string) => {
      const normal = email.trim().toLowerCase()
      const existing = await db.members.where('email').equals(normal).first()
      const id = existing?.id ?? (await db.members.add({ fullName: fullName.trim(), email: normal, joinedAt: Date.now() }))
      await startSession(id as number)
      setAuthOpen(false)
      toast(existing ? `Welcome back, ${existing.fullName.split(' ')[0]}` : 'Membership activated — full access unlocked')
    },
    [toast],
  )

  const signIn = useCallback(
    async (email: string) => {
      const m = await db.members.where('email').equals(email.trim().toLowerCase()).first()
      if (!m) return false
      await startSession(m.id)
      setAuthOpen(false)
      toast(`Welcome back, ${m.fullName.split(' ')[0]}`)
      return true
    },
    [toast],
  )

  const signOut = useCallback(async () => {
    await db.session.delete('current')
    toast('Signed out')
  }, [toast])

  const value = useMemo<AppState>(
    () => ({
      member,
      bookmarks,
      isSaved: (id) => bookmarks.includes(id),
      toggleBookmark,
      join,
      signIn,
      signOut,
      authOpen,
      authReason,
      openAuth: (reason) => {
        setAuthReason(reason ?? null)
        setAuthOpen(true)
      },
      closeAuth: () => setAuthOpen(false),
      shareArticle,
      openShare: setShareArticle,
      closeShare: () => setShareArticle(null),
      searchOpen,
      setSearchOpen,
      toasts,
      toast,
    }),
    [member, bookmarks, toggleBookmark, join, signIn, signOut, authOpen, authReason, shareArticle, searchOpen, toasts, toast],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
