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
  IconDice3,
  IconPlayerPlay
} from "@tabler/icons-react"
import { UserGameDataTable } from "@/components/user-game-data-table"
import { GameLeaderboard } from "@/components/game-leaderboard"

interface DiceOutcome {
  id: string
  result: string
  points: number
  probability: number
  payoutMultiplier: number
  occurrences: number
}

interface DiceStats {
  totalRolls: number
  todayRolls: number
  uniquePlayers: number
  avgPayout: number
  biggestWin: string
  houseEdge: number
}

const mockOutcomes: DiceOutcome[] = [
  { id: "1", result: "Double 6s", points: 100, probability: 2.78, payoutMultiplier: 36, occurrences: 89 },
  { id: "2", result: "7", points: 25, probability: 16.67, payoutMultiplier: 6, occurrences: 578 },
  { id: "3", result: "11", points: 35, probability: 8.33, payoutMultiplier: 12, occurrences: 287 },
  { id: "4", result: "Doubles", points: 50, probability: 13.89, payoutMultiplier: 8, occurrences: 445 },
  { id: "5", result: "Odd Sum", points: 10, probability: 50.00, payoutMultiplier: 2, occurrences: 1652 },
  { id: "6", result: "Even Sum", points: 10, probability: 50.00, payoutMultiplier: 2, occurrences: 1634 }
]

const mockStats: DiceStats = {
  totalRolls: 3421,
  todayRolls: 187,
  uniquePlayers: 892,
  avgPayout: 18.5,
  biggestWin: "500 pts",
  houseEdge: 8.2
}

export default function LuckyDicePage() {
  const [outcomes, setOutcomes] = useState<DiceOutcome[]>(mockOutcomes)
  const [stats] = useState<DiceStats>(mockStats)
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false)
  const [newOutcome, setNewOutcome] = useState({
    result: "",
    points: "",
    probability: "",
    payoutMultiplier: ""
  })
  const [isGameActive, setIsGameActive] = useState(true)
  const [dailyRolls, setDailyRolls] = useState(10)
  const [minBet, setMinBet] = useState(5)

  const handleAddOutcome = () => {
    const outcome: DiceOutcome = {
      id: Date.now().toString(),
      result: newOutcome.result,
      points: parseInt(newOutcome.points) || 0,
      probability: parseFloat(newOutcome.probability) || 0,
      payoutMultiplier: parseFloat(newOutcome.payoutMultiplier) || 0,
      occurrences: 0
    }

    setOutcomes([...outcomes, outcome])
    setNewOutcome({
      result: "",
      points: "",
      probability: "",
      payoutMultiplier: ""
    })
    setIsOutcomeDialogOpen(false)
  }

  const totalProbability = outcomes.reduce((sum, outcome) => sum + outcome.probability, 0)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lucky Dice</h2>
          <p className="text-muted-foreground">Manage your dice rolling game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isOutcomeDialogOpen} onOpenChange={setIsOutcomeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Outcome
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Outcome</DialogTitle>
                <DialogDescription>
                  Add a new dice outcome to the lucky dice game.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="outcome-result">Outcome Description</Label>
                  <Input
                    id="outcome-result"
                    placeholder="e.g., Roll a 7"
                    value={newOutcome.result}
                    onChange={(e) => setNewOutcome(prev => ({ ...prev, result: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="outcome-points">Points Reward</Label>
                    <Input
                      id="outcome-points"
                      type="number"
                      placeholder="25"
                      value={newOutcome.points}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, points: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outcome-probability">Probability (%)</Label>
                    <Input
                      id="outcome-probability"
                      type="number"
                      step="0.01"
                      placeholder="16.67"
                      value={newOutcome.probability}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, probability: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outcome-payout">Payout Multiplier</Label>
                    <Input
                      id="outcome-payout"
                      type="number"
                      step="0.1"
                      placeholder="6"
                      value={newOutcome.payoutMultiplier}
                      onChange={(e) => setNewOutcome(prev => ({ ...prev, payoutMultiplier: e.target.value }))}
                    />
                  </div>
                </div>
                {totalProbability > 100 && (
                  <p className="text-sm text-red-600">
                    Total probability exceeds 100%. Current total: {totalProbability.toFixed(2)}%
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOutcomeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOutcome} disabled={!newOutcome.result || totalProbability >= 100}>
                  Add Outcome
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
            <CardTitle className="text-sm font-medium">Total Rolls</CardTitle>
            <IconDice3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRolls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Rolls</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayRolls}</div>
            <p className="text-xs text-muted-foreground">
              +12.7% from yesterday
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
              +25.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Payout</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPayout}</div>
            <p className="text-xs text-muted-foreground">
              points per roll
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biggest Win</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.biggestWin}</div>
            <p className="text-xs text-muted-foreground">
              Record payout
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">House Edge</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.houseEdge}%</div>
            <p className="text-xs text-muted-foreground">
              Business margin
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
              Configure the lucky dice game behavior
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
              <Label htmlFor="daily-rolls">Daily Roll Limit</Label>
              <Input
                id="daily-rolls"
                type="number"
                value={dailyRolls}
                onChange={(e) => setDailyRolls(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum rolls per player per day
              </p>
            </div>
            <div>
              <Label htmlFor="min-bet">Minimum Bet (points)</Label>
              <Input
                id="min-bet"
                type="number"
                value={minBet}
                onChange={(e) => setMinBet(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum points required to play
              </p>
            </div>
            <Button className="w-full">
              <IconSettings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Outcome Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDice3 className="h-5 w-5" />
              Outcome Configuration
            </CardTitle>
            <CardDescription>
              Manage dice outcomes and probabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Probability</span>
                <Badge variant={totalProbability === 100 ? "default" : "destructive"}>
                  {totalProbability.toFixed(1)}%
                </Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {outcomes.map((outcome) => (
                  <div key={outcome.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{outcome.result}</div>
                      <div className="text-xs text-muted-foreground">
                        {outcome.occurrences} occurrences
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-sm">{outcome.points} pts</div>
                        <div className="text-xs text-muted-foreground">{outcome.payoutMultiplier}x</div>
                      </div>
                      <Badge variant="outline">{outcome.probability}%</Badge>
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
            Track how your lucky dice game is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockOutcomes[0].occurrences}</div>
              <div className="text-sm text-muted-foreground">Double 6s Rolled</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockOutcomes[1].occurrences}</div>
              <div className="text-sm text-muted-foreground">Lucky 7s</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockOutcomes[3].occurrences}</div>
              <div className="text-sm text-muted-foreground">Doubles Rolled</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.avgPayout}</div>
              <div className="text-sm text-muted-foreground">Avg Payout</div>
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
            View detailed information about users who played Lucky Dice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGameDataTable
            gameType="Lucky Dice"
            scoreLabel="Points Won"
            additionalColumns={[
              {
                key: "bet",
                label: "Bet",
                render: (item) => <span className="text-sm">{Math.floor(item.score / 5)} pts</span>
              },
              {
                key: "roll",
                label: "Roll Result",
                render: (item) => <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{item.level || "7"}</span>
              }
            ]}
            data={[
              {
                id: "1",
                playerName: "James Wilson",
                playerPhone: "555-0145",
                playerEmail: "james.w@email.com",
                score: 150,
                level: "Double 6s",
                timeSpent: 12,
                completionRate: 100,
                timestamp: "2024-11-25T10:30:00Z",
                difficulty: "Medium"
              },
              {
                id: "2",
                playerName: "Maria Garcia",
                playerPhone: "555-0146",
                score: 25,
                level: "7",
                timeSpent: 8,
                completionRate: 100,
                timestamp: "2024-11-25T11:15:00Z",
                difficulty: "Easy"
              },
              {
                id: "3",
                playerName: "Robert Chen",
                playerPhone: "555-0147",
                playerEmail: "robert.c@email.com",
                score: 0,
                level: "Try Again",
                timeSpent: 5,
                completionRate: 0,
                timestamp: "2024-11-25T12:00:00Z",
                difficulty: "Easy"
              },
              {
                id: "4",
                playerName: "Lisa Anderson",
                playerPhone: "555-0148",
                score: 75,
                level: "11",
                timeSpent: 10,
                completionRate: 100,
                timestamp: "2024-11-25T13:45:00Z",
                difficulty: "Medium"
              },
              {
                id: "5",
                playerName: "Tom Brown",
                playerPhone: "555-0149",
                playerEmail: "tom.b@email.com",
                score: 100,
                level: "Doubles",
                timeSpent: 15,
                completionRate: 100,
                timestamp: "2024-11-25T14:20:00Z",
                difficulty: "Medium"
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
            Lucky Dice Leaderboard
          </CardTitle>
          <CardDescription>
            Top players ranked by points won and lucky streaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameLeaderboard
            gameType="Lucky Dice"
            scoreLabel="Total Points Won"
            showDifficulty={true}
            data={[
              {
                id: "1",
                rank: 1,
                playerName: "James Wilson",
                playerPhone: "555-0145",
                score: 1250,
                timeSpent: 45,
                achievement: "Lucky Streak Master",
                timestamp: "2024-11-25T10:30:00Z",
                difficulty: "Hard",
                previousRank: 2
              },
              {
                id: "2",
                rank: 2,
                playerName: "Lisa Anderson",
                playerPhone: "555-0148",
                score: 1100,
                timeSpent: 38,
                achievement: "Double Sixes Legend",
                timestamp: "2024-11-25T13:45:00Z",
                difficulty: "Medium",
                previousRank: 3
              },
              {
                id: "3",
                rank: 3,
                playerName: "Tom Brown",
                playerPhone: "555-0149",
                score: 950,
                timeSpent: 52,
                achievement: "High Roller",
                timestamp: "2024-11-25T14:20:00Z",
                difficulty: "Medium",
                previousRank: 1
              },
              {
                id: "4",
                rank: 4,
                playerName: "Sarah Johnson",
                playerPhone: "555-0150",
                score: 875,
                timeSpent: 42,
                achievement: "Lucky Seven Expert",
                timestamp: "2024-11-25T15:30:00Z",
                difficulty: "Medium"
              },
              {
                id: "5",
                rank: 5,
                playerName: "Mike Davis",
                playerPhone: "555-0151",
                score: 725,
                timeSpent: 35,
                achievement: "Rising Star",
                timestamp: "2024-11-25T16:00:00Z",
                difficulty: "Easy",
                previousRank: 8
              },
              {
                id: "6",
                rank: 6,
                playerName: "Emma Wilson",
                playerPhone: "555-0152",
                score: 650,
                timeSpent: 48,
                achievement: "Consistent Winner",
                timestamp: "2024-11-25T16:45:00Z",
                difficulty: "Medium"
              },
              {
                id: "7",
                rank: 7,
                playerName: "Alex Kim",
                playerPhone: "555-0153",
                score: 580,
                timeSpent: 40,
                achievement: "Dice Master",
                timestamp: "2024-11-25T17:15:00Z",
                difficulty: "Easy"
              },
              {
                id: "8",
                rank: 8,
                playerName: "Chris Lee",
                playerPhone: "555-0154",
                score: 525,
                timeSpent: 55,
                achievement: "Lucky Newcomer",
                timestamp: "2024-11-25T18:00:00Z",
                difficulty: "Easy"
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}