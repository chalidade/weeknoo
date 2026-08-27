import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Stats } from '@/components/Stats'
import { Clients } from '@/components/Clients'
import { Cta } from '@/components/Cta'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Stats />
      <Clients />
      <Cta />
      <Footer />
    </main>
  )
}
