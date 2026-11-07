import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export function Toasts() {
  const { toasts } = useApp()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4 print:hidden">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2.5 rounded-md bg-navy px-4 py-3 text-sm font-medium text-white shadow-xl"
          >
            <CheckCircle2 className="size-4 text-sky" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
