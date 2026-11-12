import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { mailtoUrl, waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'

/** Floating WhatsApp bubble on desktop; a two-button action bar on mobile. */
export function StickyContact() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-0 bottom-0 z-40 md:inset-x-auto md:right-6 md:bottom-6"
        >
          <div className="glass flex gap-2 rounded-t-3xl p-3 md:hidden">
            <a
              href={mailtoUrl()}
              className="bg-gold flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground"
            >
              <Send className="size-4" /> Kirim Proposal
            </a>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hubungi via WhatsApp"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#062b1a]"
            >
              <WhatsAppIcon className="size-5" /> WA
            </a>
          </div>
          <a
            href={waUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fast Track via WhatsApp"
            className="group hidden items-center gap-2 rounded-full bg-[#25D366] py-3 pr-5 pl-3 font-semibold text-[#062b1a] shadow-2xl shadow-black/40 transition-transform hover:scale-105 md:flex"
          >
            <WhatsAppIcon className="size-7" /> Fast Track
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
