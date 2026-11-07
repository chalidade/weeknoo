// Shared shapes for the AI client in ./ollama — a model running on the
// visitor's own machine: free, unlimited, offline. Kept apart from the client
// itself so a UI can type its state without importing the fetch code.

export type ChatRole = "system" | "user" | "assistant"

export interface ChatMessage {
  role: ChatRole
  content: string
  /**
   * Gambar yang ikut dikirim, dalam base64 TANPA awalan `data:image/...;base64,`
   * — Ollama menolak yang masih berawalan. Hanya berguna pada model yang punya
   * kemampuan "vision" (lihat modelBisaLihat di ./ollama); model teks biasa
   * mengabaikannya diam-diam.
   */
  images?: string[]
}

export interface ChatOptions {
  /** Overrides the provider's default model. */
  model?: string
  /** 0 = deterministic, 1 = creative. Default 0.7. */
  temperature?: number
  /** Cap on generated tokens. Default 1024. */
  maxTokens?: number
  /**
   * Ask a reasoning model to think before it answers, putting the thinking in
   * `reasoning`. Leave it UNSET — the default already thinks and separates it
   * cleanly.
   *
   * `think: false` is a trap on qwen3 (measured on Ollama 0.33.2): it does not
   * stop the model thinking, it only stops Ollama labelling it, so the
   * chain of thought lands in `content` untagged and unsplittable. For a fast,
   * genuinely non-thinking answer switch models instead — `qwen3:4b-instruct`
   * or `llama3.1:8b` — rather than setting this to false.
   */
  think?: boolean
  /** Abort an in-flight request — pass an `AbortController.signal`. */
  signal?: AbortSignal
}

export interface ChatReply {
  /** The answer, with any chain of thought stripped out. */
  content: string
  /** The model's chain of thought — empty when it produced none. */
  reasoning: string
  /** The model that actually answered. */
  model: string
}

/** One streamed delta: both fields hold only what is new in this chunk. */
export interface ChatChunk {
  content: string
  reasoning: string
}
