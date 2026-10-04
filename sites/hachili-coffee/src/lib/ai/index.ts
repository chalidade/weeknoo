// Free AI for every site: a model running on the visitor's own machine through
// Ollama. Free with no cap, no account and no API key, it works offline, and
// the conversation never leaves the device.
//
//   import { chat, chatStream, isOllamaRunning } from "@/lib/ai"
//
//   const reply = await chat([{ role: "user", content: "Halo!" }])
//   console.log(reply.reasoning, reply.content)
//
//   for await (const chunk of chatStream(messages)) {
//     setThinking((t) => t + chunk.reasoning)
//     setAnswer((a) => a + chunk.content)
//   }
//
// Nothing here works while Ollama is stopped, and a visitor who has never
// installed it is the normal case — gate the UI on isOllamaRunning() and say
// so, rather than letting the first message throw.
export * from "./types"
export * from "./ollama"
export { ReasoningSplitter, splitReasoning } from "./reasoning"

// The everyday names for the two calls above.
export { ollamaChat as chat, ollamaChatStream as chatStream } from "./ollama"
