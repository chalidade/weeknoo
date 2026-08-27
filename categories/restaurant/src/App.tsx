import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Menu } from '@/components/Menu'
import { Story } from '@/components/Story'
import { Gallery } from '@/components/Gallery'
import { Location } from '@/components/Location'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Menu />
      <Story />
      <Gallery />
      <Location />
      <Cta />
      <Footer />
    </main>
  )
}
