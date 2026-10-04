import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Marquee } from '@/components/Marquee'
import { Menu } from '@/components/Menu'
import { NewMenu } from '@/components/NewMenu'
import { Paket } from '@/components/Paket'
import { Suasana } from '@/components/Suasana'
import { Ulasan } from '@/components/Ulasan'
import { Lokasi } from '@/components/Lokasi'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Marquee />
      <Menu />
      <NewMenu />
      <Paket />
      <Suasana />
      <Ulasan />
      <Lokasi />
      <Cta />
      <Footer />
    </main>
  )
}
