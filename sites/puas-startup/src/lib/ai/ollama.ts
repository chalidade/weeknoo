// Ollama — an AI model running on the visitor's own machine. Free with no cap,
// no account and no API key, works offline, and the conversation never leaves
// the device.
//
// It needs Ollama installed and a model pulled:
//
//   curl -fsSL https://ollama.com/install.sh | sh
//   ollama pull qwen3:4b
//
// Ollama only answers browsers whose origin it trusts. localhost on any port
// is allowed out of the box, so `npm run dev` just works; a deployed site has
// to be named explicitly:
//
//   OLLAMA_ORIGINS="https://chalidade.github.io" ollama serve
//
// Nothing here works while Ollama is stopped, so gate the UI on
// isOllamaRunning() rather than letting the first chat fail.
import { ReasoningSplitter, splitReasoning } from "./reasoning"
import { readLines } from "./stream"
import type { ChatChunk, ChatMessage, ChatOptions, ChatReply } from "./types"

/** Where Ollama listens. Override with VITE_OLLAMA_URL in the site's .env. */
export const OLLAMA_URL: string = import.meta.env.VITE_OLLAMA_URL ?? "http://localhost:11434"

/** Small enough for an 8 GB machine, and it shows its reasoning. */
export const OLLAMA_MODEL = "qwen3:4b"

export interface OllamaModel {
  /** e.g. "qwen3:4b" — pass it as ChatOptions.model */
  name: string
  /** On-disk size in bytes. */
  size: number
  modifiedAt: string
  /**
   * What the model can do — "completion", "tools", "thinking", "vision".
   * Gate features on this rather than on the model's name: only a model with
   * "vision" can read ChatMessage.images, and only "thinking" produces a
   * `reasoning`.
   */
  capabilities: string[]
}

/** True when the model can read images. */
export function modelBisaLihat(model: OllamaModel): boolean {
  return model.capabilities.includes("vision")
}

/** True when Ollama is reachable. Never throws — a refused connection is `false`. */
export async function isOllamaRunning(signal?: AbortSignal): Promise<boolean> {
  try {
    return (await fetch(`${OLLAMA_URL}/api/tags`, { signal })).ok
  } catch {
    return false
  }
}

/** The models pulled on this machine — empty until the first `ollama pull`. */
export async function getOllamaModels(signal?: AbortSignal): Promise<OllamaModel[]> {
  const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal })
  if (!res.ok) throw new Error(`Ollama ${res.status} ${res.statusText} — ${OLLAMA_URL}/api/tags`)
  const body = (await res.json()) as {
    models?: { name: string; size: number; modified_at: string; capabilities?: string[] }[]
  }
  return (body.models ?? []).map((m) => ({
    name: m.name,
    size: m.size,
    modifiedAt: m.modified_at,
    capabilities: m.capabilities ?? [],
  }))
}

/** One full answer. Prefer ollamaChatStream() for anything a person watches. */
export async function ollamaChat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<ChatReply> {
  const res = await post(messages, opts, false)
  const data = (await res.json()) as {
    model?: string
    message?: { content?: string; thinking?: string }
  }
  const inline = splitReasoning(data.message?.content ?? "")
  return {
    content: inline.content,
    // Newer builds return `thinking` on its own; older ones inline the tags.
    reasoning: data.message?.thinking?.trim() || inline.reasoning,
    model: data.model ?? opts.model ?? OLLAMA_MODEL,
  }
}

/** The same answer, delta by delta, so the UI can render it as it arrives. */
export async function* ollamaChatStream(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): AsyncGenerator<ChatChunk> {
  const res = await post(messages, opts, true)
  const splitter = new ReasoningSplitter()

  for await (const line of readLines(res)) {
    const data = JSON.parse(line) as { message?: { content?: string; thinking?: string } }
    const thinking = data.message?.thinking ?? ""
    if (thinking) yield { content: "", reasoning: thinking }
    const content = data.message?.content ?? ""
    if (content) yield splitter.push(content)
  }

  const rest = splitter.flush()
  if (rest.content || rest.reasoning) yield rest
}

function payload(messages: ChatMessage[], opts: ChatOptions, stream: boolean) {
  return {
    model: opts.model ?? OLLAMA_MODEL,
    messages,
    stream,
    // Omitted rather than defaulted: the model's own preference is the sane one.
    ...(opts.think === undefined ? {} : { think: opts.think }),
    options: {
      temperature: opts.temperature ?? 0.7,
      num_predict: opts.maxTokens ?? 1024,
    },
  }
}

async function post(messages: ChatMessage[], opts: ChatOptions, stream: boolean): Promise<Response> {
  const send = (o: ChatOptions) =>
    fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(messages, o, stream)),
      signal: opts.signal,
    }).catch((cause: unknown) => {
      // A caller-triggered abort is not a connection problem — let it through
      // as-is so a cancel button does not surface as a scary error.
      if (opts.signal?.aborted) throw cause
      throw new Error(
        `Cannot reach Ollama at ${OLLAMA_URL} — is it running? Start it with \`ollama serve\`.`,
        { cause },
      )
    })

  let res = await send(opts)
  // Models with no thinking mode reject `think` outright — ask again plainly.
  if (!res.ok && res.status === 400 && opts.think !== undefined) {
    res = await send({ ...opts, think: undefined })
  }
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200)
    throw new Error(`Ollama ${res.status}: ${detail || res.statusText}`)
  }
  return res
}
