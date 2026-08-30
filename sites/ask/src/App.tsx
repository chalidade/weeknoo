import { Chat } from '@/components/Chat'
import { Header } from '@/components/Header'

function App() {
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <Header />
      <Chat />
    </div>
  )
}

export default App
