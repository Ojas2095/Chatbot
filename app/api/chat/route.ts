import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { groq } from "@ai-sdk/groq"
import type { NextRequest } from "next/server"

interface ChatSettings {
  model: "grok" | "groq"
  temperature: number
  maxTokens: number
  systemPrompt: string
  theme: "light" | "dark" | "auto"
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  model?: string
}

interface MemoryItem {
  id: string
  type: "personal" | "preference" | "fact" | "context"
  title: string
  content: string
  tags: string[]
  importance: "low" | "medium" | "high"
}

export async function POST(request: NextRequest) {
  try {
    const { message, settings, conversationHistory, userMemories, userId } = await request.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    const chatSettings: ChatSettings = settings || {
      model: "grok",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt:
        "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and engaging responses. Be conversational but professional.",
      theme: "auto",
    }

    const model =
      chatSettings.model === "groq"
        ? groq("llama-3.1-70b-versatile", {
            apiKey: process.env.GROQ_API_KEY,
          })
        : xai("grok-4", {
            apiKey: process.env.XAI_API_KEY,
          })

    const messages = []

    let enhancedSystemPrompt = chatSettings.systemPrompt

    if (userMemories && userMemories.length > 0) {
      const memoryContext = userMemories
        .filter((mem: MemoryItem) => mem.importance === "high" || mem.importance === "medium")
        .sort((a: MemoryItem, b: MemoryItem) => {
          const importanceOrder = { high: 3, medium: 2, low: 1 }
          return importanceOrder[b.importance] - importanceOrder[a.importance]
        })
        .slice(0, 10) // Limit to top 10 most important memories
        .map((mem: MemoryItem) => `${mem.type.toUpperCase()}: ${mem.title} - ${mem.content}`)
        .join("\n")

      enhancedSystemPrompt += `\n\nIMPORTANT USER CONTEXT:\nRemember these key details about the user:\n${memoryContext}\n\nUse this information to provide more personalized and relevant responses. Reference these details naturally when appropriate.`
    }

    // Add enhanced system message
    messages.push({
      role: "system" as const,
      content: enhancedSystemPrompt,
    })

    // Add conversation history for context (last 10 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-10).forEach((msg: Message) => {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })
      })
    }

    // Add current message
    messages.push({
      role: "user" as const,
      content: message,
    })

    const result = streamText({
      model,
      messages,
      temperature: chatSettings.temperature,
      maxTokens: chatSettings.maxTokens,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating chat response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
