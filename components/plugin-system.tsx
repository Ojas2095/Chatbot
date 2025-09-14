"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Puzzle,
  Download,
  Search,
  Star,
  Settings,
  Code,
  Zap,
  Globe,
  Calculator,
  Music,
  TrendingUp,
  Sparkles,
  Plus,
  ExternalLink,
} from "lucide-react"

interface Plugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  icon: string
  isInstalled: boolean
  isEnabled: boolean
  rating: number
  downloads: number
  features: string[]
  permissions: string[]
}

interface InstalledPlugin extends Plugin {
  settings: Record<string, any>
  lastUsed: Date
}

export function PluginSystem() {
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([])
  const [installedPlugins, setInstalledPlugins] = useState<InstalledPlugin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Plugins", icon: Puzzle },
    { id: "productivity", name: "Productivity", icon: TrendingUp },
    { id: "entertainment", name: "Entertainment", icon: Music },
    { id: "utilities", name: "Utilities", icon: Calculator },
    { id: "ai-tools", name: "AI Tools", icon: Sparkles },
    { id: "integrations", name: "Integrations", icon: Globe },
  ]

  useEffect(() => {
    const mockPlugins: Plugin[] = [
      {
        id: "weather-assistant",
        name: "Weather Assistant",
        description: "Get real-time weather information and forecasts for any location",
        version: "2.1.0",
        author: "WeatherCorp",
        category: "utilities",
        icon: "🌤️",
        isInstalled: true,
        isEnabled: true,
        rating: 4.8,
        downloads: 15420,
        features: ["Real-time weather", "7-day forecast", "Weather alerts"],
        permissions: ["Location access", "Internet access"],
      },
      {
        id: "code-formatter",
        name: "Code Formatter Pro",
        description: "Advanced code formatting and syntax highlighting for multiple languages",
        version: "1.5.2",
        author: "DevTools Inc",
        category: "productivity",
        icon: "💻",
        isInstalled: true,
        isEnabled: true,
        rating: 4.9,
        downloads: 8930,
        features: ["Multi-language support", "Custom formatting", "Syntax highlighting"],
        permissions: ["File access"],
      },
      {
        id: "image-enhancer",
        name: "AI Image Enhancer",
        description: "Enhance and upscale images using advanced AI algorithms",
        version: "3.0.1",
        author: "ImageAI Labs",
        category: "ai-tools",
        icon: "🖼️",
        isInstalled: false,
        isEnabled: false,
        rating: 4.7,
        downloads: 12340,
        features: ["Image upscaling", "Noise reduction", "Color enhancement"],
        permissions: ["File access", "Internet access"],
      },
      {
        id: "calendar-sync",
        name: "Calendar Integration",
        description: "Sync with Google Calendar, Outlook, and other calendar services",
        version: "2.3.0",
        author: "CalendarSync",
        category: "integrations",
        icon: "📅",
        isInstalled: false,
        isEnabled: false,
        rating: 4.6,
        downloads: 6780,
        features: ["Multi-calendar support", "Event creation", "Reminders"],
        permissions: ["Calendar access", "Internet access"],
      },
      {
        id: "music-player",
        name: "Smart Music Player",
        description: "AI-powered music recommendations and playlist generation",
        version: "1.8.0",
        author: "MusicAI",
        category: "entertainment",
        icon: "🎵",
        isInstalled: false,
        isEnabled: false,
        rating: 4.5,
        downloads: 9870,
        features: ["AI recommendations", "Playlist generation", "Mood detection"],
        permissions: ["Audio access", "Internet access"],
      },
      {
        id: "security-scanner",
        name: "Security Scanner",
        description: "Scan and analyze code for security vulnerabilities",
        version: "2.0.0",
        author: "SecureCode",
        category: "utilities",
        icon: "🔒",
        isInstalled: false,
        isEnabled: false,
        rating: 4.9,
        downloads: 4560,
        features: ["Vulnerability scanning", "Security reports", "Best practices"],
        permissions: ["File access"],
      },
    ]

    setTimeout(() => {
      setAvailablePlugins(mockPlugins)
      setInstalledPlugins(
        mockPlugins
          .filter((p) => p.isInstalled)
          .map((p) => ({
            ...p,
            settings: {},
            lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          })),
      )
      setIsLoading(false)
    }, 1000)
  }, [])

  const installPlugin = async (pluginId: string) => {
    const plugin = availablePlugins.find((p) => p.id === pluginId)
    if (!plugin) return

    const updatedPlugins = availablePlugins.map((p) =>
      p.id === pluginId ? { ...p, isInstalled: true, isEnabled: true } : p,
    )
    setAvailablePlugins(updatedPlugins)

    const installedPlugin: InstalledPlugin = {
      ...plugin,
      isInstalled: true,
      isEnabled: true,
      settings: {},
      lastUsed: new Date(),
    }
    setInstalledPlugins((prev) => [...prev, installedPlugin])
  }

  const uninstallPlugin = async (pluginId: string) => {
    const updatedPlugins = availablePlugins.map((p) =>
      p.id === pluginId ? { ...p, isInstalled: false, isEnabled: false } : p,
    )
    setAvailablePlugins(updatedPlugins)
    setInstalledPlugins((prev) => prev.filter((p) => p.id !== pluginId))
  }

  const togglePlugin = async (pluginId: string) => {
    setInstalledPlugins((prev) => prev.map((p) => (p.id === pluginId ? { ...p, isEnabled: !p.isEnabled } : p)))
    setAvailablePlugins((prev) => prev.map((p) => (p.id === pluginId ? { ...p, isEnabled: !p.isEnabled } : p)))
  }

  const filteredPlugins = availablePlugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Puzzle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Plugin System</h3>
            <p className="text-sm text-muted-foreground">Extend your chatbot with powerful plugins and integrations</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plugins..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Plugins</TabsTrigger>
            <TabsTrigger value="installed">Installed ({installedPlugins.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlugins.map((plugin) => (
                <Card key={plugin.id} className="glass p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{plugin.icon}</div>
                      <div>
                        <h4 className="font-semibold text-sm">{plugin.name}</h4>
                        <p className="text-xs text-muted-foreground">v{plugin.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{plugin.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plugin.description}</p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {plugin.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {plugin.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{plugin.features.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{plugin.downloads.toLocaleString()} downloads</span>
                      <span>by {plugin.author}</span>
                    </div>

                    <div className="flex gap-2">
                      {plugin.isInstalled ? (
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => uninstallPlugin(plugin.id)}
                            className="flex-1"
                          >
                            Uninstall
                          </Button>
                          <div className="flex items-center gap-2">
                            <Switch checked={plugin.isEnabled} onCheckedChange={() => togglePlugin(plugin.id)} />
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => installPlugin(plugin.id)}
                          className="w-full flex items-center gap-2"
                        >
                          <Download className="w-3 h-3" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="installed" className="mt-6">
            {installedPlugins.length === 0 ? (
              <Card className="glass p-8 text-center">
                <Puzzle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">No Plugins Installed</h4>
                <p className="text-muted-foreground mb-4">
                  Browse and install plugins to extend your chatbot's capabilities
                </p>
                <Button onClick={() => setSelectedCategory("all")}>Browse Plugins</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {installedPlugins.map((plugin) => (
                  <Card key={plugin.id} className="glass p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{plugin.icon}</div>
                        <div>
                          <h4 className="font-semibold">{plugin.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last used: {plugin.lastUsed.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={plugin.isEnabled ? "default" : "secondary"}>
                          {plugin.isEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch checked={plugin.isEnabled} onCheckedChange={() => togglePlugin(plugin.id)} />
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Plugin Development */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold">Plugin Development</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Create your own plugins to extend the chatbot's functionality
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <ExternalLink className="w-4 h-4" />
            Documentation
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Create Plugin
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold">{availablePlugins.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <Puzzle className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Installed</p>
              <p className="text-2xl font-bold">{installedPlugins.length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{installedPlugins.filter((p) => p.isEnabled).length}</p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">4.7</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
