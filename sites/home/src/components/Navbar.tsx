import { motion } from 'motion/react'
import { Github } from 'lucide-react'

const REPO = 'https://github.com/chalidade/weeknoo'

const LINKS = [
  { label: 'Site', href: '#sites' },
  { label: 'Cara kerja', href: '#cara-kerja' },
]

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border bg-background/60 py-2 pr-2 pl-5 backdrop-blur-xl">
        <a href="#" aria-label="weeknoo — beranda" className="text-foreground">
          <span className="logo-mask block bg-current h-[18px] w-[95px]" />
        </a>
        <div className="flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href={REPO}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
