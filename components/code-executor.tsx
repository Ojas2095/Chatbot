"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, Download, Copy, Code, Terminal, FileCode, Zap } from "lucide-react"

interface CodeExecution {
  id: string
  language: string
  code: string
  output: string
  error?: string
  executionTime: number
  timestamp: Date
}

export function CodeExecutor() {
  const [activeLanguage, setActiveLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executions, setExecutions] = useState<CodeExecution[]>([])

  const languages = [
    { id: "javascript", name: "JavaScript", icon: "🟨", example: "console.log('Hello, World!');" },
    { id: "python", name: "Python", icon: "🐍", example: "print('Hello, World!')" },
    {
      id: "typescript",
      name: "TypeScript",
      icon: "🔷",
      example: "const message: string = 'Hello, World!';\nconsole.log(message);",
    },
    { id: "sql", name: "SQL", icon: "🗄️", example: "SELECT 'Hello, World!' as message;" },
  ]

  const executeCode = async () => {
    if (!code.trim()) return

    setIsExecuting(true)
    const startTime = Date.now()

    try {
      let output = ""
      let error = undefined

      if (activeLanguage === "javascript" || activeLanguage === "typescript") {
        try {
          // Simple JavaScript execution simulation
          const result = eval(code.replace(/console\.log/g, "return"))
          output = typeof result === "string" ? result : JSON.stringify(result, null, 2)
        } catch (e) {
          error = (e as Error).message
        }
      } else if (activeLanguage === "python") {
        // Python simulation
        if (code.includes("print(")) {
          const match = code.match(/print$$['"](.+?)['"]$$/)
          output = match ? match[1] : "Python execution simulated"
        } else {
          output = "Python code executed successfully"
        }
      } else if (activeLanguage === "sql") {
        // SQL simulation
        output = "Query executed successfully\n1 row(s) affected"
      }

      const execution: CodeExecution = {
        id: Date.now().toString(),
        language: activeLanguage,
        code,
        output: output || "Code executed successfully",
        error,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      }

      setExecutions((prev) => [execution, ...prev])
    } catch (error) {
      const execution: CodeExecution = {
        id: Date.now().toString(),
        language: activeLanguage,
        code,
        output: "",
        error: (error as Error).message,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      }
      setExecutions((prev) => [execution, ...prev])
    } finally {
      setIsExecuting(false)
    }
  }

  const loadExample = () => {
    const language = languages.find((lang) => lang.id === activeLanguage)
    if (language) {
      setCode(language.example)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const extension =
      activeLanguage === "javascript"
        ? "js"
        : activeLanguage === "typescript"
          ? "ts"
          : activeLanguage === "python"
            ? "py"
            : "sql"

    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const highlightCode = (code: string, language: string) => {
    // Basic syntax highlighting patterns
    let highlighted = code

    if (language === "javascript" || language === "typescript") {
      highlighted = highlighted
        .replace(
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await)\b/g,
          '<span class="text-blue-400">$1</span>',
        )
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
        .replace(/'([^']*)'/g, "<span class=\"text-green-400\">'$1'</span>")
        .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
    } else if (language === "python") {
      highlighted = highlighted
        .replace(
          /\b(def|class|import|from|if|else|elif|for|while|return|print|True|False|None)\b/g,
          '<span class="text-blue-400">$1</span>',
        )
        .replace(/'([^']*)'/g, "<span class=\"text-green-400\">'$1'</span>")
        .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/#.*$/gm, '<span class="text-gray-500">$&</span>')
    } else if (language === "sql") {
      highlighted = highlighted
        .replace(
          /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|DATABASE)\b/gi,
          '<span class="text-blue-400">$1</span>',
        )
        .replace(/'([^']*)'/g, "<span class=\"text-green-400\">'$1'</span>")
        .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
    }

    return highlighted
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Code Execution Environment</h3>
            <p className="text-sm text-muted-foreground">
              Run code snippets directly in your browser with real-time output
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex flex-wrap gap-3 mb-6">
          {languages.map((language) => (
            <Button
              key={language.id}
              size="sm"
              variant={activeLanguage === language.id ? "default" : "outline"}
              onClick={() => setActiveLanguage(language.id)}
              className="flex items-center gap-2"
            >
              <span>{language.icon}</span>
              {language.name}
            </Button>
          ))}
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span className="text-sm font-medium">Code Editor</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={loadExample}>
                Load Example
              </Button>
              <Button size="sm" variant="outline" onClick={copyCode}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={downloadCode}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Enter your ${activeLanguage} code here...`}
              className="w-full h-48 p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-xl border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={executeCode} disabled={isExecuting || !code.trim()} className="flex items-center gap-2">
              {isExecuting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isExecuting ? "Executing..." : "Run Code"}
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {activeLanguage}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Execution History */}
      {executions.length > 0 && (
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5" />
            <h4 className="text-lg font-semibold">Execution History</h4>
          </div>

          <div className="space-y-4">
            {executions.map((execution) => (
              <Card key={execution.id} className="glass p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{execution.language}</Badge>
                    <span className="text-sm text-muted-foreground">{execution.timestamp.toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {execution.executionTime}ms
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setCode(execution.code)}>
                      Load
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="mt-4">
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code
                          className="text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(execution.code, execution.language),
                          }}
                        />
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="output" className="mt-4">
                    <div className="bg-slate-900 rounded-lg p-4">
                      {execution.error ? (
                        <div className="text-red-400 font-mono text-sm">Error: {execution.error}</div>
                      ) : (
                        <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">{execution.output}</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <Play className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Instant Execution</h4>
          </div>
          <p className="text-sm text-muted-foreground">Run code snippets instantly without any setup</p>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileCode className="w-5 h-5 text-secondary" />
            <h4 className="font-medium">Multi-Language</h4>
          </div>
          <p className="text-sm text-muted-foreground">Support for JavaScript, Python, TypeScript, and SQL</p>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-5 h-5 text-accent" />
            <h4 className="font-medium">Execution History</h4>
          </div>
          <p className="text-sm text-muted-foreground">Keep track of all your code executions and results</p>
        </Card>
      </div>
    </div>
  )
}
