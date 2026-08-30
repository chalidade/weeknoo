// Hugging Face Inference — the same kind of models, hosted, for visitors with
// no Ollama running. It is NOT free the way Ollama is: every model on the
// router is pay-per-token, and a free account carries a small monthly credit
// (worth roughly $0.10) that stops working until the month rolls over. At the
// default model's $0.01/$0.03 per million tokens that is still a few million
// tokens, but treat this as the fallback, not the engine.
//
// It needs a key from https://huggingface.co/settings/tokens.
//
// SECURITY: a key in .env is BAKED INTO THE BUNDLE and readable by anyone who
// opens the deployed site. That is fine for a local or preview build and never
// fine for a public one. For a deployed page use setHfToken() instead, which
// keeps the visitor's own key in their browser and out of the repo.
import { ReasoningSplitter, splitReasoning } from "./reasoning"
import { readLines } from "./stream"
import type { ChatChunk, ChatMessage, ChatOptions, ChatReply } from "./types"

const BASE = "https://router.huggingface.co/v1"
const TOKEN_KEY = "hf-token"

/** The cheapest reasoning model on the router — the cloud twin of qwen3:4b. */
export const HF_MODEL = "Qwen/Qwen3-4B-Thinking-2507"

/** The visitor's stored key, falling back to VITE_HF_TOKEN. "" when unset. */
export function getHfToken(): string {
  const stored = typeof localStorage === "undefined" ? null : localStorage.getItem(TOKEN_KEY)
  return stored ?? import.meta.env.VITE_HF_TOKEN ?? ""
}

/** Stores a key in this browser only. Pass "" to forget it. */
export function setHfToken(token: string): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

/** Gate the UI on this — a chat with no key can only fail. */
export function hasHfToken(): boolean {
  return getHfToken() !== ""
}

/** One full answer. Prefer hfChatStream() for anything a person watches. */
export async function hfChat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<ChatReply> {
  const res = await post(messages, opts, false)
  const data = (await res.json()) as {
    model?: string
    choices?: { message?: { content?: string; reasoning_content?: string; reasoning?: string } }[]
  }
  const message = data.choices?.[0]?.message
  const inline = splitReasoning(message?.content ?? "")
  return {
    content: inline.content,
    // Providers disagree on the field name, and some just inline the tags.
    reasoning: (message?.reasoning_content ?? message?.reasoning ?? "").trim() || inline.reasoning,
    model: data.model ?? opts.model ?? HF_MODEL,
  }
}

/** The same answer, delta by delta, over server-sent events. */
export async function* hfChatStream(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): AsyncGenerator<ChatChunk> {
  const res = await post(messages, opts, true)
  const splitter = new ReasoningSplitter()

  for await (const line of readLines(res)) {
    if (!line.startsWith("data:")) continue
    const frame = line.slice("data:".length).trim()
    if (frame === "[DONE]") break
    const data = JSON.parse(frame) as {
      choices?: { delta?: { content?: string; reasoning_content?: string; reasoning?: string } }[]
    }
    const delta = data.choices?.[0]?.delta
    const reasoning = delta?.reasoning_content ?? delta?.reasoning ?? ""
    if (reasoning) yield { content: "", reasoning }
    if (delta?.content) yield splitter.push(delta.content)
  }

  const rest = splitter.flush()
  if (rest.content || rest.reasoning) yield rest
}

async function post(messages: ChatMessage[], opts: ChatOptions, stream: boolean): Promise<Response> {
  const token = getHfToken()
  if (!token) {
    throw new Error(
      "No Hugging Face token. Call setHfToken(key) or set VITE_HF_TOKEN — get one at https://huggingface.co/settings/tokens",
    )
  }

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      model: opts.model ?? HF_MODEL,
      messages,
      stream,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 1024,
    }),
    signal: opts.signal,
  })

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200)
    if (res.status === 401) throw new Error(`Hugging Face rejected the token — ${detail}`)
    if (res.status === 402) throw new Error(`This month's Hugging Face credit is used up — ${detail}`)
    throw new Error(`Hugging Face ${res.status}: ${detail || res.statusText}`)
  }
  return res
}
