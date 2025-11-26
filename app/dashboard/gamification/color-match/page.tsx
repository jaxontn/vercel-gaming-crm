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
  IconPalette,
  IconPlayerPlay
} from "@tabler/icons-react"
import { UserGameDataTable } from "@/components/user-game-data-table"
import { GameLeaderboard } from "@/components/game-leaderboard"

interface ColorChallenge {
  id: string
  name: string
  colorCount: number
  timeLimit: number
  pointsReward: number
  difficulty: "Easy" | "Medium" | "Hard"
  completionRate: number
  avgTime: number
  colorScheme: string[]
}

interface ColorMatchStats {
  totalGames: number
  todayGames: number
  uniquePlayers: number
  avgAccuracy: number
  bestScore: string
  engagementRate: number
}

const mockChallenges: ColorChallenge[] = [
  {
    id: "1",
    name: "Primary Colors",
    colorCount: 3,
    timeLimit: 30,
    pointsReward: 20,
    difficulty: "Easy",
    completionRate: 92.5,
    avgTime: 18.3,
    colorScheme: ["#FF0000", "#00FF00", "#0000FF"]
  },
  {
    id: "2",
    name: "Rainbow Match",
    colorCount: 6,
    timeLimit: 45,
    pointsReward: 35,
    difficulty: "Medium",
    completionRate: 78.2,
    avgTime: 32.7,
    colorScheme: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF", "#8B00FF"]
  },
  {
    id: "3",
    name: "Expert Palette",
    colorCount: 9,
    timeLimit: 60,
    pointsReward: 50,
    difficulty: "Hard",
    completionRate: 54.8,
    avgTime: 48.9,
    colorScheme: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB"]
  }
]

const mockStats: ColorMatchStats = {
  totalGames: 3568,
  todayGames: 194,
  uniquePlayers: 1245,
  avgAccuracy: 87.3,
  bestScore: "Perfect Match",
  engagementRate: 76.8
}

export default function ColorMatchPage() {
  const [challenges, setChallenges] = useState<ColorChallenge[]>(mockChallenges)
  const [stats] = useState<ColorMatchStats>(mockStats)
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false)
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    colorCount: "",
    timeLimit: "",
    pointsReward: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    colorScheme: "#FF0000,#00FF00,#0000FF"
  })
  const [isGameActive, setIsGameActive] = useState(true)
  const [dailyAttempts, setDailyAttempts] = useState(10)

  const handleAddChallenge = () => {
    const challenge: ColorChallenge = {
      id: Date.now().toString(),
      name: newChallenge.name,
      colorCount: parseInt(newChallenge.colorCount) || 3,
      timeLimit: parseInt(newChallenge.timeLimit) || 30,
      pointsReward: parseInt(newChallenge.pointsReward) || 20,
      difficulty: newChallenge.difficulty,
      completionRate: 0,
      avgTime: 0,
      colorScheme: newChallenge.colorScheme.split(',').map(color => color.trim())
    }

    setChallenges([...challenges, challenge])
    setNewChallenge({
      name: "",
      colorCount: "",
      timeLimit: "",
      pointsReward: "",
      difficulty: "Easy",
      colorScheme: "#FF0000,#00FF00,#0000FF"
    })
    setIsChallengeDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Color Match</h2>
          <p className="text-muted-foreground">Manage your color matching game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isChallengeDialogOpen} onOpenChange={setIsChallengeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Color Challenge</DialogTitle>
                <DialogDescription>
                  Add a new color matching challenge to the game.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenge-name">Challenge Name</Label>
                  <Input
                    id="challenge-name"
                    placeholder="e.g., Neon Colors"
                    value={newChallenge.name}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color-count">Number of Colors</Label>
                    <Input
                      id="color-count"
                      type="number"
                      placeholder="4"
                      value={newChallenge.colorCount}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, colorCount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={newChallenge.difficulty} onValueChange={(value: "Easy" | "Medium" | "Hard") => setNewChallenge(prev => ({ ...prev, difficulty: value }))}>
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
                    <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      placeholder="30"
                      value={newChallenge.timeLimit}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, timeLimit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="points-reward">Points Reward</Label>
                    <Input
                      id="points-reward"
                      type="number"
                      placeholder="25"
                      value={newChallenge.pointsReward}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, pointsReward: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="color-scheme">Color Scheme (comma-separated hex codes)</Label>
                  <Input
                    id="color-scheme"
                    placeholder="#FF0000,#00FF00,#0000FF"
                    value={newChallenge.colorScheme}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, colorScheme: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter hex color codes separated by commas
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChallengeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddChallenge} disabled={!newChallenge.name}>
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
              +24.1% from last month
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
              +16.8% from yesterday
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
              +33.7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <IconPalette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Very accurate matching
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestScore}</div>
            <p className="text-xs text-muted-foreground">
              Perfect achievement
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
              High player interest
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
              Configure the color matching game behavior
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
              <Label htmlFor="match-tolerance">Color Match Tolerance (%)</Label>
              <Input
                id="match-tolerance"
                type="number"
                defaultValue="95"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How close colors must match to count as correct
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
              <IconPalette className="h-5 w-5" />
              Challenge Configuration
            </CardTitle>
            <CardDescription>
              Manage color challenges and difficulty levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium">{challenge.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {challenge.colorCount} colors • {challenge.timeLimit}s
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={challenge.difficulty === "Easy" ? "default" : challenge.difficulty === "Medium" ? "secondary" : "destructive"}>
                          {challenge.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {challenge.completionRate}% completion
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {challenge.colorScheme.slice(0, 6).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        {challenge.colorScheme.length > 6 && (
                          <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-600">
                            +{challenge.colorScheme.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-sm">{challenge.pointsReward} pts</div>
                        <div className="text-xs text-muted-foreground">{challenge.avgTime}s avg</div>
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
            Track how your color match game is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockChallenges[0].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Easy Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockChallenges[1].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Medium Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockChallenges[2].completionRate}%</div>
              <div className="text-sm text-muted-foreground">Hard Challenge Success</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.avgAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
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
            gameType="color-match"
            scoreLabel="Accuracy"
            additionalColumns={[
              {
                key: "colorsMatched",
                label: "Colors Matched",
                render: (item: any) => item.colorsMatched || 0
              },
              {
                key: "timeBonus",
                label: "Time Bonus",
                render: (item: any) => item.timeBonus || "0s"
              }
            ]}
            data={[
              { id: "1", playerName: "Color Expert", playerPhone: "+1-555-0201", playerEmail: "expert@example.com", score: 98.5, level: "20", timeSpent: 22500, completionRate: 95.2, timestamp: "2025-11-24T15:00:00Z", difficulty: "Hard", colorsMatched: 1247, timeBonus: "450s" },
              { id: "2", playerName: "Palette Master", playerPhone: "+1-555-0202", playerEmail: "palette@example.com", score: 96.2, level: "17", timeSpent: 19800, completionRate: 92.8, timestamp: "2025-11-24T13:00:00Z", difficulty: "Hard", colorsMatched: 1098, timeBonus: "380s" },
              { id: "3", playerName: "Hue Champion", playerPhone: "+1-555-0203", score: 94.8, level: "15", timeSpent: 17100, completionRate: 90.1, timestamp: "2025-11-24T11:00:00Z", difficulty: "Hard", colorsMatched: 956, timeBonus: "320s" },
              { id: "4", playerName: "Rainbow Warrior", playerPhone: "+1-555-0204", playerEmail: "rainbow@example.com", score: 91.3, level: "13", timeSpent: 13800, completionRate: 87.5, timestamp: "2025-11-24T07:00:00Z", difficulty: "Medium", colorsMatched: 823, timeBonus: "285s" },
              { id: "5", playerName: "Color Ninja", playerPhone: "+1-555-0205", score: 89.7, level: "11", timeSpent: 12000, completionRate: 84.2, timestamp: "2025-11-24T03:00:00Z", difficulty: "Medium", colorsMatched: 687, timeBonus: "240s" }
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
            Top players competing for the best accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameLeaderboard
            gameType="color-match"
            scoreLabel="Best Accuracy"
            showLevel={true}
            showDifficulty={true}
            data={[
              { id: "1", rank: 1, playerName: "Color Expert", playerPhone: "+1-555-0201", score: 98.5, level: "20", timeSpent: 22500, achievement: "Perfect Match Master", timestamp: "2025-11-24T15:00:00Z", difficulty: "Hard" },
              { id: "2", rank: 2, playerName: "Palette Master", playerPhone: "+1-555-0202", score: 96.2, level: "17", timeSpent: 19800, achievement: "Color Perfectionist", timestamp: "2025-11-24T13:00:00Z", difficulty: "Hard" },
              { id: "3", rank: 3, playerName: "Hue Champion", playerPhone: "+1-555-0203", score: 94.8, level: "15", timeSpent: 17100, achievement: "Hue Specialist", timestamp: "2025-11-24T11:00:00Z", difficulty: "Hard" },
              { id: "4", rank: 4, playerName: "Rainbow Warrior", playerPhone: "+1-555-0204", score: 91.3, level: "13", timeSpent: 13800, achievement: "Rainbow Expert", timestamp: "2025-11-24T07:00:00Z", difficulty: "Medium" },
              { id: "5", rank: 5, playerName: "Color Ninja", playerPhone: "+1-555-0205", score: 89.7, level: "11", timeSpent: 12000, achievement: "Speed Matcher", timestamp: "2025-11-24T03:00:00Z", difficulty: "Medium" },
              { id: "6", rank: 6, playerName: "Sharp Eye", playerPhone: "+1-555-0206", score: 86.4, level: "9", timeSpent: 9600, achievement: "Precision Matcher", timestamp: "2025-11-23T16:00:00Z", difficulty: "Medium" },
              { id: "7", rank: 7, playerName: "Color Trainee", playerPhone: "+1-555-0207", score: 82.1, level: "7", timeSpent: 7800, achievement: "Color Apprentice", timestamp: "2025-11-22T14:00:00Z", difficulty: "Easy" },
              { id: "8", rank: 8, playerName: "Novice Matcher", playerPhone: "+1-555-0208", score: 78.9, level: "5", timeSpent: 5700, achievement: "Color Beginner", timestamp: "2025-11-21T15:00:00Z", difficulty: "Easy" }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}