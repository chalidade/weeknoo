import { Hero } from '@/components/Hero'
import { Sites } from '@/components/Sites'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Sites />
      <HowItWorks />
      <Footer />
    </main>
  )
}

export default App
