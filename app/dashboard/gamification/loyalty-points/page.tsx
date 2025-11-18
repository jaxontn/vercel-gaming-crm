"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  IconCoin,
  IconGift,
  IconSettings,
  IconPlus,
  IconEdit,
  IconTrash,
  IconTrendingUp,
  IconAward,
  IconUsers,
  IconStar,
  IconShoppingCart,
} from "@tabler/icons-react"

interface LoyaltyRule {
  id: string
  name: string
  description: string
  pointsPerAction: number
  actionType: "purchase" | "visit" | "social_share" | "referral" | "birthday" | "review"
  isActive: boolean
  pointsRequired: number
  createdDate: string
  totalAwarded: number
}

interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  category: "discount" | "product" | "experience" | "voucher"
  isActive: boolean
  stock: number
  claimedCount: number
}

const mockLoyaltyRules: LoyaltyRule[] = [
  {
    id: "rule-001",
    name: "Purchase Points",
    description: "Earn 1 point for every dollar spent",
    pointsPerAction: 1,
    actionType: "purchase",
    isActive: true,
    pointsRequired: 0,
    createdDate: "2025-06-01",
    totalAwarded: 15678,
  },
  {
    id: "rule-002",
    name: "Daily Visit Bonus",
    description: "Earn 10 points for daily store visits",
    pointsPerAction: 10,
    actionType: "visit",
    isActive: true,
    pointsRequired: 0,
    createdDate: "2025-06-01",
    totalAwarded: 3456,
  },
  {
    id: "rule-003",
    name: "Social Media Share",
    description: "Earn 25 points for sharing on social media",
    pointsPerAction: 25,
    actionType: "social_share",
    isActive: true,
    pointsRequired: 0,
    createdDate: "2025-06-15",
    totalAwarded: 892,
  },
  {
    id: "rule-004",
    name: "Birthday Bonus",
    description: "Earn 100 bonus points on birthday",
    pointsPerAction: 100,
    actionType: "birthday",
    isActive: true,
    pointsRequired: 0,
    createdDate: "2025-07-01",
    totalAwarded: 234,
  },
]

const mockLoyaltyRewards: LoyaltyReward[] = [
  {
    id: "reward-001",
    name: "$5 Off Coupon",
    description: "Get $5 off your next purchase",
    pointsCost: 500,
    category: "discount",
    isActive: true,
    stock: -1, // Unlimited
    claimedCount: 145,
  },
  {
    id: "reward-002",
    name: "Free Coffee",
    description: "Redeem for any medium coffee",
    pointsCost: 200,
    category: "product",
    isActive: true,
    stock: 50,
    claimedCount: 78,
  },
  {
    id: "reward-003",
    name: "VIP Experience",
    description: "Exclusive VIP shopping event access",
    pointsCost: 2000,
    category: "experience",
    isActive: true,
    stock: 10,
    claimedCount: 3,
  },
  {
    id: "reward-004",
    name: "20% Off Voucher",
    description: "Get 20% off your entire purchase",
    pointsCost: 1000,
    category: "voucher",
    isActive: true,
    stock: -1,
    claimedCount: 67,
  },
]

const actionTypeLabels = {
  purchase: "Purchase",
  visit: "Store Visit",
  social_share: "Social Share",
  referral: "Referral",
  birthday: "Birthday",
  review: "Review",
}

const categoryLabels = {
  discount: "Discount",
  product: "Product",
  experience: "Experience",
  voucher: "Voucher",
}

const categoryIcons = {
  discount: <IconShoppingCart className="h-4 w-4" />,
  product: <IconGift className="h-4 w-4" />,
  experience: <IconStar className="h-4 w-4" />,
  voucher: <IconCoin className="h-4 w-4" />,
}

export default function LoyaltyPointsPage() {
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>(mockLoyaltyRules)
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(mockLoyaltyRewards)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("rules")

  const totalPointsAwarded = loyaltyRules.reduce((sum, rule) => sum + rule.totalAwarded, 0)
  const totalRewardsClaimed = loyaltyRewards.reduce((sum, reward) => sum + reward.claimedCount, 0)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Loyalty Points System</h2>
        <div className="flex items-center space-x-2">
          {activeTab === "rules" ? (
            <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Loyalty Rule</DialogTitle>
                  <DialogDescription>
                    Define how customers can earn loyalty points.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input id="rule-name" placeholder="e.g., Purchase Points" />
                  </div>
                  <div>
                    <Label htmlFor="action-type">Action Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(actionTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="points-per-action">Points Per Action</Label>
                    <Input id="points-per-action" type="number" placeholder="e.g., 10" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsRuleDialogOpen(false)}>
                    Create Rule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Loyalty Reward</DialogTitle>
                  <DialogDescription>
                    Define what customers can redeem with their points.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reward-name">Reward Name</Label>
                    <Input id="reward-name" placeholder="e.g., $5 Off Coupon" />
                  </div>
                  <div>
                    <Label htmlFor="reward-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="points-cost">Points Cost</Label>
                    <Input id="points-cost" type="number" placeholder="e.g., 500" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRewardDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsRewardDialogOpen(false)}>
                    Create Reward
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points Awarded</CardTitle>
            <IconCoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <IconSettings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyRules.filter(rule => rule.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loyaltyRules.length} total rules
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
            <IconGift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyRewards.filter(reward => reward.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {loyaltyRewards.length} total rewards
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Claimed</CardTitle>
            <IconAward className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewardsClaimed}</div>
            <p className="text-xs text-muted-foreground">
              +22.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "rules"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Earning Rules
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "rewards"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rewards Catalog
        </button>
      </div>

      {activeTab === "rules" ? (
        <Card>
          <CardHeader>
            <CardTitle>Earning Rules</CardTitle>
            <CardDescription>
              Configure how customers can earn loyalty points through various actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Action Type</TableHead>
                  <TableHead>Points/Action</TableHead>
                  <TableHead>Total Awarded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyaltyRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {actionTypeLabels[rule.actionType]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconCoin className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{rule.pointsPerAction}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconTrendingUp className="h-3 w-3 text-green-500" />
                        <span>{rule.totalAwarded.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={rule.isActive} />
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Rewards Catalog</CardTitle>
            <CardDescription>
              Manage the rewards that customers can redeem with their loyalty points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Points Cost</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyaltyRewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reward.name}</div>
                        <div className="text-sm text-muted-foreground">{reward.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground">
                          {categoryIcons[reward.category]}
                        </div>
                        <Badge variant="outline">
                          {categoryLabels[reward.category]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconCoin className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{reward.pointsCost.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reward.stock === -1 ? (
                        <Badge variant="secondary">Unlimited</Badge>
                      ) : (
                        <span className={reward.stock < 10 ? "text-red-600" : ""}>
                          {reward.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconAward className="h-3 w-3 text-blue-500" />
                        <span>{reward.claimedCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={reward.isActive} />
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
      )}
    </div>
  )
}