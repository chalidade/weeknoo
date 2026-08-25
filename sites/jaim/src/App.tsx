import { useState } from 'react'
import { SessionProvider, useSession } from '@/lib/auth'
import { Header } from '@/components/Header'
import { Login } from '@/components/Login'
import { BottomNav, type Tab } from '@/components/BottomNav'
import { JadwalSholat } from '@/components/JadwalSholat'
import { PrayerTracker } from '@/components/PrayerTracker'
import { PrayerStats } from '@/components/PrayerStats'
import { PrayerAnalytics } from '@/components/PrayerAnalytics'
import { TilawahGrid } from '@/components/TilawahGrid'
import { Footer } from '@/components/Footer'

function Shell() {
  const { ready, user } = useSession()
  const [tab, setTab] = useState<Tab>('home')

  if (!ready) return null
  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main key={user.id} className="mx-auto max-w-md space-y-4 px-5 pb-28 pt-5">
        {tab === 'home' ? (
          <>
            <JadwalSholat />
            <PrayerTracker />
            <TilawahGrid />
          </>
        ) : (
          <>
            <PrayerStats />
            <PrayerAnalytics />
          </>
        )}
        <Footer />
      </main>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}

function App() {
  return (
    <SessionProvider>
      <Shell />
    </SessionProvider>
  )
}

export default App
