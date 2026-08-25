import { motion } from 'motion/react'
import { ArrowUpRight, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { inView, fadeUp } from '@/lib/motion'
import { profile } from '@/lib/profile'

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone}`, Icon: Phone },
  {
    label: 'LinkedIn',
    value: profile.linkedinLabel,
    href: profile.linkedin,
    Icon: Linkedin,
  },
  { label: 'Based in', value: profile.location, href: '', Icon: MapPin },
]

export function Contact() {
  return (
    <motion.section id="contact" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span className="text-brand-ink">06</span>
              <span className="h-px w-8 bg-border" aria-hidden />
              Contact
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tighter text-balance sm:text-5xl"
            >
              Let's build something
              <br />
              that <span className="text-brand-ink">scales.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty"
            >
              Open to remote roles and freelance engagements. If you need a
              front-end lead who ships measurable results, I'd like to hear about it.
            </motion.p>

            <motion.a
              variants={fadeUp}
              href={`mailto:${profile.email}`}
              className="group mt-10 inline-flex items-center gap-2 rounded-sm bg-brand px-7 py-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              {profile.email}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>

          <motion.dl
            variants={fadeUp}
            className="grid h-fit gap-px overflow-hidden rounded-sm border border-border bg-border"
          >
            {channels.map(({ label, value, href, Icon }) => {
              const body = (
                <>
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <Icon className="size-3.5 text-brand-ink" />
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium break-words">{value}</dd>
                </>
              )

              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="bg-background p-6 transition-colors hover:bg-secondary/50"
                >
                  {body}
                </a>
              ) : (
                <div key={label} className="bg-background p-6">
                  {body}
                </div>
              )
            })}
          </motion.dl>
        </div>
      </div>
    </motion.section>
  )
}
