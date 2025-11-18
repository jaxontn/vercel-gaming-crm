"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconTrophy,
  IconTarget,
  IconUsers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClock,
  IconFlag,
  IconMedal,
  IconBolt,
  IconCalendar,
  IconChartBar,
  IconGift,
  IconStar,
} from "@tabler/icons-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "special"
  requirement: string
  targetValue: number
  rewardPoints: number
  rewardType: "points" | "badge" | "voucher" | "product"
  isActive: boolean
  startDate: string
  endDate: string
  participants: number
  completions: number
  difficulty: "easy" | "medium" | "hard"
}

const mockChallenges: Challenge[] = [
  {
    id: "challenge-001",
    title: "Daily Spin Master",
    description: "Play the Spin & Win game 5 times in a single day",
    type: "daily",
    requirement: "Spin & Win plays",
    targetValue: 5,
    rewardPoints: 50,
    rewardType: "points",
    isActive: true,
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    participants: 234,
    completions: 156,
    difficulty: "easy",
  },
  {
    id: "challenge-002",
    title: "Weekend Warrior",
    description: "Visit the store 3 times this weekend",
    type: "weekly",
    requirement: "Store visits",
    targetValue: 3,
    rewardPoints: 100,
    rewardType: "points",
    isActive: true,
    startDate: "2025-11-08",
    endDate: "2025-11-10",
    participants: 189,
    completions: 67,
    difficulty: "medium",
  },
  {
    id: "challenge-003",
    title: "Social Butterfly",
    description: "Share your achievements on social media 10 times",
    type: "monthly",
    requirement: "Social shares",
    targetValue: 10,
    rewardPoints: 200,
    rewardType: "voucher",
    isActive: true,
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    participants: 145,
    completions: 23,
    difficulty: "medium",
  },
  {
    id: "challenge-004",
    title: "Birthday Champion",
    description: "Complete any challenge during your birthday week",
    type: "special",
    requirement: "Challenge completions",
    targetValue: 1,
    rewardPoints: 500,
    rewardType: "badge",
    isActive: true,
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    participants: 89,
    completions: 34,
    difficulty: "easy",
  },
  {
    id: "challenge-005",
    title: "Super Spender",
    description: "Spend $100 or more in a single visit",
    type: "weekly",
    requirement: "Purchase amount",
    targetValue: 100,
    rewardPoints: 300,
    rewardType: "points",
    isActive: true,
    startDate: "2025-11-01",
    endDate: "2025-11-07",
    participants: 67,
    completions: 12,
    difficulty: "hard",
  },
]

const typeLabels = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  special: "Special",
}

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const typeIcons = {
  daily: <IconClock className="h-4 w-4" />,
  weekly: <IconCalendar className="h-4 w-4" />,
  monthly: <IconChartBar className="h-4 w-4" />,
  special: <IconStar className="h-4 w-4" />,
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")

  const filteredChallenges = challenges.filter(challenge => {
    const matchesType = filterType === "all" || challenge.type === filterType
    const matchesDifficulty = filterDifficulty === "all" || challenge.difficulty === filterDifficulty
    return matchesType && matchesDifficulty
  })

  const totalParticipants = challenges.reduce((sum, challenge) => sum + challenge.participants, 0)
  const totalCompletions = challenges.reduce((sum, challenge) => sum + challenge.completions, 0)
  const averageCompletionRate = Math.round((totalCompletions / totalParticipants) * 100)

  const getCompletionProgress = (challenge: Challenge) => {
    if (challenge.participants === 0) return 0
    return Math.round((challenge.completions / challenge.participants) * 100)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Challenges</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
                <DialogDescription>
                  Design an engaging challenge for your customers to complete.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challenge-title">Challenge Title</Label>
                  <Input id="challenge-title" placeholder="e.g., Daily Spin Master" />
                </div>
                <div>
                  <Label htmlFor="challenge-description">Description</Label>
                  <Input id="challenge-description" placeholder="e.g., Play the Spin & Win game 5 times" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="challenge-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="challenge-difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(difficultyLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-value">Target Value</Label>
                    <Input id="target-value" type="number" placeholder="e.g., 5" />
                  </div>
                  <div>
                    <Label htmlFor="reward-points">Reward Points</Label>
                    <Input id="reward-points" type="number" placeholder="e.g., 50" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Create Challenge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <IconFlag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challenges.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {challenges.length} total challenges
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {averageCompletionRate}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
            <IconBolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challenges.reduce((sum, c) => sum + (c.completions * c.rewardPoints), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From challenge rewards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {Object.entries(difficultyLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Challenges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
          <CardDescription>
            Manage customer challenges and track their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challenge.title}</div>
                      <div className="text-sm text-muted-foreground">{challenge.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">
                        {typeIcons[challenge.type]}
                      </div>
                      <Badge variant="outline">
                        {typeLabels[challenge.type]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColors[challenge.difficulty]}>
                      {difficultyLabels[challenge.difficulty]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challenge.targetValue} {challenge.requirement}</div>
                      <div className="text-sm text-muted-foreground">
                        {challenge.startDate} - {challenge.endDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {challenge.rewardType === "points" && <IconBolt className="h-3 w-3 text-yellow-500" />}
                      {challenge.rewardType === "badge" && <IconMedal className="h-3 w-3 text-purple-500" />}
                      {challenge.rewardType === "voucher" && <IconGift className="h-3 w-3 text-blue-500" />}
                      {challenge.rewardType === "product" && <IconTrophy className="h-3 w-3 text-green-500" />}
                      <span className="font-medium">{challenge.rewardPoints}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{challenge.completions}/{challenge.participants}</span>
                        <span>{getCompletionProgress(challenge)}%</span>
                      </div>
                      <Progress value={getCompletionProgress(challenge)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={challenge.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}