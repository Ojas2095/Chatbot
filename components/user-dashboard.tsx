"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import {
  User,
  Settings,
  MessageSquare,
  Brain,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Edit,
  Save,
  X,
  Camera,
  Download,
  Upload,
} from "lucide-react"
import { useAuth } from "./auth-provider"

interface UserStats {
  totalConversations: number
  totalMessages: number
  favoriteModel: string
  avgResponseTime: number
  memoryItems: number
  joinDate: Date
  lastActive: Date
  streakDays: number
}

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function UserDashboard({ isOpen, onClose }: UserDashboardProps) {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    avatar: user?.avatar || "",
  })
  const [stats, setStats] = useState<UserStats>({
    totalConversations: 0,
    totalMessages: 0,
    favoriteModel: "grok",
    avgResponseTime: 1.2,
    memoryItems: 0,
    joinDate: new Date(),
    lastActive: new Date(),
    streakDays: 1,
  })

  useEffect(() => {
    if (user) {
      // Load user stats from localStorage
      const conversations = JSON.parse(localStorage.getItem("chatbot-conversations") || "[]")
      const memories = JSON.parse(localStorage.getItem(`chatbot-memories-${user.id}`) || "[]")
      const userProfile = JSON.parse(localStorage.getItem(`user-profile-${user.id}`) || "{}")

      const totalMessages = conversations.reduce((acc: number, conv: any) => acc + conv.messages.length, 0)

      setStats({
        totalConversations: conversations.length,
        totalMessages,
        favoriteModel: user.preferences.defaultModel,
        avgResponseTime: 1.2,
        memoryItems: memories.length,
        joinDate: new Date(userProfile.joinDate || Date.now()),
        lastActive: new Date(),
        streakDays: userProfile.streakDays || 1,
      })

      setEditForm({
        name: user.name,
        email: user.email,
        bio: userProfile.bio || "",
        avatar: user.avatar || "",
      })
    }
  }, [user])

  const saveProfile = () => {
    if (user) {
      const profileData = {
        ...editForm,
        joinDate: stats.joinDate,
        streakDays: stats.streakDays,
        updatedAt: new Date(),
      }
      localStorage.setItem(`user-profile-${user.id}`, JSON.stringify(profileData))
      setIsEditing(false)
    }
  }

  const exportUserData = () => {
    if (!user) return

    const conversations = JSON.parse(localStorage.getItem("chatbot-conversations") || "[]")
    const memories = JSON.parse(localStorage.getItem(`chatbot-memories-${user.id}`) || "[]")
    const profile = JSON.parse(localStorage.getItem(`user-profile-${user.id}`) || "{}")

    const userData = {
      profile: { ...user, ...profile },
      conversations,
      memories,
      stats,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chatbot-data-${user.name.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] glass border-0 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-primary/50">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="glass bg-primary/20 text-primary border-primary/30">Premium User</Badge>
                  <Badge className="glass bg-secondary/20 text-secondary border-secondary/30">
                    {stats.streakDays} Day Streak
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="glass hover:bg-white/20 border-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-0">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalConversations}</div>
                    <div className="text-sm text-muted-foreground">Conversations</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold">{stats.totalMessages}</div>
                    <div className="text-sm text-muted-foreground">Messages</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-4 text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-bold">{stats.memoryItems}</div>
                    <div className="text-sm text-muted-foreground">Memories</div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stats.streakDays}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Analytics */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Favorite Model: {stats.favoriteModel.toUpperCase()}</span>
                      <span>85% usage</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{stats.avgResponseTime}s avg</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Utilization</span>
                      <span>{Math.min(100, (stats.memoryItems / 50) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(100, (stats.memoryItems / 50) * 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="glass bg-primary/20 hover:bg-primary/30 border-primary/30 text-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button className="glass bg-secondary/20 hover:bg-secondary/30 border-secondary/30 text-secondary">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="glass border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant="ghost"
                      onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}
                      className="glass hover:bg-white/20 border-0"
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 ring-2 ring-primary/50">
                        <AvatarImage src={editForm.avatar || "/placeholder.svg"} alt={editForm.name} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                          {editForm.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profile-name">Full Name</Label>
                          <Input
                            id="profile-name"
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                            className="glass border-0 focus:ring-2 focus:ring-primary/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profile-email">Email</Label>
                          <Input
                            id="profile-email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="glass border-0 focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profile-bio">Bio</Label>
                        <Textarea
                          id="profile-bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Tell us about yourself..."
                          className="glass border-0 focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="flex items-center gap-2 p-2 glass rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{stats.joinDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Last Active</Label>
                      <div className="flex items-center gap-2 p-2 glass rounded-lg">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{stats.lastActive.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions with the AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 glass rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Started new conversation</div>
                          <div className="text-sm text-muted-foreground">Discussed AI capabilities and features</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {i} hour{i > 1 ? "s" : ""} ago
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your AI experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Default AI Model</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred AI model</p>
                      </div>
                      <select className="glass border-0 rounded-lg p-2 focus:ring-2 focus:ring-primary/50">
                        <option value="grok">Grok</option>
                        <option value="groq">Groq</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Voice Input</Label>
                        <p className="text-sm text-muted-foreground">Enable voice-to-text input</p>
                      </div>
                      <Button variant="outline" className="glass border-primary/30 bg-transparent">
                        {user.preferences.voiceEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Theme</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <select className="glass border-0 rounded-lg p-2 focus:ring-2 focus:ring-primary/50">
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your data and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={exportUserData}
                    className="w-full glass bg-primary/20 hover:bg-primary/30 border-primary/30 text-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>

                  <Button variant="destructive" onClick={logout} className="w-full">
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
