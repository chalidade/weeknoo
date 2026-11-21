import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'

/**
 * Phone-only action bar. It appears after the hero and steps aside while the
 * proposal composer or the closing email tile is on screen, so it never
 * covers the buttons a founder is about to press.
 */
export function StickyContact() {
  const [past, setPast] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const seen = new Set<Element>()
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => {
            for (const e of entries) {
              if (e.isIntersecting) seen.add(e.target)
              else seen.delete(e.target)
            }
            setBusy(seen.size > 0)
          })
    for (const id of ['proposal', 'daftar']) {
      const el = document.getElementById(id)
      if (el) io?.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = past && !busy

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 p-2.5 transition-[transform,visibility] duration-300 md:hidden',
        show ? 'visible translate-y-0' : 'invisible translate-y-full',
      )}
      aria-hidden={!show}
    >
      <div className="flex gap-2 rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgb(6_48_43/0.22)]">
        <a href="#proposal" tabIndex={show ? 0 : -1} className="btn btn-amber h-12 flex-1">
          Kirim proposal
        </a>
        <a
          href={waUrl()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          aria-label="Fast track lewat WhatsApp"
          className="btn btn-wa h-12 px-5"
        >
          <WhatsAppIcon className="size-5 shrink-0" />
          <span className="hidden min-[26rem]:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
