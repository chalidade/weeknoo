import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(true)

  return (
    <main className="stage">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        Motion is running ✨
      </motion.h1>

      {/* Gesture + tap spring */}
      <motion.button
        className="counter"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setCount((c) => c + 1)}
      >
        Count is {count}
      </motion.button>

      {/* AnimatePresence: enter/exit animation */}
      <button className="toggle" onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide' : 'Show'} card
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="card"
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <p>This card animates in and out with a spring.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
