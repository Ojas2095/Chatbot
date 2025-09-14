"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Brain, Plus, X, Edit, Save, Trash2, User, Calendar, Tag } from "lucide-react"
import { useAuth } from "./auth-provider"

interface MemoryItem {
  id: string
  type: "personal" | "preference" | "fact" | "context"
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  importance: "low" | "medium" | "high"
}

interface MemorySystemProps {
  isOpen: boolean
  onClose: () => void
}

export function MemorySystem({ isOpen, onClose }: MemorySystemProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [newMemory, setNewMemory] = useState({
    type: "personal" as MemoryItem["type"],
    title: "",
    content: "",
    tags: "",
    importance: "medium" as MemoryItem["importance"],
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const savedMemories = localStorage.getItem(`chatbot-memories-${user.id}`)
      if (savedMemories) {
        const parsed = JSON.parse(savedMemories)
        setMemories(
          parsed.map((mem: any) => ({
            ...mem,
            createdAt: new Date(mem.createdAt),
            updatedAt: new Date(mem.updatedAt),
          })),
        )
      }
    }
  }, [user])

  useEffect(() => {
    if (user && memories.length > 0) {
      localStorage.setItem(`chatbot-memories-${user.id}`, JSON.stringify(memories))
    }
  }, [memories, user])

  const addMemory = () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) return

    const memory: MemoryItem = {
      id: Date.now().toString(),
      type: newMemory.type,
      title: newMemory.title.trim(),
      content: newMemory.content.trim(),
      tags: newMemory.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      importance: newMemory.importance,
    }

    setMemories((prev) => [memory, ...prev])
    setNewMemory({
      type: "personal",
      title: "",
      content: "",
      tags: "",
      importance: "medium",
    })
  }

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((mem) => mem.id !== id))
  }

  const updateMemory = (id: string, updates: Partial<MemoryItem>) => {
    setMemories((prev) => prev.map((mem) => (mem.id === id ? { ...mem, ...updates, updatedAt: new Date() } : mem)))
    setEditingId(null)
  }

  const filteredMemories = memories.filter(
    (memory) =>
      searchQuery === "" ||
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getTypeIcon = (type: MemoryItem["type"]) => {
    switch (type) {
      case "personal":
        return <User className="w-4 h-4" />
      case "preference":
        return <Tag className="w-4 h-4" />
      case "fact":
        return <Brain className="w-4 h-4" />
      case "context":
        return <Calendar className="w-4 h-4" />
    }
  }

  const getImportanceColor = (importance: MemoryItem["importance"]) => {
    switch (importance) {
      case "high":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-700 border-green-500/30"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] glass border-0 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Memory System
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences for better AI responses
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="glass hover:bg-white/20 border-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Add New Memory */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Memory
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memory-type">Type</Label>
                <select
                  id="memory-type"
                  value={newMemory.type}
                  onChange={(e) => setNewMemory((prev) => ({ ...prev, type: e.target.value as MemoryItem["type"] }))}
                  className="w-full p-2 glass border-0 rounded-lg focus:ring-2 focus:ring-primary/50"
                >
                  <option value="personal">Personal Info</option>
                  <option value="preference">Preference</option>
                  <option value="fact">Important Fact</option>
                  <option value="context">Context</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memory-importance">Importance</Label>
                <select
                  id="memory-importance"
                  value={newMemory.importance}
                  onChange={(e) =>
                    setNewMemory((prev) => ({ ...prev, importance: e.target.value as MemoryItem["importance"] }))
                  }
                  className="w-full p-2 glass border-0 rounded-lg focus:ring-2 focus:ring-primary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-title">Title</Label>
              <Input
                id="memory-title"
                value={newMemory.title}
                onChange={(e) => setNewMemory((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., My favorite programming language"
                className="glass border-0 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-content">Content</Label>
              <Textarea
                id="memory-content"
                value={newMemory.content}
                onChange={(e) => setNewMemory((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="e.g., I prefer TypeScript over JavaScript for large projects"
                className="glass border-0 focus:ring-2 focus:ring-primary/50 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-tags">Tags (comma-separated)</Label>
              <Input
                id="memory-tags"
                value={newMemory.tags}
                onChange={(e) => setNewMemory((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., programming, typescript, preferences"
                className="glass border-0 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button
              onClick={addMemory}
              disabled={!newMemory.title.trim() || !newMemory.content.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="memory-search">Search Memories</Label>
            <Input
              id="memory-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content, or tags..."
              className="glass border-0 focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Memory List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Memories ({filteredMemories.length})</h3>

            {filteredMemories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No memories found. Add some to help the AI remember your preferences!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMemories.map((memory) => (
                  <div key={memory.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(memory.type)}
                          <span className="text-sm font-medium capitalize">{memory.type}</span>
                        </div>
                        <Badge className={`text-xs ${getImportanceColor(memory.importance)}`}>
                          {memory.importance}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(memory.id)}
                          className="hover:bg-white/20"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMemory(memory.id)}
                          className="hover:bg-red-500/20 text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {editingId === memory.id ? (
                      <div className="space-y-3">
                        <Input
                          value={memory.title}
                          onChange={(e) => updateMemory(memory.id, { title: e.target.value })}
                          className="glass border-0 focus:ring-2 focus:ring-primary/50"
                        />
                        <Textarea
                          value={memory.content}
                          onChange={(e) => updateMemory(memory.id, { content: e.target.value })}
                          className="glass border-0 focus:ring-2 focus:ring-primary/50"
                        />
                        <Button
                          size="sm"
                          onClick={() => setEditingId(null)}
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium">{memory.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{memory.content}</p>

                        {memory.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {memory.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs glass">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Created: {memory.createdAt.toLocaleDateString()}
                          {memory.updatedAt > memory.createdAt && (
                            <span> • Updated: {memory.updatedAt.toLocaleDateString()}</span>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
