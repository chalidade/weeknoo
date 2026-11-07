import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, ChevronDown, LogOut, Menu, Search, User, X } from 'lucide-react'
import { NAV_GROUPS, SERIES } from '@/data/categories'
import { useApp } from '@/lib/app-context'
import { hrefFor, type Route } from '@/lib/router'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * One-row transparent header. `overlay` = it sits on a dark hero, so it starts
 * white-on-transparent and turns into a solid white bar once the page scrolls.
 */
export function TransparentNav({ route, overlay }: { route: Route; overlay: boolean }) {
  const { bookmarks, member, openAuth, signOut, setSearchOpen } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [account, setAccount] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    setDrawer(false)
    setOpen(null)
    setAccount(false)
  }, [route])

  const onDark = overlay && !scrolled && !drawer
  const activeSeries = route.name === 'home' ? route.series : undefined
  const isActive = (slugs: string[]) => !!activeSeries && slugs.includes(activeSeries)

  const linkCls = (active: boolean) =>
    cn(
      'relative flex h-full items-center gap-1 text-[0.875rem] font-medium tracking-[-0.005em] transition-colors',
      'after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-royal after:transition-transform after:duration-300 hover:after:scale-x-100',
      active && 'after:scale-x-100',
      onDark ? 'text-white hover:text-white' : 'text-navy hover:text-royal',
    )

  const hover = (label: string | null) => {
    window.clearTimeout(closeTimer.current)
    if (label) setOpen(label)
    else closeTimer.current = window.setTimeout(() => setOpen(null), 140)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 print:hidden',
        onDark ? 'border-b border-white/15 bg-transparent' : 'border-b border-border bg-background/95 backdrop-blur-md',
        !overlay && !scrolled && 'border-transparent bg-background/0 backdrop-blur-0',
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[1320px] items-stretch justify-between gap-6 px-5 lg:px-10">
        {/* Branding zone */}
        <a href={hrefFor.home()} className="flex flex-col justify-center leading-none" aria-label="Birds — home">
          <span className={cn('text-[1.6rem] font-semibold tracking-[-0.03em] transition-colors', onDark ? 'text-white' : 'text-navy')}>
            Birds<span className="text-royal">.</span>
          </span>
          <span className={cn('tagline mt-1 hidden transition-colors sm:block', onDark ? 'text-white/70' : 'text-muted-foreground')}>
            Baugment’s Insights, Research, and Discoveries
          </span>
        </a>

        {/* Menu links zone */}
        <nav className="hidden items-stretch gap-8 lg:flex" aria-label="Primary">
          <a href={hrefFor.home()} className={linkCls(route.name === 'home' && !activeSeries)}>
            Home
          </a>
          <a href={hrefFor.series('workforce-intelligence')} className={linkCls(activeSeries === 'workforce-intelligence')}>
            Workforce Intelligence
          </a>
          {NAV_GROUPS.map((g) => (
            <div key={g.label} className="relative flex items-stretch" onMouseEnter={() => hover(g.label)} onMouseLeave={() => hover(null)}>
              <button
                className={linkCls(isActive(g.items.map((i) => i.slug)))}
                aria-expanded={open === g.label}
                onClick={() => setOpen(open === g.label ? null : g.label)}
              >
                {g.label}
                <ChevronDown className={cn('size-3.5 transition-transform', open === g.label && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {open === g.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 w-[19rem] -translate-x-1/2 border-t-2 border-royal bg-popover shadow-[0_18px_40px_-18px_rgba(0,15,52,0.35)]"
                  >
                    {g.items.map((s) => (
                      <a key={s.slug} href={hrefFor.series(s.slug)} className="group block border-b border-border/70 px-5 py-4 last:border-0">
                        <span className="text-[0.9375rem] font-medium text-ink transition-colors group-hover:text-royal">{s.name}</span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{s.description}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Utility zone */}
        <div className={cn('flex items-center gap-1 sm:gap-2', onDark ? 'text-white' : 'text-navy')}>
          <button onClick={() => setSearchOpen(true)} aria-label="Search (press /)" className="rounded-full p-2.5 transition hover:text-royal">
            <Search className="size-5" strokeWidth={1.75} />
          </button>
          <a href={hrefFor.saved()} className="hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium transition hover:text-royal sm:flex" aria-label={`Saved articles: ${bookmarks.length}`}>
            <Bookmark className="size-[1.1rem]" strokeWidth={1.75} />
            Saved
            <span className={cn('min-w-5 rounded-full px-1.5 text-center text-[0.6875rem] leading-5 font-semibold', onDark ? 'bg-white/15' : 'bg-muted')}>{bookmarks.length}</span>
          </a>
          {member ? (
            <div className="relative">
              <button onClick={() => setAccount((v) => !v)} className="ml-1 flex size-9 items-center justify-center rounded-full bg-royal text-xs font-semibold text-white ring-2 ring-white/30" aria-label="Account menu">
                {initials(member.fullName)}
              </button>
              <AnimatePresence>
                {account && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-12 right-0 w-64 border-t-2 border-royal bg-popover p-4 text-ink shadow-xl">
                    <p className="text-sm font-semibold">{member.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-wider text-royal uppercase">Member · Full access</p>
                    <div className="mt-3 border-t border-border pt-2">
                      <a href={hrefFor.saved()} className="flex items-center gap-2 py-2 text-sm hover:text-royal">
                        <Bookmark className="size-4" /> Saved library ({bookmarks.length})
                      </a>
                      <button onClick={signOut} className="flex w-full items-center gap-2 py-2 text-sm hover:text-royal">
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuth()}
              className={cn(
                'ml-1 hidden items-center gap-1.5 border px-4 py-2 text-sm font-semibold transition sm:flex',
                onDark ? 'border-white/60 text-white hover:border-white hover:bg-white hover:text-navy' : 'border-navy text-navy hover:border-royal hover:bg-royal hover:text-white',
              )}
            >
              <User className="size-4" strokeWidth={2} />
              Sign in
            </button>
          )}
          <button onClick={() => setDrawer((v) => !v)} className="rounded-full p-2.5 lg:hidden" aria-label={drawer ? 'Close menu' : 'Open menu'}>
            {drawer ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-x-0 top-[4.25rem] bottom-0 overflow-y-auto bg-background lg:hidden"
          >
            <nav className="px-5 pt-4 pb-10" aria-label="Mobile">
              <a href={hrefFor.home()} className="block border-b border-border py-4 text-lg font-medium text-navy">Home</a>
              <a href={hrefFor.series('workforce-intelligence')} className="block border-b border-border py-4 text-lg font-medium text-navy">Workforce Intelligence</a>
              {NAV_GROUPS.map((g) => (
                <div key={g.label} className="border-b border-border py-4">
                  <p className="text-lg font-medium text-navy">{g.label}</p>
                  <div className="mt-2 bg-popover">
                    {g.items.map((s) => (
                      <a key={s.slug} href={hrefFor.series(s.slug)} className="block px-4 py-3 text-[0.9375rem] text-ink hover:text-royal">
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <a href={hrefFor.saved()} className="flex items-center justify-between border-b border-border py-4 text-lg font-medium text-navy">
                Saved <span className="text-sm text-muted-foreground">{bookmarks.length}</span>
              </a>
              {!member && (
                <button onClick={() => openAuth()} className="mt-6 w-full bg-navy py-3.5 text-sm font-semibold text-white">
                  Sign in · Join free
                </button>
              )}
              <p className="tagline mt-8 text-muted-foreground">{SERIES.length} series · Baugment’s Insights, Research, and Discoveries</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
