// Ollama streams line-delimited JSON — one bare object per line — over the
// response body. This turns the raw byte stream into whole lines; parsing them
// is ollama.ts's job.

/** Yields the response body one complete line at a time. */
export async function* readLines(res: Response): AsyncGenerator<string> {
  const reader = res.body?.getReader()
  if (!reader) throw new Error("The model returned an empty stream")
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let nl: number
      while ((nl = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (line) yield line
      }
    }
    const last = buffer.trim()
    if (last) yield last
  } finally {
    // Covers the consumer breaking out of the loop early.
    await reader.cancel().catch(() => {})
  }
}
