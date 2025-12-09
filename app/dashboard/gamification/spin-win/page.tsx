"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  IconBulb,
  IconChartBar,
  IconMedal,
  IconAward,
  IconChevronRight
} from "@tabler/icons-react"

interface PrizeSegment {
  id: string
  label: string
  value: number
  probability: number
  color: string
  quantity: number
  claimed: number
}

interface SpinStats {
  totalSpins: number
  todaySpins: number
  uniquePlayers: number
  avgPoints: number
  topPrize: string
  engagementRate: number
}

const mockPrizes: PrizeSegment[] = [
  { id: "1", label: "10 Points", value: 10, probability: 35, color: "#10B981", quantity: 1000, claimed: 342 },
  { id: "2", label: "25 Points", value: 25, probability: 25, color: "#3B82F6", quantity: 500, claimed: 189 },
  { id: "3", label: "50 Points", value: 50, probability: 15, color: "#8B5CF6", quantity: 200, claimed: 87 },
  { id: "4", label: "100 Points", value: 100, probability: 10, color: "#F59E0B", quantity: 100, claimed: 45 },
  { id: "5", label: "Try Again", value: 0, probability: 10, color: "#EF4444", quantity: 999999, claimed: 123 },
  { id: "6", label: "Mystery Box", value: 150, probability: 5, color: "#EC4899", quantity: 50, claimed: 12 }
]

const mockStats: SpinStats = {
  totalSpins: 12847,
  todaySpins: 342,
  uniquePlayers: 2156,
  avgPoints: 28.5,
  topPrize: "100 Points",
  engagementRate: 78.9
}

export default function SpinWinPage() {
  const [prizes, setPrizes] = useState<PrizeSegment[]>(mockPrizes)
  const [stats] = useState<SpinStats>(mockStats)
  const [isPrizeDialogOpen, setIsPrizeDialogOpen] = useState(false)
  const [newPrize, setNewPrize] = useState({
    label: "",
    value: "",
    probability: "",
    color: "#10B981",
    quantity: ""
  })
  const [dailyLimit, setDailyLimit] = useState(3)
  const [isGameActive, setIsGameActive] = useState(true)

  const handleAddPrize = () => {
    const prize: PrizeSegment = {
      id: Date.now().toString(),
      label: newPrize.label,
      value: parseInt(newPrize.value) || 0,
      probability: parseInt(newPrize.probability) || 0,
      color: newPrize.color,
      quantity: parseInt(newPrize.quantity) || 0,
      claimed: 0
    }

    setPrizes([...prizes, prize])
    setNewPrize({
      label: "",
      value: "",
      probability: "",
      color: "#10B981",
      quantity: ""
    })
    setIsPrizeDialogOpen(false)
  }

  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spin & Win</h2>
          <p className="text-muted-foreground">Manage your spinning wheel game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isPrizeDialogOpen} onOpenChange={setIsPrizeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Prize
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Prize</DialogTitle>
                <DialogDescription>
                  Add a new prize segment to the spinning wheel.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prize-label">Prize Label</Label>
                  <Input
                    id="prize-label"
                    placeholder="e.g., 50 Points"
                    value={newPrize.label}
                    onChange={(e) => setNewPrize(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prize-value">Points Value</Label>
                    <Input
                      id="prize-value"
                      type="number"
                      placeholder="50"
                      value={newPrize.value}
                      onChange={(e) => setNewPrize(prev => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prize-probability">Probability (%)</Label>
                    <Input
                      id="prize-probability"
                      type="number"
                      placeholder="15"
                      value={newPrize.probability}
                      onChange={(e) => setNewPrize(prev => ({ ...prev, probability: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prize-quantity">Quantity Available</Label>
                    <Input
                      id="prize-quantity"
                      type="number"
                      placeholder="100"
                      value={newPrize.quantity}
                      onChange={(e) => setNewPrize(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prize-color">Color</Label>
                    <Input
                      id="prize-color"
                      type="color"
                      value={newPrize.color}
                      onChange={(e) => setNewPrize(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>
                {totalProbability > 100 && (
                  <p className="text-sm text-red-600">
                    Total probability exceeds 100%. Current total: {totalProbability}%
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPrizeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPrize} disabled={!newPrize.label || totalProbability >= 100}>
                  Add Prize
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/dashboard/gamification/spin-win/analytics">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View Reports</div>
              <p className="text-xs text-muted-foreground">
                Detailed performance insights
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/gamification/spin-win/prizes">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prizes</CardTitle>
              <IconGift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prizes.length}</div>
              <p className="text-xs text-muted-foreground">
                Configure rewards
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/gamification/spin-win/achievements">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <IconMedal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Player milestones
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/gamification/spin-win/leaderboard">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
              <IconAward className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Top 100</div>
              <p className="text-xs text-muted-foreground">
                Player rankings
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/gamification/spin-win/settings">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <IconSettings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Configure</div>
              <p className="text-xs text-muted-foreground">
                Game behavior
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Spins</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySpins}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from yesterday
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
              +18.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPoints}</div>
            <p className="text-xs text-muted-foreground">
              +5.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Prize</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topPrize}</div>
            <p className="text-xs text-muted-foreground">
              Most popular reward
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
              +2.1% from last month
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
              Configure the spinning wheel game behavior
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
              <Label htmlFor="daily-limit">Daily Spin Limit</Label>
              <Input
                id="daily-limit"
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum spins per player per day
              </p>
            </div>
            <div>
              <Label htmlFor="spin-duration">Spin Duration (seconds)</Label>
              <Input
                id="spin-duration"
                type="number"
                defaultValue="3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long the wheel spins before stopping
              </p>
            </div>
            <Button className="w-full">
              <IconSettings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Prize Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconGift className="h-5 w-5" />
              Prize Configuration
            </CardTitle>
            <CardDescription>
              Manage prize segments and probabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Probability</span>
                <Badge variant={totalProbability === 100 ? "default" : "destructive"}>
                  {totalProbability}%
                </Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {prizes.map((prize) => (
                  <div key={prize.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: prize.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-sm">{prize.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {prize.claimed}/{prize.quantity} claimed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{prize.probability}%</Badge>
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
            Track how your spinning wheel game is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockPrizes[0].claimed}</div>
              <div className="text-sm text-muted-foreground">10 Points Won</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockPrizes[1].claimed}</div>
              <div className="text-sm text-muted-foreground">25 Points Won</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockPrizes[2].claimed}</div>
              <div className="text-sm text-muted-foreground">50 Points Won</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{mockPrizes[3].claimed}</div>
              <div className="text-sm text-muted-foreground">100 Points Won</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}