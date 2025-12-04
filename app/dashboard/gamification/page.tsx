"use client"

import { useState, useEffect } from "react"
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconTrophy,
  IconTrendingUp,
  IconUsers,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react"
import { callApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GameGrid } from "@/components/GameGrid"
import { GameStats } from "@/components/GameStats"

interface Game {
  id: string
  game_code: string
  game_name: string
  description: string
  category: string
  icon: string
  is_enabled: boolean | string
  daily_play_limit: number | string
  total_sessions: number | string
  avg_score: number | string
  completion_rate: number
  prizes_count: number | string
  achievements_count: number | string
}

export default function GamificationDashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)

        // Check if user is authenticated before making API call
        const userId = sessionStorage.getItem('id')
        const sessionSecret = sessionStorage.getItem('session_secret')

        if (userId && sessionSecret) {
          // User is authenticated, fetch games from API
          const response = await callApi('merchant_games', 'list')

          if (response.status === 'SUCCESS' && response.data?.data?.games) {
            setGames(response.data.data.games)
            setError(null)
          } else {
            throw new Error(response.message || 'Failed to fetch games')
          }
        } else {
          // User is not authenticated, show error
          console.log('User not authenticated')
          setError('Please log in to view games')
          setGames([])
      }
      } catch (err) {
        console.error('Failed to fetch games:', err)
        setError('Failed to load games')
        setGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Filter games
  useEffect(() => {
    let filtered = games

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(game => game.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      const isEnabled = statusFilter === "enabled"
      filtered = filtered.filter(game => (game.is_enabled === true || game.is_enabled === '1') === isEnabled)
    }

    setFilteredGames(filtered)
  }, [games, searchTerm, categoryFilter, statusFilter])

  // Calculate statistics
  const stats = {
    totalGames: games.length,
    enabledGames: games.filter(g => g.is_enabled === true || g.is_enabled === '1').length,
    totalSessions: games.reduce((sum, g) => sum + Number(g.total_sessions || 0), 0),
    avgCompletionRate: games.length > 0
      ? games.reduce((sum, g) => sum + (g.completion_rate || 0), 0) / games.length * 100
      : 0,
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gamification Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Add New Game
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames}</div>
            <p className="text-xs text-muted-foreground">
              {stats.enabledGames} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled Games</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enabledGames}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalGames - stats.enabledGames} disabled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all games
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="luck">Luck</SelectItem>
            <SelectItem value="skill">Skill</SelectItem>
            <SelectItem value="puzzle">Puzzle</SelectItem>
            <SelectItem value="arcade">Arcade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="enabled">
              <div className="flex items-center">
                <IconEye className="mr-2 h-4 w-4" />
                Enabled
              </div>
            </SelectItem>
            <SelectItem value="disabled">
              <div className="flex items-center">
                <IconEyeOff className="mr-2 h-4 w-4" />
                Disabled
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Game Grid */}
      <GameGrid games={filteredGames} />
    </div>
  )
}