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
  IconBolt,
  IconPlayerPlay
} from "@tabler/icons-react"
import { UserGameDataTable } from "@/components/user-game-data-table"
import { GameLeaderboard } from "@/components/game-leaderboard"

interface ChallengeLevel {
  id: string
  name: string
  timeLimit: number
  targetTaps: number
  pointsReward: number
  difficulty: "Easy" | "Medium" | "Hard"
  completionRate: number
  bestTime: number
}

interface QuickTapStats {
  totalGames: number
  todayGames: number
  uniquePlayers: number
  avgTapsPerSecond: number
  recordScore: string
  engagementRate: number
}

const mockLevels: ChallengeLevel[] = [
  { id: "1", name: "Lightning Fast", timeLimit: 10, targetTaps: 50, pointsReward: 50, difficulty: "Easy", completionRate: 78.5, bestTime: 8.2 },
  { id: "2", name: "Speed Demon", timeLimit: 15, targetTaps: 100, pointsReward: 75, difficulty: "Medium", completionRate: 62.3, bestTime: 12.7 },
  { id: "3", name: "Tap Master", timeLimit: 20, targetTaps: 180, pointsReward: 125, difficulty: "Hard", completionRate: 31.8, bestTime: 17.3 }
]

const mockStats: QuickTapStats = {
  totalGames: 2847,
  todayGames: 156,
  uniquePlayers: 892,
  avgTapsPerSecond: 8.7,
  recordScore: "203 taps",
  engagementRate: 82.1
}

export default function QuickTapPage() {
  const [levels, setLevels] = useState<ChallengeLevel[]>(mockLevels)
  const [stats] = useState<QuickTapStats>(mockStats)
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false)
  const [newLevel, setNewLevel] = useState({
    name: "",
    timeLimit: "",
    targetTaps: "",
    pointsReward: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard"
  })
  const [isGameActive, setIsGameActive] = useState(true)
  const [dailyAttempts, setDailyAttempts] = useState(7)

  const handleAddLevel = () => {
    const level: ChallengeLevel = {
      id: Date.now().toString(),
      name: newLevel.name,
      timeLimit: parseInt(newLevel.timeLimit) || 10,
      targetTaps: parseInt(newLevel.targetTaps) || 50,
      pointsReward: parseInt(newLevel.pointsReward) || 50,
      difficulty: newLevel.difficulty,
      completionRate: 0,
      bestTime: 0
    }

    setLevels([...levels, level])
    setNewLevel({
      name: "",
      timeLimit: "",
      targetTaps: "",
      pointsReward: "",
      difficulty: "Easy"
    })
    setIsLevelDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quick Tap Challenge</h2>
          <p className="text-muted-foreground">Manage your speed tapping game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Challenge</DialogTitle>
                <DialogDescription>
                  Add a new quick tap challenge to the game.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenge-name">Challenge Name</Label>
                  <Input
                    id="challenge-name"
                    placeholder="e.g., Turbo Tapper"
                    value={newLevel.name}
                    onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      placeholder="15"
                      value={newLevel.timeLimit}
                      onChange={(e) => setNewLevel(prev => ({ ...prev, timeLimit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-taps">Target Taps</Label>
                    <Input
                      id="target-taps"
                      type="number"
                      placeholder="100"
                      value={newLevel.targetTaps}
                      onChange={(e) => setNewLevel(prev => ({ ...prev, targetTaps: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points-reward">Points Reward</Label>
                    <Input
                      id="points-reward"
                      type="number"
                      placeholder="75"
                      value={newLevel.pointsReward}
                      onChange={(e) => setNewLevel(prev => ({ ...prev, pointsReward: e.target.value }))}
                    />
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLevelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLevel} disabled={!newLevel.name}>
                  Add Challenge
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
              +22.7% from last month
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
              +15.3% from yesterday
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
              +31.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
            <IconBolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTapsPerSecond}</div>
            <p className="text-xs text-muted-foreground">
              taps/second
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Record Score</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recordScore}</div>
            <p className="text-xs text-muted-foreground">
              All-time best
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              Very high engagement
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
              Configure the quick tap challenge behavior
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
                Maximum attempts per player per day
              </p>
            </div>
            <div>
              <Label htmlFor="tap-window">Tap Recognition Window (ms)</Label>
              <Input
                id="tap-window"
                type="number"
                defaultValue="100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum time between recognized taps
              </p>
            </div>
            <Button className="w-full">
              <IconSettings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Challenge Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBolt className="h-5 w-5" />
              Challenge Configuration
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
                        {level.targetTaps} taps in {level.timeLimit}s
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={level.difficulty === "Easy" ? "default" : level.difficulty === "Medium" ? "secondary" : "destructive"}>
                          {level.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {level.completionRate}% completion
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-sm">{level.pointsReward} pts</div>
                        <div className="text-xs text-muted-foreground">Best: {level.bestTime}s</div>
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
            Track how your quick tap challenge is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockLevels[0].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Easy Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockLevels[1].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Medium Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockLevels[2].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Hard Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.avgTapsPerSecond}</div>
              <div className="text-sm text-muted-foreground">Avg Taps/Second</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Game Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPlayerPlay className="h-5 w-5" />
            User Game Data
          </CardTitle>
          <CardDescription>
            Track individual player performance and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGameDataTable
            gameType="Quick Tap Challenge"
            scoreLabel="Taps per Second"
            additionalColumns={[
              {
                key: "maxTaps",
                label: "Max Taps",
                render: (item) => <span className="text-sm">{(item as any).maxTaps || 0}</span>
              },
              {
                key: "tapRate",
                label: "Tap Rate",
                render: (item) => <span className="text-sm">{(item as any).tapRate || "N/A"}</span>
              }
            ]}
            data={[
              {
                id: "1",
                playerName: "Speed Demon",
                playerPhone: "555-0101",
                playerEmail: "speed.d@email.com",
                score: 12.4,
                level: "Advanced",
                timeSpent: 135,
                completionRate: 95,
                timestamp: "2024-11-25T09:30:00Z",
                difficulty: "Hard",
                maxTaps: 203,
                tapRate: "Excellent"
              },
              {
                id: "2",
                playerName: "Tap Master",
                playerPhone: "555-0102",
                score: 11.2,
                level: "Advanced",
                timeSpent: 105,
                completionRate: 92,
                timestamp: "2024-11-25T10:15:00Z",
                difficulty: "Hard",
                maxTaps: 187,
                tapRate: "Excellent"
              },
              {
                id: "3",
                playerName: "Lightning Fingers",
                playerPhone: "555-0103",
                playerEmail: "lightning.f@email.com",
                score: 10.8,
                level: "Intermediate",
                timeSpent: 120,
                completionRate: 88,
                timestamp: "2024-11-25T11:00:00Z",
                difficulty: "Medium",
                maxTaps: 165,
                tapRate: "Great"
              },
              {
                id: "4",
                playerName: "Quick Reflex",
                playerPhone: "555-0104",
                score: 9.5,
                level: "Intermediate",
                timeSpent: 90,
                completionRate: 85,
                timestamp: "2024-11-25T12:30:00Z",
                difficulty: "Medium",
                maxTaps: 142,
                tapRate: "Great"
              },
              {
                id: "5",
                playerName: "Tap Ninja",
                playerPhone: "555-0105",
                playerEmail: "tap.ninja@email.com",
                score: 8.9,
                level: "Intermediate",
                timeSpent: 75,
                completionRate: 82,
                timestamp: "2024-11-25T13:45:00Z",
                difficulty: "Medium",
                maxTaps: 128,
                tapRate: "Good"
              }
            ] as any[]}
          />
        </CardContent>
      </Card>

      {/* Game Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5" />
            Game Leaderboard
          </CardTitle>
          <CardDescription>
            Top players competing for the best tap rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameLeaderboard
            gameType="Quick Tap Challenge"
            scoreLabel="Best Tap Rate"
            showLevel={true}
            showDifficulty={true}
            data={[
              {
                id: "1",
                rank: 1,
                playerName: "Speed Demon",
                playerPhone: "555-0101",
                score: 12.4,
                level: "Advanced",
                difficulty: "Hard",
                timeSpent: 135,
                achievement: "Lightning Fast",
                timestamp: "2024-11-25T09:30:00Z",
                previousRank: 2
              },
              {
                id: "2",
                rank: 2,
                playerName: "Tap Master",
                playerPhone: "555-0102",
                score: 11.2,
                level: "Advanced",
                difficulty: "Hard",
                timeSpent: 105,
                achievement: "Consistent Speed",
                timestamp: "2024-11-25T10:15:00Z",
                previousRank: 3
              },
              {
                id: "3",
                rank: 3,
                playerName: "Lightning Fingers",
                playerPhone: "555-0103",
                score: 10.8,
                level: "Intermediate",
                difficulty: "Medium",
                timeSpent: 120,
                achievement: "Quick Reflexes",
                timestamp: "2024-11-25T11:00:00Z",
                previousRank: 1
              },
              {
                id: "4",
                rank: 4,
                playerName: "Quick Reflex",
                playerPhone: "555-0104",
                score: 9.5,
                level: "Intermediate",
                difficulty: "Medium",
                timeSpent: 90,
                achievement: "Rising Star",
                timestamp: "2024-11-25T12:30:00Z"
              },
              {
                id: "5",
                rank: 5,
                playerName: "Tap Ninja",
                playerPhone: "555-0105",
                score: 8.9,
                level: "Intermediate",
                difficulty: "Medium",
                timeSpent: 75,
                achievement: "Speed Demon",
                timestamp: "2024-11-25T13:45:00Z",
                previousRank: 7
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}