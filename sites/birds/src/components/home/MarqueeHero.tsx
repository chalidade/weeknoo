import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { ARTICLES, featuredArticle } from '@/data/articles'
import { Media } from '@/components/Artwork'
import { AccessBadge } from '@/components/shared/AccessBadge'
import { hrefFor } from '@/lib/router'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export function MarqueeHero() {
  const lead = featuredArticle()
  const also = ARTICLES.filter((a) => a.id !== lead.id).slice(0, 3)
  const video = lead.heroType === 'video' && lead.heroVideoUrl ? import.meta.env.BASE_URL + lead.heroVideoUrl : null

  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-navy text-white">
      <div className="absolute inset-0">
        <Media src={lead.featuredImage} />
        {video && <video className="absolute inset-0 h-full w-full object-cover object-[77%_50%]" src={video} autoPlay muted loop playsInline aria-hidden />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 pt-32 pb-12 lg:px-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">
            Featured briefing · {lead.category}
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-5 text-[2.4rem] leading-[1.06] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[4.25rem]">
            {lead.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            {lead.subtitle}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
            <a href={hrefFor.article(lead.id)} className="group inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-royal hover:text-white">
              Read the briefing <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </a>
            <span className="text-sm text-white/70">
              {lead.author.fullName} · {lead.readTime}
            </span>
            <AccessBadge type={lead.accessType} tone="dark" />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative border-t border-white/15">
        <div className="mx-auto grid max-w-[1320px] gap-px px-5 md:grid-cols-3 lg:px-10">
          {also.map((a, i) => (
            <motion.a
              key={a.id}
              href={hrefFor.article(a.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="group border-white/15 py-5 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
            >
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-sky uppercase">{a.category}</p>
              <p className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-snug font-medium text-white/90 group-hover:text-white group-hover:underline group-hover:underline-offset-4">{a.title}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
