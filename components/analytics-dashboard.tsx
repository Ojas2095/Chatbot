"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, MessageSquare, Clock, Zap, Brain, Users, Activity, Target, Award, Calendar } from "lucide-react"

interface AnalyticsData {
  totalChats: number
  totalMessages: number
  avgResponseTime: number
  userSatisfaction: number
  activeUsers: number
  topModels: Array<{ name: string; usage: number; color: string }>
  dailyActivity: Array<{ date: string; messages: number; users: number }>
  responseTimeData: Array<{ hour: string; avgTime: number }>
  satisfactionTrend: Array<{ date: string; score: number }>
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const dailyActivity = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        messages: Math.floor(Math.random() * 100) + 50,
        users: Math.floor(Math.random() * 20) + 10,
      }))

      const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        avgTime: Math.random() * 2 + 0.5,
      }))

      const satisfactionTrend = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: Math.random() * 20 + 80,
      }))

      return {
        totalChats: 1247,
        totalMessages: 8934,
        avgResponseTime: 1.2,
        userSatisfaction: 94.5,
        activeUsers: 156,
        topModels: [
          { name: "Grok", usage: 45, color: "#0891b2" },
          { name: "Groq", usage: 35, color: "#10b981" },
          { name: "GPT-4", usage: 20, color: "#f59e0b" },
        ],
        dailyActivity,
        responseTimeData,
        satisfactionTrend,
      }
    }

    setTimeout(() => {
      setAnalyticsData(generateMockData())
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const timeRanges = [
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">Comprehensive insights into your AI chatbot performance</p>
            </div>
          </div>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                size="sm"
                variant={timeRange === range.value ? "default" : "outline"}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="glass p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <p className="text-2xl font-bold">{analyticsData.totalChats.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{analyticsData.avgResponseTime}s</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{analyticsData.activeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">{analyticsData.userSatisfaction}%</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{analyticsData.totalMessages.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">Daily Activity</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="messages" stroke="#0891b2" fill="rgba(8, 145, 178, 0.3)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Model Usage Distribution */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-secondary" />
            <h4 className="text-lg font-semibold">AI Model Usage</h4>
          </div>
          <div className="space-y-4">
            {analyticsData.topModels.map((model, index) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                    <span className="font-medium">{model.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{model.usage}%</span>
                </div>
                <Progress value={model.usage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Response Time Trend */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-accent" />
            <h4 className="text-lg font-semibold">Response Time (24h)</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Satisfaction Trend */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold">User Satisfaction</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="score" fill="rgba(8, 145, 178, 0.8)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-secondary" />
          <h4 className="text-lg font-semibold">Performance Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Peak Usage</span>
            </div>
            <p className="text-xs text-muted-foreground">Highest activity between 2-4 PM daily</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Best Model</span>
            </div>
            <p className="text-xs text-muted-foreground">Grok shows highest user satisfaction</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Optimization</span>
            </div>
            <p className="text-xs text-muted-foreground">Response time improved by 15% this week</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
