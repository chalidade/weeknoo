import { useEffect, useState } from 'react'

/**
 * The current time, refreshed every `everyMs`. It is null on the server and on
 * the first client render, so prerendered HTML and hydration always agree —
 * anything that depends on today's date fills in right after mount.
 */
export function useNow(everyMs = 60_000) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), everyMs)
    return () => clearInterval(id)
  }, [everyMs])
  return now
}
