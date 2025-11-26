"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Switch,
} from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  IconTrophy,
  IconSettings,
  IconUsers,
  IconTarget,
  IconTrendingUp,
  IconClock,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGift,
  IconStar,
  IconPuzzle,
  IconBrain,
  IconPlayerPlay
} from "@tabler/icons-react"
import { UserGameDataTable } from "@/components/user-game-data-table"
import { GameLeaderboard } from "@/components/game-leaderboard"

interface CardLevel {
  id: string
  name: string
  gridSize: number
  pairs: number
  difficulty: "Easy" | "Medium" | "Hard"
  pointsReward: number
  timeLimit: number
  completionRate: number
  averageTime: number
}

interface MemoryStats {
  totalGames: number
  todayGames: number
  uniquePlayers: number
  avgCompletionTime: number
  bestTime: string
  completionRate: number
}

const mockLevels: CardLevel[] = [
  { id: "1", name: "Beginner", gridSize: 4, pairs: 8, difficulty: "Easy", pointsReward: 25, timeLimit: 60, completionRate: 85.2, averageTime: 42 },
  { id: "2", name: "Intermediate", gridSize: 6, pairs: 18, difficulty: "Medium", pointsReward: 50, timeLimit: 90, completionRate: 67.8, averageTime: 68 },
  { id: "3", name: "Expert", gridSize: 8, pairs: 32, difficulty: "Hard", pointsReward: 100, timeLimit: 120, completionRate: 34.5, averageTime: 105 }
]

const mockStats: MemoryStats = {
  totalGames: 8432,
  todayGames: 234,
  uniquePlayers: 1247,
  avgCompletionTime: 71.8,
  bestTime: "28.4s",
  completionRate: 62.5
}

export default function MemoryMatchPage() {
  const [levels, setLevels] = useState<CardLevel[]>(mockLevels)
  const [stats] = useState<MemoryStats>(mockStats)
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false)
  const [newLevel, setNewLevel] = useState({
    name: "",
    gridSize: "",
    pointsReward: "",
    timeLimit: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard"
  })
  const [isGameActive, setIsGameActive] = useState(true)
  const [dailyAttempts, setDailyAttempts] = useState(5)

  const handleAddLevel = () => {
    const level: CardLevel = {
      id: Date.now().toString(),
      name: newLevel.name,
      gridSize: parseInt(newLevel.gridSize) || 4,
      pairs: Math.floor((parseInt(newLevel.gridSize) || 4) * (parseInt(newLevel.gridSize) || 4) / 2),
      difficulty: newLevel.difficulty,
      pointsReward: parseInt(newLevel.pointsReward) || 25,
      timeLimit: parseInt(newLevel.timeLimit) || 60,
      completionRate: 0,
      averageTime: 0
    }

    setLevels([...levels, level])
    setNewLevel({
      name: "",
      gridSize: "",
      pointsReward: "",
      timeLimit: "",
      difficulty: "Easy"
    })
    setIsLevelDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Memory Match</h2>
          <p className="text-muted-foreground">Manage your memory card matching game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Level
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Level</DialogTitle>
                <DialogDescription>
                  Add a new difficulty level to the memory match game.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="level-name">Level Name</Label>
                  <Input
                    id="level-name"
                    placeholder="e.g., Advanced"
                    value={newLevel.name}
                    onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grid-size">Grid Size</Label>
                    <Select value={newLevel.gridSize} onValueChange={(value) => setNewLevel(prev => ({ ...prev, gridSize: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grid size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4x4 (Beginner)</SelectItem>
                        <SelectItem value="6">6x6 (Intermediate)</SelectItem>
                        <SelectItem value="8">8x8 (Expert)</SelectItem>
                        <SelectItem value="10">10x10 (Master)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={newLevel.difficulty} onValueChange={(value: "Easy" | "Medium" | "Hard") => setNewLevel(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points-reward">Points Reward</Label>
                    <Input
                      id="points-reward"
                      type="number"
                      placeholder="50"
                      value={newLevel.pointsReward}
                      onChange={(e) => setNewLevel(prev => ({ ...prev, pointsReward: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      placeholder="90"
                      value={newLevel.timeLimit}
                      onChange={(e) => setNewLevel(prev => ({ ...prev, timeLimit: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLevelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLevel} disabled={!newLevel.name}>
                  Add Level
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Games</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayGames}</div>
            <p className="text-xs text-muted-foreground">
              +9.7% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Players</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniquePlayers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +22.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionTime}s</div>
            <p className="text-xs text-muted-foreground">
              -3.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Time</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestTime}</div>
            <p className="text-xs text-muted-foreground">
              Record time today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +4.8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSettings className="h-5 w-5" />
              Game Settings
            </CardTitle>
            <CardDescription>
              Configure the memory match game behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Game Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the game for players
                </p>
              </div>
              <Switch
                checked={isGameActive}
                onCheckedChange={setIsGameActive}
              />
            </div>
            <div>
              <Label htmlFor="daily-attempts">Daily Attempts Limit</Label>
              <Input
                id="daily-attempts"
                type="number"
                value={dailyAttempts}
                onChange={(e) => setDailyAttempts(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum game attempts per player per day
              </p>
            </div>
            <div>
              <Label htmlFor="card-flip-time">Card Flip Animation (ms)</Label>
              <Input
                id="card-flip-time"
                type="number"
                defaultValue="600"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Duration of card flip animation
              </p>
            </div>
            <Button className="w-full">
              <IconSettings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Level Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPuzzle className="h-5 w-5" />
              Level Configuration
            </CardTitle>
            <CardDescription>
              Manage difficulty levels and scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {levels.map((level) => (
                  <div key={level.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium">{level.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {level.gridSize}x{level.gridSize} grid • {level.pairs} pairs
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={level.difficulty === "Easy" ? "default" : level.difficulty === "Medium" ? "secondary" : "destructive"}>
                          {level.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {level.completionRate}% success rate
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-sm">{level.pointsReward} pts</div>
                        <div className="text-xs text-muted-foreground">{level.timeLimit}s</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <IconEdit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Track how your memory match game is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockLevels[0].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Beginner Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockLevels[1].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Intermediate Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockLevels[2].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Expert Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.avgCompletionTime}s</div>
              <div className="text-sm text-muted-foreground">Average Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Game Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPlayerPlay className="h-5 w-5" />
            Player Game Data
          </CardTitle>
          <CardDescription>
            View detailed information about users who played Memory Match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGameDataTable
            gameType="Memory Match"
            scoreLabel="Moves"
            data={[
              {
                id: "1",
                playerName: "Sarah Johnson",
                playerPhone: "555-0123",
                playerEmail: "sarah.j@email.com",
                score: 45,
                level: "Intermediate",
                timeSpent: 68,
                completionRate: 100,
                timestamp: "2024-11-25T10:30:00Z",
                difficulty: "Medium"
              },
              {
                id: "2",
                playerName: "Mike Chen",
                playerPhone: "555-0124",
                score: 38,
                level: "Beginner",
                timeSpent: 42,
                completionRate: 95,
                timestamp: "2024-11-25T11:15:00Z",
                difficulty: "Easy"
              },
              {
                id: "3",
                playerName: "Emma Davis",
                playerPhone: "555-0125",
                playerEmail: "emma.d@email.com",
                score: 62,
                level: "Expert",
                timeSpent: 118,
                completionRate: 88,
                timestamp: "2024-11-25T12:00:00Z",
                difficulty: "Hard"
              },
              {
                id: "4",
                playerName: "Alex Wilson",
                playerPhone: "555-0126",
                score: 51,
                level: "Intermediate",
                timeSpent: 72,
                completionRate: 92,
                timestamp: "2024-11-25T13:45:00Z",
                difficulty: "Medium"
              },
              {
                id: "5",
                playerName: "Lisa Brown",
                playerPhone: "555-0127",
                playerEmail: "lisa.b@email.com",
                score: 29,
                level: "Beginner",
                timeSpent: 35,
                completionRate: 100,
                timestamp: "2024-11-25T14:20:00Z",
                difficulty: "Easy"
              }
            ]}
          />
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5" />
            Memory Match Leaderboard
          </CardTitle>
          <CardDescription>
            Top players ranked by performance and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameLeaderboard
            gameType="Memory Match"
            scoreLabel="Moves (Lower is Better)"
            showLevel={true}
            showTimeSpent={true}
            showDifficulty={true}
            data={[
              {
                id: "1",
                rank: 1,
                playerName: "Sarah Johnson",
                playerPhone: "555-0123",
                score: 45,
                level: "Intermediate",
                timeSpent: 68,
                achievement: "Perfect Memory",
                timestamp: "2024-11-25T10:30:00Z",
                difficulty: "Medium",
                previousRank: 2
              },
              {
                id: "2",
                rank: 2,
                playerName: "Emma Davis",
                playerPhone: "555-0125",
                score: 52,
                level: "Expert",
                timeSpent: 89,
                achievement: "Quick Solver",
                timestamp: "2024-11-25T12:00:00Z",
                difficulty: "Hard",
                previousRank: 1
              },
              {
                id: "3",
                rank: 3,
                playerName: "Mike Chen",
                playerPhone: "555-0124",
                score: 38,
                level: "Beginner",
                timeSpent: 42,
                achievement: "Beginner Master",
                timestamp: "2024-11-25T11:15:00Z",
                difficulty: "Easy",
                previousRank: 5
              },
              {
                id: "4",
                rank: 4,
                playerName: "Alex Wilson",
                playerPhone: "555-0126",
                score: 51,
                level: "Intermediate",
                timeSpent: 72,
                achievement: "Consistent Player",
                timestamp: "2024-11-25T13:45:00Z",
                difficulty: "Medium",
                previousRank: 3
              },
              {
                id: "5",
                rank: 5,
                playerName: "Lisa Brown",
                playerPhone: "555-0127",
                score: 29,
                level: "Beginner",
                timeSpent: 35,
                achievement: "Speed Demon",
                timestamp: "2024-11-25T14:20:00Z",
                difficulty: "Easy",
                previousRank: 8
              },
              {
                id: "6",
                rank: 6,
                playerName: "John Smith",
                playerPhone: "555-0128",
                score: 75,
                level: "Expert",
                timeSpent: 105,
                achievement: "Persistent",
                timestamp: "2024-11-25T15:00:00Z",
                difficulty: "Hard"
              },
              {
                id: "7",
                rank: 7,
                playerName: "Anna Lee",
                playerPhone: "555-0129",
                score: 41,
                level: "Intermediate",
                timeSpent: 58,
                achievement: "Rising Star",
                timestamp: "2024-11-25T16:30:00Z",
                difficulty: "Medium"
              },
              {
                id: "8",
                rank: 8,
                playerName: "David Kim",
                playerPhone: "555-0130",
                score: 32,
                level: "Beginner",
                timeSpent: 28,
                achievement: "Quick Learner",
                timestamp: "2024-11-25T17:45:00Z",
                difficulty: "Easy"
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}