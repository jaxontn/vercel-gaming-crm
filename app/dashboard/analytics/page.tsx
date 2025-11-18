"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconTarget,
  IconDeviceGamepad2,
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconActivity,
  IconEye,
  IconDownload
} from "@tabler/icons-react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

interface MetricCard {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

interface TopPerformer {
  name: string
  value: string
  change: string
  type: string
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  const metricCards: MetricCard[] = [
    {
      title: "Total QR Scans",
      value: "5,347",
      change: "+28.4%",
      trend: "up",
      icon: <IconTarget className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Active Players",
      value: "1,247",
      change: "+15.6%",
      trend: "up",
      icon: <IconUsers className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Games Played",
      value: "8,923",
      change: "+42.1%",
      trend: "up",
      icon: <IconDeviceGamepad2 className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Conversion Rate",
      value: "23.8%",
      change: "+5.2%",
      trend: "up",
      icon: <IconActivity className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Revenue Generated",
      value: "$24,567",
      change: "+32.7%",
      trend: "up",
      icon: <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Avg. Session Duration",
      value: "4m 23s",
      change: "-8.3%",
      trend: "down",
      icon: <IconClock className="h-4 w-4 text-muted-foreground" />
    }
  ]

  const topPerformers: TopPerformer[] = [
    { name: "Summer Spin & Win", value: "2,847 scans", change: "+34%", type: "Campaign" },
    { name: "Spin & Win Game", value: "1,234 plays", change: "+28%", type: "Game" },
    { name: "Front Counter QR", value: "987 scans", change: "+45%", type: "Location" },
    { name: "Instagram Referral", value: "656 clicks", change: "+22%", type: "Channel" }
  ]

  const gameAnalytics = [
    { game: "Spin & Win", plays: 3247, completion: "89%", avgTime: "2m 15s", revenue: "$8,567" },
    { game: "Memory Match", plays: 1234, completion: "76%", avgTime: "3m 42s", revenue: "$3,234" },
    { game: "Lucky Dice", plays: 2156, completion: "82%", avgTime: "1m 58s", revenue: "$5,678" },
    { game: "Quick Tap", plays: 987, completion: "91%", avgTime: "45s", revenue: "$2,456" },
    { game: "Word Puzzle", plays: 543, completion: "68%", avgTime: "5m 12s", revenue: "$1,234" },
    { game: "Color Match", plays: 1456, completion: "85%", avgTime: "2m 34s", revenue: "$3,399" }
  ]

  const hourlyData = [
    { hour: "12 AM", scans: 23, players: 12 },
    { hour: "4 AM", scans: 15, players: 8 },
    { hour: "8 AM", scans: 145, players: 89 },
    { hour: "12 PM", scans: 456, players: 234 },
    { hour: "4 PM", scans: 678, players: 345 },
    { hour: "8 PM", scans: 234, players: 156 }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <IconDownload className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metricCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {card.trend === "up" ? (
                      <IconTrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <IconTrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {card.change}
                    </span>
                    <span>from last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart and Top Performers */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartAreaInteractive />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best performing campaigns and games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{performer.name}</p>
                          <p className="text-xs text-muted-foreground">{performer.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{performer.value}</p>
                        <p className="text-xs text-green-600">{performer.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Engagement Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>Unique users per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342</div>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <IconTrendingUp className="h-4 w-4" />
                  <span>+12.5% from last week</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg. Session Length</CardTitle>
                <CardDescription>Time spent per session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4m 23s</div>
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <IconTrendingDown className="h-4 w-4" />
                  <span>-8.3% from last week</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Retention Rate</CardTitle>
                <CardDescription>Users returning within 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">67.8%</div>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <IconTrendingUp className="h-4 w-4" />
                  <span>+5.2% from last week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>User engagement throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hourlyData.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-16">{hour.hour}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(hour.scans / 678) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{hour.scans} scans</div>
                      <div className="text-muted-foreground">{hour.players} players</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          {/* Game Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Game Performance</CardTitle>
              <CardDescription>Detailed metrics for each game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gameAnalytics.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IconDeviceGamepad2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{game.game}</h3>
                        <p className="text-sm text-muted-foreground">Most popular game</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-8 text-right">
                      <div>
                        <p className="text-lg font-semibold">{game.plays.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Plays</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{game.completion}</p>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{game.avgTime}</p>
                        <p className="text-xs text-muted-foreground">Avg Time</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{game.revenue}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Customer age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { age: "18-24", percentage: 23, count: 287 },
                    { age: "25-34", percentage: 38, count: 474 },
                    { age: "35-44", percentage: 25, count: 312 },
                    { age: "45-54", percentage: 10, count: 125 },
                    { age: "55+", percentage: 4, count: 50 }
                  ].map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-16">{group.age}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <span className="font-medium">{group.percentage}%</span>
                        <span className="text-muted-foreground ml-1">({group.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>How customers access your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { device: "Mobile", percentage: 68, icon: "📱" },
                    { device: "Desktop", percentage: 24, icon: "💻" },
                    { device: "Tablet", percentage: 8, icon: "📱" }
                  ].map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{device.icon}</span>
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}