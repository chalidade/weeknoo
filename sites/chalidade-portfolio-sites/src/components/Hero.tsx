import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDownRight, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { container, fadeUp } from '@/lib/motion'
import { profile } from '@/lib/profile'

/** Drop a headshot at this path in `public/` to replace the monogram. */
const PORTRAIT_SRC = '/portrait.jpg'

const socials = [
  { href: profile.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail },
  { href: 'https://github.com/chalidaderahman', label: 'GitHub', Icon: Github },
]

export function Hero() {
  // Fall back to the monogram if the portrait is missing, so the hero never
  // renders a broken image.
  const [hasPortrait, setHasPortrait] = useState(true)

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:py-28"
      >
        {/* ---- left: the pitch ------------------------------------------- */}
        <div>
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            Available for remote work
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-8 text-5xl font-semibold leading-[0.95] tracking-tighter text-balance sm:text-6xl lg:text-7xl"
          >
            Scalable web,
            <br />
            built <span className="text-brand-ink">remotely.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Senior front-end developer with{' '}
            <strong className="font-medium text-foreground">
              5+ years of remote experience
            </strong>{' '}
            shipping high-performance web applications for global clients across
            EdTech, logistics and non-profit.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              View work
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-6 border-t border-border pt-6"
          >
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {profile.location}
            </div>
            <div className="ml-auto flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---- right: monogram disc + headline numbers -------------------- */}
        <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-square">
            <motion.div
              aria-hidden
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-brand"
            />

            {/* object-center keeps the face in the upper half of the circle for a
                three-quarter portrait; a head-and-shoulders crop wants object-top. */}
            {hasPortrait ? (
              <motion.img
                src={PORTRAIT_SRC}
                alt={`${profile.name}, ${profile.role}`}
                onError={() => setHasPortrait(false)}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                className="absolute left-[7%] top-[7%] h-[86%] w-[86%] rounded-full object-cover object-center"
              />
            ) : (
              <span className="absolute inset-0 flex select-none items-center justify-center text-[10rem] font-semibold leading-none tracking-tighter text-brand-foreground/90 sm:text-[12rem]">
                {profile.initial}
              </span>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-border bg-border">
            {[
              { value: '5+', label: 'Years remote' },
              { value: '5K+', label: 'Learners served' },
              { value: '13', label: 'Client projects' },
            ].map((stat) => (
              <div key={stat.label} className="bg-background px-3 py-4 text-center">
                <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
