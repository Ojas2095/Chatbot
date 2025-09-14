"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X, Save, RotateCcw, Zap, Brain, Code, Pen, BookOpen, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSettings {
  model: "grok" | "groq"
  temperature: number
  maxTokens: number
  systemPrompt: string
  theme: "light" | "dark" | "auto"
}

interface ChatSettingsProps {
  settings: ChatSettings
  onSettingsChange: (settings: ChatSettings) => void
  isOpen: boolean
  onClose: () => void
}

const defaultSettings: ChatSettings = {
  model: "grok",
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt:
    "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and engaging responses. Be conversational but professional.",
  theme: "auto",
}

const presetPrompts = [
  {
    name: "Default Assistant",
    icon: Brain,
    prompt:
      "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and engaging responses. Be conversational but professional.",
    description: "General purpose AI assistant for everyday tasks",
  },
  {
    name: "Code Expert",
    icon: Code,
    prompt:
      "You are an expert software developer and coding assistant. Provide detailed, well-commented code examples and explain programming concepts clearly. Always follow best practices and suggest optimizations. When writing code, include proper error handling and consider performance implications.",
    description: "Specialized in programming and software development",
  },
  {
    name: "Creative Writer",
    icon: Pen,
    prompt:
      "You are a creative writing assistant with expertise in storytelling, character development, and narrative techniques. Help with plot ideas, dialogue, world-building, and writing style. Be imaginative and inspiring while providing constructive feedback. Adapt to different genres and writing styles.",
    description: "Perfect for creative writing and storytelling",
  },
  {
    name: "Research Assistant",
    icon: BookOpen,
    prompt:
      "You are a thorough research assistant focused on providing accurate, well-sourced information. Break down complex topics into digestible parts, provide multiple perspectives, and suggest further reading. Always cite sources when possible and acknowledge limitations in your knowledge.",
    description: "Ideal for research and fact-finding tasks",
  },
  {
    name: "Tutor",
    icon: GraduationCap,
    prompt:
      "You are a patient and encouraging tutor who adapts to different learning styles. Explain concepts step-by-step using examples, analogies, and visual descriptions. Ask questions to check understanding and provide practice problems. Create a supportive learning environment.",
    description: "Educational support and learning assistance",
  },
]

export function ChatSettingsComponent({ settings, onSettingsChange, isOpen, onClose }: ChatSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings)
  const [activeTab, setActiveTab] = useState<"model" | "prompts" | "advanced">("model")

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleReset = () => {
    setLocalSettings(defaultSettings)
  }

  const applyPreset = (prompt: string) => {
    setLocalSettings((prev) => ({ ...prev, systemPrompt: prompt }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Chat Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/30">
            <div className="p-4 space-y-2">
              <Button
                variant={activeTab === "model" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("model")}
              >
                <Zap className="w-4 h-4 mr-2" />
                Model
              </Button>
              <Button
                variant={activeTab === "prompts" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("prompts")}
              >
                <Brain className="w-4 h-4 mr-2" />
                Prompts
              </Button>
              <Button
                variant={activeTab === "advanced" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("advanced")}
              >
                <Code className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {activeTab === "model" && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">AI Model Selection</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose the AI model that best fits your needs
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card
                        className={cn(
                          "p-4 cursor-pointer transition-all border-2",
                          localSettings.model === "grok"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                        onClick={() => setLocalSettings((prev) => ({ ...prev, model: "grok" }))}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold">Grok (xAI)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Creative and conversational AI with humor and personality. Great for creative tasks and
                          engaging conversations.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Creative</span>
                          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Conversational</span>
                        </div>
                      </Card>

                      <Card
                        className={cn(
                          "p-4 cursor-pointer transition-all border-2",
                          localSettings.model === "groq"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                        onClick={() => setLocalSettings((prev) => ({ ...prev, model: "groq" }))}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold">Groq</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Lightning-fast inference with high-quality responses. Optimized for speed and efficiency in
                          all tasks.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Fast</span>
                          <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Efficient</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "prompts" && (
                <>
                  <div>
                    <Label className="text-base font-semibold">System Prompt</Label>
                    <p className="text-sm text-muted-foreground mb-3">Define how the AI should behave and respond</p>
                    <Textarea
                      value={localSettings.systemPrompt}
                      onChange={(e) => setLocalSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                      rows={4}
                      placeholder="Define how the AI should behave..."
                      className="mb-4"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Preset Prompts</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {presetPrompts.map((preset) => {
                        const IconComponent = preset.icon
                        return (
                          <Card
                            key={preset.name}
                            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => applyPreset(preset.prompt)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{preset.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{preset.description}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {preset.prompt.slice(0, 120)}...
                                </p>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "advanced" && (
                <>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Temperature: {localSettings.temperature}</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Controls randomness in responses. Lower = more focused, Higher = more creative
                      </p>
                      <Slider
                        value={[localSettings.temperature]}
                        onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, temperature: value }))}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Focused (0.0)</span>
                        <span>Balanced (1.0)</span>
                        <span>Creative (2.0)</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Max Tokens</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Maximum length of AI responses (100-8192 tokens)
                      </p>
                      <Input
                        type="number"
                        value={localSettings.maxTokens}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, maxTokens: Number.parseInt(e.target.value) || 2048 }))
                        }
                        min={100}
                        max={8192}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Theme</Label>
                      <p className="text-sm text-muted-foreground mb-3">Choose your preferred interface theme</p>
                      <Select
                        value={localSettings.theme}
                        onValueChange={(value: "light" | "dark" | "auto") =>
                          setLocalSettings((prev) => ({ ...prev, theme: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
