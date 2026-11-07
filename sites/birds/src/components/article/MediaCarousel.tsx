import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { CarouselItem } from '@/data/types'
import { Media } from '@/components/Artwork'
import { cn } from '@/lib/utils'

export function MediaCarousel({ items }: { items: CarouselItem[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const go = (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d])
  const item = items[index]

  return (
    <figure className="my-14 md:-mx-24 lg:-mx-40" aria-roledescription="carousel">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy md:aspect-[16/9]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            className="absolute inset-0 touch-pan-y"
            initial={{ x: dir >= 0 ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: dir >= 0 ? '-100%' : '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
          >
            <Media src={item.imageUrl} className="pointer-events-none" />
            {item.quote ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 px-8 text-center text-white md:px-24">
                <Quote className="size-9 text-sky" fill="currentColor" />
                <p className="mt-5 text-xl leading-snug font-medium tracking-tight md:text-3xl">{item.quote}</p>
                <p className="mt-5 text-xs tracking-wide text-white/75 md:text-sm">{item.caption}</p>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent px-6 pt-20 pb-6 text-white md:px-10 md:pb-8">
                <p className="max-w-2xl text-sm leading-relaxed md:text-base">{item.caption}</p>
                {item.attribution && <p className="mt-2 text-[0.6875rem] tracking-[0.12em] text-sky uppercase">{item.attribution}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-y-0 inset-x-3 flex items-center justify-between">
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => go(d)}
              aria-label={d < 0 ? 'Previous slide' : 'Next slide'}
              className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-navy shadow transition hover:bg-white hover:text-royal"
            >
              {d < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between px-5 md:px-0">
        <div className="flex gap-2" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setState(([cur]) => [i, i > cur ? 1 : -1])}
              className={cn('h-1 transition-all', i === index ? 'w-10 bg-royal' : 'w-5 bg-slate/50 hover:bg-slate')}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </figure>
  )
}
