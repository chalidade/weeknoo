import { useEffect, useRef, useState } from 'react'

/** Reads text aloud with the browser's SpeechSynthesis voice. */
export function useNarration(text: string) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported, text])

  const toggle = () => {
    if (!supported) return false
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return true
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-GB'
    u.rate = 1
    const voice = synth.getVoices().find((v) => v.lang.startsWith('en-GB')) ?? synth.getVoices().find((v) => v.lang.startsWith('en'))
    if (voice) u.voice = voice
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    utterRef.current = u
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
    return true
  }

  return { speaking, supported, toggle }
}
