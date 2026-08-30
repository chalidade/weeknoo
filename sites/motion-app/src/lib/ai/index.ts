// Free AI for every site: a model on the visitor's own machine (Ollama) with a
// hosted fallback (Hugging Face). Both providers speak the same
// ChatMessage[] → ChatReply shape and both hand back the model's chain of
// thought in `reasoning`, apart from the answer, so a UI can show the thinking
// in a panel of its own.
//
//   import { chat, chatStream } from "@/lib/ai"
//
//   const reply = await chat([{ role: "user", content: "Halo!" }])
//   console.log(reply.reasoning, reply.content)
//
//   for await (const chunk of chatStream(messages)) {
//     setThinking((t) => t + chunk.reasoning)
//     setAnswer((a) => a + chunk.content)
//   }
//
// With no `provider` given, Ollama is used whenever it is running and Hugging
// Face otherwise — see detectProvider().
import { hfChat, hfChatStream } from "./huggingface"
import { isOllamaRunning, ollamaChat, ollamaChatStream } from "./ollama"
import type { ChatChunk, ChatMessage, ChatOptions, ChatReply } from "./types"

export * from "./types"
export * from "./ollama"
export * from "./huggingface"
export { ReasoningSplitter, splitReasoning } from "./reasoning"

export type AiProvider = "ollama" | "huggingface"

export interface AiOptions extends ChatOptions {
  /** Defaults to Ollama when it is running, Hugging Face otherwise. */
  provider?: AiProvider
}

let probe: Promise<AiProvider> | undefined

/**
 * Which provider chat() would use right now. The probe runs once and is then
 * cached — pass `true` to re-check after the visitor has started Ollama.
 * Caching the promise, not the result, keeps parallel calls to one round trip.
 */
export function detectProvider(recheck = false): Promise<AiProvider> {
  if (recheck) probe = undefined
  probe ??= isOllamaRunning().then((up): AiProvider => (up ? "ollama" : "huggingface"))
  return probe
}

/** One full answer from whichever provider is available. */
export async function chat(messages: ChatMessage[], opts: AiOptions = {}): Promise<ChatReply> {
  const provider = opts.provider ?? (await detectProvider())
  return provider === "ollama" ? ollamaChat(messages, opts) : hfChat(messages, opts)
}

/** The same answer, delta by delta. */
export async function* chatStream(
  messages: ChatMessage[],
  opts: AiOptions = {},
): AsyncGenerator<ChatChunk> {
  const provider = opts.provider ?? (await detectProvider())
  yield* provider === "ollama" ? ollamaChatStream(messages, opts) : hfChatStream(messages, opts)
}
