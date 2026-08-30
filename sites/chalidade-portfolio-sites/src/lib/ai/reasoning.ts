// Reasoning models put their chain of thought in a <think>…</think> block
// ahead of the answer. Newer Ollama builds and some hosted providers split it
// into a field of its own, but plenty still leave it inline — these helpers
// cope with both, so the UI always gets `content` and `reasoning` apart.
import type { ChatChunk } from "./types"

const OPEN = "<think>"
const CLOSE = "</think>"

/** Splits one finished answer into its reasoning and its content. */
export function splitReasoning(text: string): ChatChunk {
  const start = text.indexOf(OPEN)
  if (start === -1) return { content: text, reasoning: "" }
  const end = text.indexOf(CLOSE, start)
  // Never closed — the model was cut off mid-thought, so it is all reasoning.
  if (end === -1) return { content: "", reasoning: text.slice(start + OPEN.length).trim() }
  return {
    content: (text.slice(0, start) + text.slice(end + CLOSE.length)).trim(),
    reasoning: text.slice(start + OPEN.length, end).trim(),
  }
}

/**
 * The streaming counterpart: feed it every delta in order and it routes each
 * one to `content` or `reasoning`. A tag can be split across two chunks, so
 * it holds back any trailing text that could still grow into one. Use one
 * instance per response, and call flush() when the stream ends.
 */
export class ReasoningSplitter {
  private pending = ""
  private inside = false

  push(delta: string): ChatChunk {
    this.pending += delta
    let content = ""
    let reasoning = ""

    for (;;) {
      const tag = this.inside ? CLOSE : OPEN
      const at = this.pending.indexOf(tag)
      if (at !== -1) {
        const before = this.pending.slice(0, at)
        if (this.inside) reasoning += before
        else content += before
        this.pending = this.pending.slice(at + tag.length)
        this.inside = !this.inside
        continue
      }
      // No complete tag left: emit all of it but the possible partial tail.
      const held = partialTagLength(this.pending, tag)
      const safe = this.pending.slice(0, this.pending.length - held)
      this.pending = this.pending.slice(this.pending.length - held)
      if (this.inside) reasoning += safe
      else content += safe
      break
    }

    return { content, reasoning }
  }

  /** Whatever is still held back once the stream is over. */
  flush(): ChatChunk {
    const rest = this.pending
    this.pending = ""
    return this.inside ? { content: "", reasoning: rest } : { content: rest, reasoning: "" }
  }
}

/** Length of the trailing run of `text` that could still grow into `tag`. */
function partialTagLength(text: string, tag: string): number {
  for (let n = Math.min(tag.length - 1, text.length); n > 0; n--) {
    if (text.endsWith(tag.slice(0, n))) return n
  }
  return 0
}
