"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  content: string
}

export function CodeBlock({ content }: CodeBlockProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set())

  const copyToClipboard = async (text: string, blockIndex: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedBlocks((prev) => new Set(prev).add(blockIndex))
    setTimeout(() => {
      setCopiedBlocks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(blockIndex)
        return newSet
      })
    }, 2000)
  }

  const parseContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts
      .map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.split("\n")
          const language = lines[0].replace("```", "").trim() || "text"
          const code = lines.slice(1, -1).join("\n")

          return {
            type: "code" as const,
            language,
            content: code,
            index,
          }
        }
        return {
          type: "text" as const,
          content: part,
          index,
        }
      })
      .filter((part) => part.content.trim())
  }

  const parts = parseContent(content)
  let codeBlockIndex = 0

  return (
    <div className="space-y-4">
      {parts.map((part) => {
        if (part.type === "code") {
          const currentBlockIndex = codeBlockIndex++
          return (
            <div key={part.index} className="relative">
              <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border">
                <span className="text-xs font-medium text-muted-foreground uppercase">{part.language}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(part.content, currentBlockIndex)}
                  className="h-6 px-2"
                >
                  {copiedBlocks.has(currentBlockIndex) ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="bg-muted/50 p-4 rounded-b-lg overflow-x-auto border border-t-0">
                <code className={cn("text-sm", getLanguageClass(part.language))}>{part.content}</code>
              </pre>
            </div>
          )
        }

        return (
          <div key={part.index} className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{part.content}</p>
          </div>
        )
      })}
    </div>
  )
}

function getLanguageClass(language: string): string {
  const languageMap: Record<string, string> = {
    javascript: "language-javascript",
    typescript: "language-typescript",
    python: "language-python",
    html: "language-html",
    css: "language-css",
    json: "language-json",
    bash: "language-bash",
    shell: "language-shell",
    sql: "language-sql",
    jsx: "language-jsx",
    tsx: "language-tsx",
  }

  return languageMap[language.toLowerCase()] || "language-text"
}
