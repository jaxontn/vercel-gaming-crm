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
  IconPlus,
  IconEdit,
  IconTrash,
  IconMedal,
  IconTrophy,
  IconTarget,
  IconStar,
  IconAward,
  IconUsers,
  IconFlame,
  IconBolt,
  IconShield
} from "@tabler/icons-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "milestone" | "streak" | "special" | "seasonal"
  requirement: {
    type: "spins" | "points" | "wins" | "days"
    value: number
    description: string
  }
  reward: {
    type: "points" | "badge" | "title" | "prize"
    value: number | string
    description: string
  }
  unlockedBy: number
  totalPlayers: number
  isActive: boolean
  createdAt: string
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Spin",
    description: "Complete your first spin",
    icon: "Flame",
    category: "milestone",
    requirement: {
      type: "spins",
      value: 1,
      description: "Complete 1 spin"
    },
    reward: {
      type: "points",
      value: 10,
      description: "10 bonus points"
    },
    unlockedBy: 1254,
    totalPlayers: 2156,
    isActive: true,
    createdAt: "2025-11-01"
  },
  {
    id: "2",
    title: "Lucky Beginner",
    description: "Win 100 points in a single spin",
    icon: "Star",
    category: "milestone",
    requirement: {
      type: "points",
      value: 100,
      description: "Win 100 points at once"
    },
    reward: {
      type: "points",
      value: 50,
      description: "50 bonus points"
    },
    unlockedBy: 342,
    totalPlayers: 2156,
    isActive: true,
    createdAt: "2025-11-01"
  },
  {
    id: "3",
    title: "Daily Spinner",
    description: "Play 7 days in a row",
    icon: "Bolt",
    category: "streak",
    requirement: {
      type: "days",
      value: 7,
      description: "Play 7 consecutive days"
    },
    reward: {
      type: "points",
      value: 100,
      description: "100 bonus points"
    },
    unlockedBy: 567,
    totalPlayers: 2156,
    isActive: true,
    createdAt: "2025-11-01"
  },
  {
    id: "4",
    title: "Spin Master",
    description: "Complete 100 spins",
    icon: "Trophy",
    category: "milestone",
    requirement: {
      type: "spins",
      value: 100,
      description: "Complete 100 total spins"
    },
    reward: {
      type: "badge",
      value: "Spin Master",
      description: "Exclusive badge"
    },
    unlockedBy: 234,
    totalPlayers: 2156,
    isActive: true,
    createdAt: "2025-11-01"
  },
  {
    id: "5",
    title: "High Roller",
    description: "Win 500 points in total",
    icon: "Target",
    category: "milestone",
    requirement: {
      type: "wins",
      value: 500,
      description: "Accumulate 500 points"
    },
    reward: {
      type: "prize",
      value: "mystery_box",
      description: "Free mystery box"
    },
    unlockedBy: 189,
    totalPlayers: 2156,
    isActive: true,
    createdAt: "2025-11-01"
  }
]

const iconMap = {
  Flame: IconFlame,
  Star: IconStar,
  Bolt: IconBolt,
  Trophy: IconTrophy,
  Target: IconTarget,
  Shield: IconShield,
  Medal: IconMedal,
  Award: IconAward
}

const categoryColors = {
  milestone: "bg-blue-100 text-blue-800",
  streak: "bg-green-100 text-green-800",
  special: "bg-purple-100 text-purple-800",
  seasonal: "bg-amber-100 text-amber-800"
}

export default function SpinWinAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Trophy",
    category: "milestone" as Achievement["category"],
    requirementType: "spins" as Achievement["requirement"]["type"],
    requirementValue: "",
    rewardType: "points" as Achievement["reward"]["type"],
    rewardValue: ""
  })

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      requirementType: achievement.requirement.type,
      requirementValue: achievement.requirement.value.toString(),
      rewardType: achievement.reward.type,
      rewardValue: achievement.reward.value.toString()
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingAchievement) {
      setAchievements(achievements.map(a =>
        a.id === editingAchievement.id
          ? {
              ...a,
              title: formData.title,
              description: formData.description,
              icon: formData.icon,
              category: formData.category,
              requirement: {
                ...a.requirement,
                type: formData.requirementType,
                value: parseInt(formData.requirementValue) || 0,
                description: getRequirementDescription(formData.requirementType, parseInt(formData.requirementValue) || 0)
              },
              reward: {
                ...a.reward,
                type: formData.rewardType,
                value: formData.rewardType === "points" ? parseInt(formData.rewardValue) || 0 : formData.rewardValue,
                description: getRewardDescription(formData.rewardType, formData.rewardValue)
              }
            }
          : a
      ))
    } else {
      const newAchievement: Achievement = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        category: formData.category,
        requirement: {
          type: formData.requirementType,
          value: parseInt(formData.requirementValue) || 0,
          description: getRequirementDescription(formData.requirementType, parseInt(formData.requirementValue) || 0)
        },
        reward: {
          type: formData.rewardType,
          value: formData.rewardType === "points" ? parseInt(formData.rewardValue) || 0 : formData.rewardValue,
          description: getRewardDescription(formData.rewardType, formData.rewardValue)
        },
        unlockedBy: 0,
        totalPlayers: 2156,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setAchievements([...achievements, newAchievement])
    }

    setFormData({
      title: "",
      description: "",
      icon: "Trophy",
      category: "milestone",
      requirementType: "spins",
      requirementValue: "",
      rewardType: "points",
      rewardValue: ""
    })
    setEditingAchievement(null)
    setIsDialogOpen(false)
  }

  const getRequirementDescription = (type: string, value: number) => {
    switch (type) {
      case "spins": return `Complete ${value} spins`
      case "points": return `Win ${value} points`
      case "days": return `Play ${value} consecutive days`
      case "wins": return `Win ${value} times`
      default: return `Complete ${value} actions`
    }
  }

  const getRewardDescription = (type: string, value: string) => {
    switch (type) {
      case "points": return `${value} bonus points`
      case "badge": return `"${value}" badge`
      case "title": return `"${value}" title`
      case "prize": return `Special ${value} prize`
      default: return `${value} reward`
    }
  }

  const toggleAchievement = (id: string) => {
    setAchievements(achievements.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const totalUnlocked = achievements.reduce((sum, a) => sum + a.unlockedBy, 0)
  const activeAchievements = achievements.filter(a => a.isActive).length

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Achievements</h2>
          <p className="text-muted-foreground">Manage achievements and rewards for player milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Create Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingAchievement ? "Edit Achievement" : "Create New Achievement"}
              </DialogTitle>
              <DialogDescription>
                Define player milestones and their rewards
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="achievement-title">Title</Label>
                  <Input
                    id="achievement-title"
                    placeholder="e.g., Spin Master"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="achievement-icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flame">Flame</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Bolt">Bolt</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Target">Target</SelectItem>
                      <SelectItem value="Shield">Shield</SelectItem>
                      <SelectItem value="Medal">Medal</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="achievement-description">Description</Label>
                <Input
                  id="achievement-description"
                  placeholder="e.g., Complete 100 spins"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="achievement-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Achievement["category"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="streak">Streak</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requirement-type">Requirement Type</Label>
                  <Select value={formData.requirementType} onValueChange={(value) => setFormData(prev => ({ ...prev, requirementType: value as Achievement["requirement"]["type"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spins">Spins</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="wins">Wins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requirement-value">Requirement Value</Label>
                  <Input
                    id="requirement-value"
                    type="number"
                    placeholder="100"
                    value={formData.requirementValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirementValue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reward-type">Reward Type</Label>
                  <Select value={formData.rewardType} onValueChange={(value) => setFormData(prev => ({ ...prev, rewardType: value as Achievement["reward"]["type"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="badge">Badge</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="prize">Special Prize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reward-value">
                  Reward Value {formData.rewardType === "points" ? "(number)" : "(text)"}
                </Label>
                <Input
                  id="reward-value"
                  type={formData.rewardType === "points" ? "number" : "text"}
                  placeholder={formData.rewardType === "points" ? "100" : "Spin Master"}
                  value={formData.rewardValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, rewardValue: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                setEditingAchievement(null)
                setFormData({
                  title: "",
                  description: "",
                  icon: "Trophy",
                  category: "milestone",
                  requirementType: "spins",
                  requirementValue: "",
                  rewardType: "points",
                  rewardValue: ""
                })
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.title || !formData.requirementValue || !formData.rewardValue}>
                {editingAchievement ? "Update" : "Create"} Achievement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <IconMedal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAchievements} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unlocked</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnlocked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Achievement completions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalUnlocked / achievements.length) / 21.56).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average per player
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Players Engaged</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.unlockedBy > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Achievements with unlocks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const IconComponent = iconMap[achievement.icon as keyof typeof iconMap]
          const unlockRate = ((achievement.unlockedBy / achievement.totalPlayers) * 100).toFixed(1)

          return (
            <Card key={achievement.id} className={!achievement.isActive ? 'opacity-50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge className={categoryColors[achievement.category]} variant="secondary">
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{achievement.description}</CardDescription>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Requirement:</span>
                    <span className="font-medium">{achievement.requirement.description}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reward:</span>
                    <span className="font-medium text-green-600">{achievement.reward.description}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unlocked by:</span>
                    <span className="font-medium">{achievement.unlockedBy} players ({unlockRate}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={achievement.isActive ? "default" : "secondary"}>
                      {achievement.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(achievement)}
                    >
                      <IconEdit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAchievement(achievement.id)}
                    >
                      {achievement.isActive ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}