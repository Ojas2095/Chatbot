"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  Settings,
  MessageSquare,
  Download,
  Copy,
  Volume2,
  VolumeX,
  Search,
  Heart,
  ThumbsUp,
  Edit3,
  Paperclip,
  ImageIcon,
  FileText,
  LogIn,
  LogOut,
  Sparkles,
  Brain,
  Users,
  TrendingUp,
  Code,
  Puzzle,
} from "lucide-react"
import { ChatSettingsComponent } from "@/components/chat-settings"
import { ConversationSidebar } from "@/components/conversation-sidebar"
import { CodeBlock } from "@/components/code-block"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { MemorySystem } from "@/components/memory-system"
import { UserDashboard } from "@/components/user-dashboard"
import { ImageGenerator } from "@/components/image-generator"
import { CollaborationSystem } from "@/components/collaboration-system"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { CodeExecutor } from "@/components/code-executor"
import { PluginSystem } from "@/components/plugin-system"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  model?: string
  reactions?: { [key: string]: number }
  edited?: boolean
  attachments?: FileAttachment[]
}

interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatSettings {
  model: "grok" | "groq"
  temperature: number
  maxTokens: number
  systemPrompt: string
  theme: "light" | "dark" | "auto"
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    model: "grok",
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt:
      "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and engaging responses. Be conversational but professional.",
    theme: "auto",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCodeExecutor, setShowCodeExecutor] = useState(false)
  const [showPlugins, setShowPlugins] = useState(false)
  const [showFeatureMenu, setShowFeatureMenu] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedConversations = localStorage.getItem("chatbot-conversations")
    const savedSettings = localStorage.getItem("chatbot-settings")

    if (savedConversations) {
      const parsed = JSON.parse(savedConversations)
      setConversations(
        parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })),
      )
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("chatbot-conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  useEffect(() => {
    localStorage.setItem("chatbot-settings", JSON.stringify(settings))
  }, [settings])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    setMessages([])
  }

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setCurrentConversationId(conversationId)
      setMessages(conversation.messages)
    }
  }

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
      setMessages([])
    }
  }

  const updateConversationTitle = (conversationId: string, title: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, title, updatedAt: new Date() } : c)))
  }

  const saveCurrentConversation = () => {
    if (currentConversationId && messages.length > 0) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? {
                ...c,
                messages,
                updatedAt: new Date(),
                title: c.title === "New Conversation" ? messages[0]?.content.slice(0, 50) + "..." : c.title,
              }
            : c,
        ),
      )
    }
  }

  useEffect(() => {
    saveCurrentConversation()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (!currentConversationId) {
      createNewConversation()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      model: settings.model,
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const userMemories = user ? JSON.parse(localStorage.getItem(`chatbot-memories-${user.id}`) || "[]") : []

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          settings: settings,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
          userMemories: userMemories, // Include user memories for personalization
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk

          // Update the assistant message with streaming content
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg)),
          )
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: "Sorry, I encountered an error. Please try again." } : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const exportConversation = () => {
    if (messages.length === 0) return

    const conversation = {
      title: conversations.find((c) => c.id === currentConversationId)?.title || "Conversation",
      messages: messages,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
      }

      recognition.start()
    }
  }

  const addReaction = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions }
          reactions[reaction] = (reactions[reaction] || 0) + 1
          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const startEditingMessage = (message: Message) => {
    setEditingMessageId(message.id)
    setEditingContent(message.content)
  }

  const saveEditedMessage = () => {
    if (editingMessageId && editingContent.trim()) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessageId ? { ...msg, content: editingContent.trim(), edited: true } : msg,
        ),
      )
    }
    setEditingMessageId(null)
    setEditingContent("")
  }

  const cancelEditingMessage = () => {
    setEditingMessageId(null)
    setEditingContent("")
  }

  const handleFileUpload = async (files: FileList) => {
    const fileAttachments: FileAttachment[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      // Create a blob URL for the file
      const url = URL.createObjectURL(file)

      fileAttachments.push({
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
      })
    }

    if (fileAttachments.length > 0) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: `Uploaded ${fileAttachments.length} file(s): ${fileAttachments.map((f) => f.name).join(", ")}`,
        role: "user",
        timestamp: new Date(),
        attachments: fileAttachments,
      }

      setMessages((prev) => [...prev, fileMessage])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const filteredMessages = messages.filter(
    (message) => searchQuery === "" || message.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderMessage = (message: Message) => {
    const isCode = message.content.includes("```")

    if (editingMessageId === message.id && message.role === "user") {
      return (
        <div className="space-y-2">
          <Input
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                saveEditedMessage()
              }
              if (e.key === "Escape") cancelEditingMessage()
            }}
            className="w-full"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveEditedMessage}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEditingMessage}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative group">
        {isCode && message.role === "assistant" ? (
          <CodeBlock content={message.content} />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                {attachment.type.startsWith("image/") ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">({(attachment.size / 1024).toFixed(1)} KB)</span>
                {attachment.type.startsWith("image/") && (
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name}
                    className="max-w-xs max-h-32 object-contain rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <p className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString()}
              {message.model && ` • ${message.model}`}
              {message.edited && " • edited"}
            </p>

            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex gap-1">
                {Object.entries(message.reactions).map(([reaction, count]) => (
                  <span key={reaction} className="text-xs bg-muted px-1 rounded">
                    {reaction} {count}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => addReaction(message.id, "👍")}>
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addReaction(message.id, "❤️")}>
              <Heart className="w-3 h-3" />
            </Button>

            {message.role === "user" && (
              <Button variant="ghost" size="sm" onClick={() => startEditingMessage(message)}>
                <Edit3 className="w-3 h-3" />
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { user, logout } = useAuth()

  return (
    <div className="flex h-[700px] relative">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onUpdateTitle={updateConversationTitle}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      <Card
        className={cn(
          "flex flex-col transition-all duration-300 glass border-0 shadow-2xl backdrop-blur-xl",
          showSidebar ? "ml-80" : "",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="glass hover:bg-white/20 border-0"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <h2 className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {conversations.find((c) => c.id === currentConversationId)?.title || "AI Chatbot Ultra"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-2 glass rounded-full px-3 py-1 hover:bg-white/20 border-0"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} className="glass hover:bg-red-500/20 border-0">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <AuthModal>
                <Button className="glass bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </AuthModal>
            )}

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFeatureMenu(!showFeatureMenu)}
                className="glass hover:bg-white/20 border-0 bg-gradient-to-r from-primary/20 to-secondary/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Features
              </Button>

              {showFeatureMenu && (
                <Card className="absolute right-0 top-12 w-64 glass border-0 shadow-2xl z-50 p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Advanced Features
                    </h4>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowImageGenerator(true)
                        setShowFeatureMenu(false)
                      }}
                      className="w-full justify-start glass hover:bg-white/20 border-0"
                    >
                      <ImageIcon className="w-4 h-4 mr-3" />
                      AI Image Generator
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCollaboration(true)
                        setShowFeatureMenu(false)
                      }}
                      className="w-full justify-start glass hover:bg-white/20 border-0"
                    >
                      <Users className="w-4 h-4 mr-3" />
                      Real-time Collaboration
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAnalytics(true)
                        setShowFeatureMenu(false)
                      }}
                      className="w-full justify-start glass hover:bg-white/20 border-0"
                    >
                      <TrendingUp className="w-4 h-4 mr-3" />
                      Analytics Dashboard
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCodeExecutor(true)
                        setShowFeatureMenu(false)
                      }}
                      className="w-full justify-start glass hover:bg-white/20 border-0"
                    >
                      <Code className="w-4 h-4 mr-3" />
                      Code Execution Environment
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowPlugins(true)
                        setShowFeatureMenu(false)
                      }}
                      className="w-full justify-start glass hover:bg-white/20 border-0"
                    >
                      <Puzzle className="w-4 h-4 mr-3" />
                      Plugin System
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMemory(true)}
                className="glass hover:bg-white/20 border-0"
              >
                <Brain className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="glass hover:bg-white/20 border-0"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportConversation}
              disabled={messages.length === 0}
              className="glass hover:bg-white/20 border-0"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="glass hover:bg-white/20 border-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="p-4 border-b border-white/10">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-0 focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        <div
          className="flex-1 p-6 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {dragOver && (
            <div className="absolute inset-0 glass border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10 animate-pulse">
              <div className="text-center">
                <Paperclip className="w-12 h-12 mx-auto mb-4 text-primary animate-bounce" />
                <p className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Drop files here to upload
                </p>
                <p className="text-sm text-muted-foreground mt-2">Supports images, documents, and more</p>
              </div>
            </div>
          )}

          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-6">
              {filteredMessages.length === 0 && searchQuery === "" && (
                <div className="text-center py-12">
                  <div className="glass rounded-3xl p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 gradient-text">Welcome to AI Chatbot Ultra</h3>
                    <p className="text-muted-foreground mb-4">Start a conversation with our advanced AI assistant</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span>Using {settings.model.toUpperCase()} model</span>
                    </div>
                  </div>
                </div>
              )}

              {filteredMessages.length === 0 && searchQuery !== "" && (
                <div className="text-center text-muted-foreground py-8">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No messages found for "{searchQuery}"</p>
                </div>
              )}

              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-glow">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 ${message.role === "user" ? "glass bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30" : "glass bg-white/10 border border-white/20"}`}
                  >
                    {renderMessage(message)}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-pulse">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="glass bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-3 h-3 bg-secondary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-white/10 p-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 glass border-0 focus:ring-2 focus:ring-primary/50 text-base py-3 px-4 rounded-xl"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.json"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="glass border-0 hover:bg-white/20 p-3 rounded-xl"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={startVoiceInput}
              disabled={isLoading}
              className="glass border-0 hover:bg-white/20 p-3 rounded-xl bg-transparent"
            >
              {isListening ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>

      <ChatSettingsComponent
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <MemorySystem isOpen={showMemory} onClose={() => setShowMemory(false)} />

      <UserDashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />

      {showImageGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Image Generator
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageGenerator(false)}
                className="glass hover:bg-white/20 border-0"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <ImageGenerator />
            </div>
          </Card>
        </div>
      )}

      {showCollaboration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Real-time Collaboration
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCollaboration(false)}
                className="glass hover:bg-white/20 border-0"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <CollaborationSystem />
            </div>
          </Card>
        </div>
      )}

      {showAnalytics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Analytics Dashboard
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalytics(false)}
                className="glass hover:bg-white/20 border-0"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <AnalyticsDashboard />
            </div>
          </Card>
        </div>
      )}

      {showCodeExecutor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Code Execution Environment
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCodeExecutor(false)}
                className="glass hover:bg-white/20 border-0"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <CodeExecutor />
            </div>
          </Card>
        </div>
      )}

      {showPlugins && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Plugin System
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlugins(false)}
                className="glass hover:bg-white/20 border-0"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <PluginSystem />
            </div>
          </Card>
        </div>
      )}

      {showFeatureMenu && <div className="fixed inset-0 z-40" onClick={() => setShowFeatureMenu(false)} />}
    </div>
  )
}
