import { Gate } from '@/components/Gate'
import { Hero } from '@/components/Hero'
import { Sites } from '@/components/Sites'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <Gate>
      <main className="min-h-screen">
        <Hero />
        <Sites />
        <HowItWorks />
        <Footer />
      </main>
    </Gate>
  )
}

export default App
