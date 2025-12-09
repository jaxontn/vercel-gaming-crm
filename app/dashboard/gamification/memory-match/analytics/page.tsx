"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  IconTrendingUp,
  IconTarget,
  IconUsers,
  IconClock,
  IconCalendar,
  IconTrophy,
  IconActivity,
  IconChartLine,
  IconChartPie,
  IconBrain
} from "@tabler/icons-react"

interface TimeSeriesData {
  date: string
  games: number
  players: number
  points: number
  completionRate: number
}

interface DifficultyData {
  name: string
  value: number
  count: number
  color: string
}

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: "2025-12-01", games: 450, players: 200, points: 12000, completionRate: 65 },
  { date: "2025-12-02", games: 520, players: 230, points: 14500, completionRate: 70 },
  { date: "2025-12-03", games: 410, players: 185, points: 11000, completionRate: 68 },
  { date: "2025-12-04", games: 580, players: 260, points: 16000, completionRate: 75 },
  { date: "2025-12-05", games: 620, players: 280, points: 17500, completionRate: 78 },
  { date: "2025-12-06", games: 720, players: 320, points: 20000, completionRate: 82 },
  { date: "2025-12-07", games: 590, players: 265, points: 17000, completionRate: 80 },
]

const mockDifficultyDistribution: DifficultyData[] = [
  { name: "Easy (4x4)", value: 45, count: 892, color: "#10B981" },
  { name: "Medium (6x6)", value: 35, count: 694, color: "#3B82F6" },
  { name: "Hard (8x8)", value: 20, count: 397, color: "#8B5CF6" },
]

export default function MemoryMatchAnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [metric, setMetric] = useState("games")

  const totalGames = mockTimeSeriesData.reduce((acc, day) => acc + day.games, 0)
  const totalPlayers = mockTimeSeriesData.reduce((acc, day) => acc + day.players, 0) / 7
  const avgCompletion = mockTimeSeriesData.reduce((acc, day) => acc + day.completionRate, 0) / 7

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Memory Match Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into game performance and player behavior</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <IconBrain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGames.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.2%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Players</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalPlayers).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+9.1%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.4%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Distributed</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">108K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.8%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChartLine className="h-5 w-5" />
                  Games Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="games" stroke="#8B5CF6" fill="#C4B5FD" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconActivity className="h-5 w-5" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completionRate" stroke="#10B981" name="Completion %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChartPie className="h-5 w-5" />
                  Difficulty Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockDifficultyDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockDifficultyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDifficultyDistribution.map((difficulty) => (
                    <div key={difficulty.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: difficulty.color }}
                        />
                        <span className="text-sm font-medium">{difficulty.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{difficulty.value}%</Badge>
                        <span className="text-sm text-muted-foreground">
                          {difficulty.count} games
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTarget className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Average completion times and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2:35</div>
                  <div className="text-sm text-muted-foreground">Avg. Completion Time (Easy)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4:12</div>
                  <div className="text-sm text-muted-foreground">Avg. Completion Time (Medium)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">6:48</div>
                  <div className="text-sm text-muted-foreground">Avg. Completion Time (Hard)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}