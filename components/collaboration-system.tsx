"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Share2, Copy, Eye, MessageCircle, Zap } from "lucide-react"

interface CollaborativeUser {
  id: string
  name: string
  avatar: string
  isTyping: boolean
  lastSeen: Date
  color: string
}

interface SharedSession {
  id: string
  name: string
  participants: CollaborativeUser[]
  createdAt: Date
  isActive: boolean
}

export function CollaborationSystem() {
  const [currentSession, setCurrentSession] = useState<SharedSession | null>(null)
  const [sessionCode, setSessionCode] = useState("")
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const userColors = ["#0891b2", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  const createSession = async () => {
    setIsCreatingSession(true)
    try {
      const newSession: SharedSession = {
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: `Chat Session ${Date.now()}`,
        participants: [
          {
            id: "current-user",
            name: "You",
            avatar: "",
            isTyping: false,
            lastSeen: new Date(),
            color: userColors[0],
          },
        ],
        createdAt: new Date(),
        isActive: true,
      }
      setCurrentSession(newSession)
      setActiveUsers(newSession.participants)
    } catch (error) {
      console.error("Failed to create session:", error)
    } finally {
      setIsCreatingSession(false)
    }
  }

  const joinSession = async () => {
    if (!sessionCode.trim()) return

    try {
      const mockSession: SharedSession = {
        id: sessionCode,
        name: `Shared Chat ${sessionCode}`,
        participants: [
          {
            id: "current-user",
            name: "You",
            avatar: "",
            isTyping: false,
            lastSeen: new Date(),
            color: userColors[1],
          },
          {
            id: "other-user",
            name: "Alice",
            avatar: "",
            isTyping: false,
            lastSeen: new Date(),
            color: userColors[0],
          },
        ],
        createdAt: new Date(),
        isActive: true,
      }
      setCurrentSession(mockSession)
      setActiveUsers(mockSession.participants)
      setSessionCode("")
    } catch (error) {
      console.error("Failed to join session:", error)
    }
  }

  const copySessionCode = () => {
    if (currentSession) {
      navigator.clipboard.writeText(currentSession.id)
    }
  }

  const leaveSession = () => {
    setCurrentSession(null)
    setActiveUsers([])
    setTypingUsers([])
  }

  useEffect(() => {
    if (currentSession && activeUsers.length > 1) {
      const interval = setInterval(() => {
        const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)]
        if (randomUser.id !== "current-user" && Math.random() > 0.7) {
          setTypingUsers((prev) =>
            prev.includes(randomUser.name)
              ? prev.filter((name) => name !== randomUser.name)
              : [...prev, randomUser.name],
          )
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((name) => name !== randomUser.name))
          }, 2000)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [currentSession, activeUsers])

  if (currentSession) {
    return (
      <div className="space-y-4">
        {/* Session Header */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Collaborative Session</h3>
                <p className="text-sm text-muted-foreground">Session ID: {currentSession.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={copySessionCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button size="sm" variant="destructive" onClick={leaveSession}>
                Leave
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Active Users ({activeUsers.length})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <Avatar className="w-8 h-8" style={{ borderColor: user.color }}>
                  <AvatarFallback style={{ backgroundColor: user.color + "20", color: user.color }}>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{user.name}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <Card className="glass p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4 animate-pulse" />
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          </Card>
        )}

        {/* Real-time Activity Feed */}
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Live Activity</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Alice joined the session
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              You started a new conversation
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
            <p className="text-sm text-muted-foreground">Chat together with friends and colleagues in real-time</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Session */}
          <div className="space-y-4">
            <h4 className="font-medium">Create New Session</h4>
            <p className="text-sm text-muted-foreground">Start a new collaborative chat session and invite others</p>
            <Button onClick={createSession} disabled={isCreatingSession} className="w-full">
              {isCreatingSession ? "Creating..." : "Create Session"}
            </Button>
          </div>

          {/* Join Session */}
          <div className="space-y-4">
            <h4 className="font-medium">Join Existing Session</h4>
            <p className="text-sm text-muted-foreground">Enter a session code to join an existing chat</p>
            <div className="flex gap-2">
              <Input
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Enter session code"
                className="flex-1"
                maxLength={6}
              />
              <Button onClick={joinSession} disabled={!sessionCode.trim()}>
                Join
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Live Chat</h4>
          </div>
          <p className="text-sm text-muted-foreground">See messages and responses in real-time as they happen</p>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-secondary" />
            <h4 className="font-medium">Presence</h4>
          </div>
          <p className="text-sm text-muted-foreground">See who's online and what they're doing</p>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <Share2 className="w-5 h-5 text-accent" />
            <h4 className="font-medium">Easy Sharing</h4>
          </div>
          <p className="text-sm text-muted-foreground">Share session codes to invite others instantly</p>
        </Card>
      </div>
    </div>
  )
}
