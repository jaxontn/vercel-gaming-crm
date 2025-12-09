"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconTrophy,
  IconMedal,
  IconUser,
  IconDownload,
  IconSearch,
  IconFilter,
  IconCalendar,
  IconTarget,
  IconBolt,
  IconCrown,
  IconAward,
  IconStar
} from "@tabler/icons-react"

interface LeaderboardEntry {
  rank: number
  playerId: string
  playerName: string
  avatar?: string
  totalSpins: number
  totalPoints: number
  biggestWin: number
  currentStreak: number
  bestStreak: number
  joinDate: string
  lastActive: string
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
}

interface TopPrize {
  prizeName: string
  count: number
  percentage: number
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    playerId: "USR001",
    playerName: "Sarah Chen",
    totalSpins: 1847,
    totalPoints: 15420,
    biggestWin: 500,
    currentStreak: 12,
    bestStreak: 28,
    joinDate: "2025-10-15",
    lastActive: "2025-12-08",
    tier: "diamond"
  },
  {
    rank: 2,
    playerId: "USR002",
    playerName: "Mike Johnson",
    totalSpins: 1653,
    totalPoints: 14250,
    biggestWin: 500,
    currentStreak: 8,
    bestStreak: 21,
    joinDate: "2025-10-18",
    lastActive: "2025-12-07",
    tier: "diamond"
  },
  {
    rank: 3,
    playerId: "USR003",
    playerName: "Emma Wilson",
    totalSpins: 1523,
    totalPoints: 13200,
    biggestWin: 200,
    currentStreak: 5,
    bestStreak: 18,
    joinDate: "2025-10-20",
    lastActive: "2025-12-08",
    tier: "platinum"
  },
  {
    rank: 4,
    playerId: "USR004",
    playerName: "James Rodriguez",
    totalSpins: 1432,
    totalPoints: 12800,
    biggestWin: 200,
    currentStreak: 3,
    bestStreak: 15,
    joinDate: "2025-10-22",
    lastActive: "2025-12-06",
    tier: "platinum"
  },
  {
    rank: 5,
    playerId: "USR005",
    playerName: "Lisa Thompson",
    totalSpins: 1387,
    totalPoints: 11500,
    biggestWin: 150,
    currentStreak: 7,
    bestStreak: 14,
    joinDate: "2025-10-25",
    lastActive: "2025-12-08",
    tier: "gold"
  },
  {
    rank: 6,
    playerId: "USR006",
    playerName: "David Kim",
    totalSpins: 1254,
    totalPoints: 10800,
    biggestWin: 150,
    currentStreak: 0,
    bestStreak: 12,
    joinDate: "2025-11-01",
    lastActive: "2025-12-05",
    tier: "gold"
  },
  {
    rank: 7,
    playerId: "USR007",
    playerName: "Amy Zhang",
    totalSpins: 1198,
    totalPoints: 9800,
    biggestWin: 100,
    currentStreak: 2,
    bestStreak: 11,
    joinDate: "2025-11-03",
    lastActive: "2025-12-08",
    tier: "silver"
  },
  {
    rank: 8,
    playerId: "USR008",
    playerName: "Robert Brown",
    totalSpins: 1123,
    totalPoints: 9200,
    biggestWin: 100,
    currentStreak: 4,
    bestStreak: 10,
    joinDate: "2025-11-05",
    lastActive: "2025-12-07",
    tier: "silver"
  }
]

const topPrizes: TopPrize[] = [
  { prizeName: "10 Points", count: 342, percentage: 42.5 },
  { prizeName: "25 Points", count: 189, percentage: 23.5 },
  { prizeName: "50 Points", count: 87, percentage: 10.8 },
  { prizeName: "100 Points", count: 45, percentage: 5.6 },
  { prizeName: "Try Again", count: 123, percentage: 15.3 },
  { prizeName: "Mystery Box", count: 12, percentage: 1.5 }
]

const tierColors = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  platinum: "bg-purple-400",
  diamond: "bg-blue-400"
}

const tierBadgeColors = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-gray-100 text-gray-800",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800",
  diamond: "bg-blue-100 text-blue-800"
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return IconCrown
    case 2: return IconAward
    case 3: return IconMedal
    default: return IconTrophy
  }
}

export default function SpinWinLeaderboardPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [leaderboardType, setLeaderboardType] = useState("points")
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState("all")

  const filteredData = mockLeaderboardData.filter(entry => {
    const matchesSearch = entry.playerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === "all" || entry.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const sortedData = [...filteredData].sort((a, b) => {
    switch (leaderboardType) {
      case "spins": return b.totalSpins - a.totalSpins
      case "streak": return b.bestStreak - a.bestStreak
      case "win": return b.biggestWin - a.biggestWin
      default: return b.totalPoints - a.totalPoints
    }
  }).map((entry, index) => ({ ...entry, rank: index + 1 }))

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">Top players and achievement rankings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top 3 Players Highlight */}
      <div className="grid gap-4 md:grid-cols-3">
        {sortedData.slice(0, 3).map((entry, index) => {
          const RankIcon = getRankIcon(entry.rank)
          return (
            <Card key={entry.playerId} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${tierColors[entry.tier]}`} />
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500' :
                      entry.rank === 2 ? 'bg-gray-400' :
                      'bg-amber-600'
                    }`}>
                      <RankIcon className="h-10 w-10" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                      <span className="text-sm font-bold">#{entry.rank}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl">{entry.playerName}</CardTitle>
                <Badge className={tierBadgeColors[entry.tier]}>
                  {entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1)} Tier
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Points</p>
                    <p className="font-semibold">{entry.totalPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Spins</p>
                    <p className="font-semibold">{entry.totalSpins}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Best Streak</p>
                    <p className="font-semibold">{entry.bestStreak} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Biggest Win</p>
                    <p className="font-semibold">{entry.biggestWin} pts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Players</CardTitle>
          <CardDescription>Complete leaderboard with all players</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={leaderboardType} onValueChange={setLeaderboardType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Total Points</SelectItem>
                  <SelectItem value="spins">Total Spins</SelectItem>
                  <SelectItem value="streak">Best Streak</SelectItem>
                  <SelectItem value="win">Biggest Win</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Total Points</TableHead>
                <TableHead className="text-right">Total Spins</TableHead>
                <TableHead className="text-right">Biggest Win</TableHead>
                <TableHead className="text-right">Current Streak</TableHead>
                <TableHead className="text-right">Best Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((entry) => {
                const RankIcon = getRankIcon(entry.rank)
                return (
                  <TableRow key={entry.playerId}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <RankIcon className={`h-5 w-5 ${
                          entry.rank === 1 ? 'text-yellow-500' :
                          entry.rank === 2 ? 'text-gray-400' :
                          entry.rank === 3 ? 'text-amber-600' :
                          'text-gray-300'
                        }`} />
                        <span className="font-semibold">#{entry.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <IconUser className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{entry.playerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.playerId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={tierBadgeColors[entry.tier]}>
                        {entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.totalPoints.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.totalSpins.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.biggestWin} pts
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.currentStreak > 0 ? (
                        <div className="flex items-center justify-end space-x-1">
                          <IconBolt className="h-4 w-4 text-yellow-500" />
                          <span>{entry.currentStreak}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{entry.bestStreak}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTarget className="h-5 w-5" />
              Prize Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPrizes.map((prize) => (
                <div key={prize.prizeName} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{prize.prizeName}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${prize.percentage * 2}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {prize.count} ({prize.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconStar className="h-5 w-5" />
              Tier Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tierColors).map(([tier, color]) => {
                const count = mockLeaderboardData.filter(e => e.tier === tier).length
                const percentage = (count / mockLeaderboardData.length) * 100
                return (
                  <div key={tier} className="flex items-center justify-between">
                    <Badge className={tierBadgeColors[tier as keyof typeof tierBadgeColors]}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full`}
                          style={{ width: `${percentage * 2}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}