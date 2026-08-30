// Shared shapes for the AI client in ./ollama — a model running on the
// visitor's own machine: free, unlimited, offline. Kept apart from the client
// itself so a UI can type its state without importing the fetch code.

export type ChatRole = "system" | "user" | "assistant"

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface ChatOptions {
  /** Overrides the provider's default model. */
  model?: string
  /** 0 = deterministic, 1 = creative. Default 0.7. */
  temperature?: number
  /** Cap on generated tokens. Default 1024. */
  maxTokens?: number
  /**
   * Ask a reasoning model (qwen3, deepseek-r1) to think before it answers.
   * Leave it unset to take the model's own default. The thinking text always
   * arrives in `reasoning`, never mixed into `content`.
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
