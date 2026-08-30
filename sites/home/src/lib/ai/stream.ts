// Both providers stream line-delimited JSON over the response body — Ollama
// one bare object per line, Hugging Face the same wrapped in `data: ` SSE
// frames. This reads the body into whole lines; each client parses its own.

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
