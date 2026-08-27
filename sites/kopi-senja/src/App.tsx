import { Hero } from '@/components/Hero'
import { Menu } from '@/components/Menu'
import { Testimonials } from '@/components/Testimonials'
import { Visit } from '@/components/Visit'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Menu />
      <Testimonials />
      <Visit />
      <Footer />
    </main>
  )
}

export default App
