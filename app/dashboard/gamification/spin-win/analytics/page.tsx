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
  IconChartPie
} from "@tabler/icons-react"

interface TimeSeriesData {
  date: string
  spins: number
  players: number
  points: number
  engagement: number
}

interface PrizeData {
  name: string
  value: number
  count: number
  color: string
}

interface HourlyData {
  hour: string
  spins: number
}

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: "2025-12-01", spins: 1200, players: 450, points: 28000, engagement: 75 },
  { date: "2025-12-02", spins: 1350, players: 520, points: 31000, engagement: 78 },
  { date: "2025-12-03", spins: 1100, players: 410, points: 25000, engagement: 73 },
  { date: "2025-12-04", spins: 1450, players: 580, points: 34000, engagement: 82 },
  { date: "2025-12-05", spins: 1600, players: 620, points: 38000, engagement: 85 },
  { date: "2025-12-06", spins: 1800, players: 720, points: 42000, engagement: 88 },
  { date: "2025-12-07", spins: 1550, players: 590, points: 36000, engagement: 83 },
]

const mockPrizeDistribution: PrizeData[] = [
  { name: "10 Points", value: 35, count: 342, color: "#10B981" },
  { name: "25 Points", value: 25, count: 189, color: "#3B82F6" },
  { name: "50 Points", value: 15, count: 87, color: "#8B5CF6" },
  { name: "100 Points", value: 10, count: 45, color: "#F59E0B" },
  { name: "Try Again", value: 10, count: 123, color: "#EF4444" },
  { name: "Mystery Box", value: 5, count: 12, color: "#EC4899" },
]

const mockHourlyData: HourlyData[] = [
  { hour: "00:00", spins: 45 },
  { hour: "04:00", spins: 20 },
  { hour: "08:00", spins: 180 },
  { hour: "12:00", spins: 320 },
  { hour: "16:00", spins: 280 },
  { hour: "20:00", spins: 380 },
]

const demographicsData = [
  { age: "18-24", players: 450, percentage: 20 },
  { age: "25-34", players: 720, percentage: 32 },
  { age: "35-44", players: 680, percentage: 30 },
  { age: "45-54", players: 320, percentage: 14 },
  { age: "55+", players: 86, percentage: 4 },
]

export default function SpinWinAnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [metric, setMetric] = useState("spins")

  const totalSpins = mockTimeSeriesData.reduce((acc, day) => acc + day.spins, 0)
  const totalPlayers = mockTimeSeriesData.reduce((acc, day) => acc + day.players, 0) / 7
  const avgEngagement = mockTimeSeriesData.reduce((acc, day) => acc + day.engagement, 0) / 7

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spin & Win Analytics</h2>
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
            <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
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
              <span className="text-green-600">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Distributed</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="prizes">Prize Distribution</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChartLine className="h-5 w-5" />
                  Spins Over Time
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
                    <Area type="monotone" dataKey="spins" stroke="#3B82F6" fill="#93C5FD" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconClock className="h-5 w-5" />
                  Peak Playing Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockHourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="spins" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconActivity className="h-5 w-5" />
                Engagement Trends
              </CardTitle>
              <CardDescription>Daily engagement rate and active players</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockTimeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#10B981" name="Engagement %" />
                  <Line yAxisId="right" type="monotone" dataKey="players" stroke="#F59E0B" name="Active Players" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prizes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChartPie className="h-5 w-5" />
                  Prize Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockPrizeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockPrizeDistribution.map((entry, index) => (
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
                <CardTitle>Prize Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPrizeDistribution.map((prize) => (
                    <div key={prize.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: prize.color }}
                        />
                        <span className="text-sm font-medium">{prize.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{prize.value}%</Badge>
                        <span className="text-sm text-muted-foreground">
                          {prize.count} won
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Player Demographics</CardTitle>
              <CardDescription>Age distribution of players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographicsData.map((group) => (
                  <div key={group.age} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{group.age} years</p>
                      <p className="text-sm text-muted-foreground">
                        {group.players.toLocaleString()} players
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${group.percentage * 3}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {group.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}