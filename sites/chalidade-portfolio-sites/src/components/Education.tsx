import { motion } from 'motion/react'
import { GraduationCap, Award, Users } from 'lucide-react'
import { inView, fadeUp } from '@/lib/motion'
import { SectionHeading } from '@/components/SectionHeading'

const education = [
  {
    school: 'Politeknik Elektronika Negeri Surabaya',
    qualification: 'Associate of Science — Telecommunication Engineering',
    detail: 'Cumulative GPA 3.2 / 4',
    period: '2016 — 2019',
    location: 'Surabaya, East Java',
  },
  {
    school: 'SMK Negeri 3 Buduran',
    qualification: 'Computer Systems Networking and Telecommunications',
    detail: '',
    period: '2011 — 2014',
    location: 'Sidoarjo, East Java',
  },
]

const certifications = [
  { name: 'React Basics', issuer: 'Meta', id: 'XPJ2T5HLCCWU' },
  { name: 'Programming with JavaScript', issuer: 'Meta', id: 'QWNHP2LZSYA5' },
  { name: 'HTML and CSS in depth', issuer: 'Meta', id: 'H7TKGC3WZ94X' },
  { name: 'Version Control', issuer: 'Meta', id: '379V5WZ8ENM8' },
  { name: 'Introduction to Front-End Development', issuer: 'Meta', id: 'ZACSKX5R6NFG' },
  {
    name: 'Front-End Web UI Frameworks and Tools: Bootstrap 4 (with Honors)',
    issuer: 'The Hong Kong University of Science and Technology',
    id: 'WYCPWD6UYYJG',
  },
  { name: 'Certified Fiber Optic Specialist', issuer: 'BNSP', id: '' },
  { name: 'Core Network Planner', issuer: 'BNSP', id: '' },
  { name: 'Telecommunications Junior Engineer Certification', issuer: 'BNSP', id: '' },
]

const activities = [
  {
    name: 'Mentoring — Surviving and Thriving: Insight From Senior Developers',
    host: 'Webinar 3.0',
    date: 'Feb 2024',
  },
  { name: 'Mentoring — Full Stack Developer Bootcamp', host: 'Peduli Digital', date: 'Apr 2021' },
  { name: 'Google Cloud on Board', host: 'Google · Jakarta', date: 'Apr 2019' },
  { name: 'Bekraf Developer Day', host: 'Dicoding', date: 'Sep 2016' },
]

export function Education() {
  return (
    <motion.section id="education" {...inView} className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          index="05"
          title="Education & credentials"
          lede="Telecommunication engineering by training, front-end by certification and practice."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---- education + activities ------------------------------------ */}
          <div className="space-y-12">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <GraduationCap className="size-4 text-brand-ink" />
                Education
              </h3>
              <ul className="mt-5 space-y-px overflow-hidden rounded-sm border border-border bg-border">
                {education.map((item) => (
                  <motion.li key={item.school} variants={fadeUp} className="bg-background p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-semibold tracking-tight">{item.school}</h4>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.period}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.qualification}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.detail ? `${item.detail} · ` : ''}
                      {item.location}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <Users className="size-4 text-brand-ink" />
                Speaking & community
              </h3>
              <ul className="mt-5 space-y-px overflow-hidden rounded-sm border border-border bg-border">
                {activities.map((item) => (
                  <motion.li key={item.name} variants={fadeUp} className="bg-background p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.host}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- certifications -------------------------------------------- */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              <Award className="size-4 text-brand-ink" />
              Certifications & training
            </h3>
            <ul className="mt-5 space-y-px overflow-hidden rounded-sm border border-border bg-border">
              {certifications.map((cert) => (
                <motion.li key={cert.name} variants={fadeUp} className="bg-background p-5">
                  <h4 className="text-sm font-medium leading-snug">{cert.name}</h4>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {cert.issuer}
                    {cert.id && (
                      <>
                        {' · '}
                        <span className="font-mono">{cert.id}</span>
                      </>
                    )}
                  </p>
                </motion.li>
              ))}
            </ul>

            <motion.p variants={fadeUp} className="mt-6 text-xs text-muted-foreground">
              Languages — English, EEPIS TEFL overall score 450.
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
