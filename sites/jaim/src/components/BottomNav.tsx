import { ChartColumn, Home } from 'lucide-react'

export type Tab = 'home' | 'stats'

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'stats', label: 'Evaluasi', icon: ChartColumn },
]

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                active ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
