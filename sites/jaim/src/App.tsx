import { Header } from '@/components/Header'
import { JadwalSholat } from '@/components/JadwalSholat'
import { PrayerTracker } from '@/components/PrayerTracker'
import { TilawahGrid } from '@/components/TilawahGrid'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-md space-y-4 px-5 py-5">
        <JadwalSholat />
        <PrayerTracker />
        <TilawahGrid />
        <Footer />
      </main>
    </div>
  )
}

export default App
