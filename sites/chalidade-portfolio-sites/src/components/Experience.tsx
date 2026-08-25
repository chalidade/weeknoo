import { motion } from 'motion/react'
import { inView, fadeUp } from '@/lib/motion'
import { SectionHeading } from '@/components/SectionHeading'

type Role = {
  company: string
  title: string
  period: string
  location: string
  summary: string
  highlights: string[]
  stack: string[]
  current?: boolean
}

const roles: Role[] = [
  {
    company: 'The KPI Institute',
    title: 'Software Developer',
    period: 'Sep 2020 — Present',
    location: 'Melbourne, Australia · Remote',
    current: true,
    summary:
      'Enabling the dissemination of insights and the advancement of professional knowledge across a global learner base.',
    highlights: [
      'Built and deployed a Learning Reinforcement Web App used by 5,000+ global learners, featuring group creation, leaderboards, personalised learning paths and interactive quizzes.',
      'Reduced page load time by 35% and improved developer efficiency by 70% through a reusable component library.',
      'Led front-end development and mentored 3 junior developers, improving on-time delivery by 80% via Agile methodology.',
    ],
    stack: ['Next.js', 'React.js', 'Redux', 'TailwindCSS', 'REST API', 'CSS', 'HTML'],
  },
  {
    company: 'theOrigo Ltd',
    title: 'Full Stack Developer',
    period: 'Apr 2021 — Dec 2021',
    location: 'Wan Chai, Hong Kong · Remote',
    summary:
      'Enhanced and maintained critical web platforms for high-profile non-profit organisations with significant public engagement.',
    highlights: [
      'Consumer Council Hong Kong — strengthened the digital presence supporting their advocacy for a fair marketplace and consumer rights.',
      'Improved functionality and user experience for a platform disseminating independent information, managing consumer advice centres and publishing a monthly magazine.',
      'Oxfam Hong Kong — developed and optimised web features supporting global initiatives and fundraising, ensuring seamless journeys for donations and advocacy campaigns.',
      'Contributed a dedicated website for mainland visitors, enhancing cross-border consumer support.',
    ],
    stack: ['PHP', 'Laravel', 'React.js', 'JavaScript'],
  },
  {
    company: 'PT EDI Indonesia',
    title: 'Full Stack Developer',
    period: 'Sep 2019 — Apr 2021',
    location: 'Jakarta, Indonesia · On-site',
    summary:
      'Led a React.js-powered non-container operating system for port logistics, fully integrated with the New Billing System (NBS) payment process.',
    highlights: [
      'Banten Non-Container Billing System (IPC — PELINDO 2): accelerated development by 80% by architecting a robust global and reusable API.',
      'Reduced development cost by 60% through a modular, reusable component library, and cut manual processes by 40% via automation for vessel movement, payments and monitoring.',
      'Palembang Non-Container System (IPC — PELINDO 2): managed and optimised the Lumen/Laravel web services acting as the system backbone.',
      'Built dashboards and reporting systems giving real-time visibility into operational and financial performance.',
    ],
    stack: ['React.js', 'PHP', 'Laravel', 'Lumen', 'JavaScript', 'CSS'],
  },
  {
    company: 'Startup Tuna Asmara',
    title: 'Full Stack Developer · Freelance',
    period: 'Jan 2018 — Jan 2021',
    location: 'Surabaya, Indonesia · Remote',
    summary:
      'Delivered a variety of web solutions for multiple clients as part of a software house and design team.',
    highlights: [
      'Demonstrated adaptability and teamwork across a rotating roster of client engagements — see selected projects below.',
    ],
    stack: ['PHP', 'JavaScript', 'Server-side'],
  },
  {
    company: 'PT Onklas Prima Indonesia',
    title: 'Full Stack Developer · Internship',
    period: 'Sep 2018 — Nov 2018',
    location: 'Surabaya, Indonesia · On-site',
    summary:
      'Led development of Onklas, an integrated school management platform addressing the needs of modern educational institutions.',
    highlights: [
      'Delivered a centralised Information Management System and streamlined Academic Management.',
      'Implemented Quality Management for documents, assets and audits, plus School Cooperative Management.',
      'Ensured integration across school departments and equipment — an early lesson in scalable, enterprise-level applications.',
    ],
    stack: ['PHP', 'JavaScript', 'CSS', 'Server-side'],
  },
]

export function Experience() {
  return (
    <motion.section id="experience" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          index="02"
          title="Experience"
          lede="Five years of remote delivery across EdTech, logistics and non-profit."
        />

        <ol className="mt-14 space-y-px overflow-hidden rounded-sm border border-border bg-border">
          {roles.map((role) => (
            <motion.li key={role.company} variants={fadeUp} className="bg-background">
              <article className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-10">
                <header>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{role.company}</h3>
                    {role.current && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-foreground">
                        Now
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{role.title}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {role.period}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{role.location}</p>
                </header>

                <div>
                  <p className="text-sm leading-relaxed text-foreground/90">{role.summary}</p>

                  <ul className="mt-4 space-y-2.5">
                    {role.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="relative pl-5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-2.5 size-1.5 rounded-full bg-brand"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {role.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.section>
  )
}
