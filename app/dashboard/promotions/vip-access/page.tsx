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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  IconStar,
  IconCrown,
  IconDiamond,
  IconKey,
  IconUsers,
  IconTrendingUp,
  IconGift,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconCurrencyDollar,
  IconAward,
  IconBolt,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

interface VIPBenefit {
  id: string
  name: string
  description: string
  category: "discount" | "access" | "service" | "reward"
  value: string
  isActive: boolean
  usageCount: number
}

interface VIPTier {
  id: string
  name: string
  level: number
  icon: string
  color: string
  benefits: string[]
  requirements: {
    minSpend: number
    minPoints: number
    minPurchases: number
  }
  memberCount: number
  isActive: boolean
}

interface VIPMember {
  id: string
  name: string
  email: string
  phone: string
  tier: string
  joinDate: string
  totalSpent: number
  pointsEarned: number
  lastActive: string
  status: "active" | "inactive" | "expired"
}

const mockVIPBenefits: VIPBenefit[] = [
  {
    id: "benefit-001",
    name: "Exclusive Discounts",
    description: "20% off on all purchases",
    category: "discount",
    value: "20%",
    isActive: true,
    usageCount: 1234,
  },
  {
    id: "benefit-002",
    name: "Early Access",
    description: "Access new products 24 hours before general release",
    category: "access",
    value: "24h early",
    isActive: true,
    usageCount: 567,
  },
  {
    id: "benefit-003",
    name: "Personal Shopper",
    description: "Free personal shopping assistance",
    category: "service",
    value: "$200 value",
    isActive: true,
    usageCount: 89,
  },
  {
    id: "benefit-004",
    name: "Double Points",
    description: "Earn 2x points on all purchases",
    category: "reward",
    value: "2x multiplier",
    isActive: true,
    usageCount: 2345,
  },
]

const mockVIPTiers: VIPTier[] = [
  {
    id: "tier-001",
    name: "Silver VIP",
    level: 1,
    icon: "star",
    color: "bg-gray-500",
    benefits: ["10% discount", "Early access", "Double points"],
    requirements: {
      minSpend: 500,
      minPoints: 1000,
      minPurchases: 10,
    },
    memberCount: 234,
    isActive: true,
  },
  {
    id: "tier-002",
    name: "Gold VIP",
    level: 2,
    icon: "crown",
    color: "bg-yellow-500",
    benefits: ["20% discount", "Early access", "Double points", "Free shipping"],
    requirements: {
      minSpend: 1500,
      minPoints: 5000,
      minPurchases: 25,
    },
    memberCount: 89,
    isActive: true,
  },
  {
    id: "tier-003",
    name: "Platinum VIP",
    level: 3,
    icon: "diamond",
    color: "bg-purple-500",
    benefits: ["30% discount", "Early access", "Triple points", "Free shipping", "Personal shopper"],
    requirements: {
      minSpend: 5000,
      minPoints: 15000,
      minPurchases: 50,
    },
    memberCount: 23,
    isActive: true,
  },
]

const mockVIPMembers: VIPMember[] = [
  {
    id: "member-001",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "555-123-4567",
    tier: "Platinum VIP",
    joinDate: "2025-01-15",
    totalSpent: 6750,
    pointsEarned: 18750,
    lastActive: "2025-11-06",
    status: "active",
  },
  {
    id: "member-002",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "555-234-5678",
    tier: "Gold VIP",
    joinDate: "2025-03-20",
    totalSpent: 2100,
    pointsEarned: 6200,
    lastActive: "2025-11-05",
    status: "active",
  },
  {
    id: "member-003",
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "555-345-6789",
    tier: "Silver VIP",
    joinDate: "2025-06-10",
    totalSpent: 750,
    pointsEarned: 1850,
    lastActive: "2025-11-04",
    status: "active",
  },
]

const categoryLabels = {
  discount: "Discount",
  access: "Access",
  service: "Service",
  reward: "Reward",
}

const categoryIcons = {
  discount: <IconCurrencyDollar className="h-4 w-4" />,
  access: <IconKey className="h-4 w-4" />,
  service: <IconAward className="h-4 w-4" />,
  reward: <IconBolt className="h-4 w-4" />,
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const tierColors = {
  "Silver VIP": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Gold VIP": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Platinum VIP": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const tierIcons = {
  "Silver VIP": <IconStar className="h-4 w-4" />,
  "Gold VIP": <IconCrown className="h-4 w-4" />,
  "Platinum VIP": <IconDiamond className="h-4 w-4" />,
}

export default function VIPAccessPage() {
  const [benefits, setBenefits] = useState<VIPBenefit[]>(mockVIPBenefits)
  const [tiers, setTiers] = useState<VIPTier[]>(mockVIPTiers)
  const [members, setMembers] = useState<VIPMember[]>(mockVIPMembers)
  const [isBenefitDialogOpen, setIsBenefitDialogOpen] = useState(false)
  const [isTierDialogOpen, setIsTierDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("benefits")

  const totalVIPMembers = members.filter(m => m.status === "active").length
  const totalVIPRevenue = members.reduce((sum, member) => sum + member.totalSpent, 0)
  const averageVIPSpending = Math.round(totalVIPRevenue / totalVIPMembers)
  const totalBenefitsUsage = benefits.reduce((sum, benefit) => sum + benefit.usageCount, 0)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">VIP Access</h2>
        <div className="flex items-center space-x-2">
          {activeTab === "benefits" && (
            <Dialog open={isBenefitDialogOpen} onOpenChange={setIsBenefitDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Benefit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create VIP Benefit</DialogTitle>
                  <DialogDescription>
                    Add a new exclusive benefit for VIP members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="benefit-name">Benefit Name</Label>
                    <Input id="benefit-name" placeholder="e.g., Exclusive Discounts" />
                  </div>
                  <div>
                    <Label htmlFor="benefit-description">Description</Label>
                    <Input id="benefit-description" placeholder="Describe the benefit" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="benefit-category">Category</Label>
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
                      <Label htmlFor="benefit-value">Value</Label>
                      <Input id="benefit-value" placeholder="e.g., 20%" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBenefitDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsBenefitDialogOpen(false)}>
                    Add Benefit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {activeTab === "tiers" && (
            <Dialog open={isTierDialogOpen} onOpenChange={setIsTierDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Create Tier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create VIP Tier</DialogTitle>
                  <DialogDescription>
                    Create a new VIP tier with specific requirements and benefits.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tier-name">Tier Name</Label>
                    <Input id="tier-name" placeholder="e.g., Platinum VIP" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="min-spend">Min Spend ($)</Label>
                      <Input id="min-spend" type="number" placeholder="e.g., 5000" />
                    </div>
                    <div>
                      <Label htmlFor="min-points">Min Points</Label>
                      <Input id="min-points" type="number" placeholder="e.g., 15000" />
                    </div>
                    <div>
                      <Label htmlFor="min-purchases">Min Purchases</Label>
                      <Input id="min-purchases" type="number" placeholder="e.g., 50" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTierDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsTierDialogOpen(false)}>
                    Create Tier
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
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVIPMembers}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Revenue</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVIPRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +28.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spending</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageVIPSpending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per VIP member
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benefits Usage</CardTitle>
            <IconGift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBenefitsUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total benefit uses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Benefits</CardTitle>
              <CardDescription>
                Manage exclusive benefits available to VIP members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benefit</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{benefit.name}</div>
                          <div className="text-sm text-muted-foreground">{benefit.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {categoryIcons[benefit.category]}
                          <Badge variant="outline">
                            {categoryLabels[benefit.category]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{benefit.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconTrendingUp className="h-3 w-3" />
                          <span>{benefit.usageCount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={benefit.isActive} />
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
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Tiers</CardTitle>
              <CardDescription>
                Manage VIP membership tiers and their requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {tiers.map((tier) => (
                  <Card key={tier.id} className="relative overflow-hidden">
                    <div className={`h-2 ${tier.color}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tierIcons[tier.name]}
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                        </div>
                        <Badge variant="outline">Level {tier.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Members</Label>
                        <div className="flex items-center gap-2">
                          <IconUsers className="h-4 w-4" />
                          <span className="font-medium">{tier.memberCount}</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Requirements</Label>
                        <div className="space-y-1 text-sm">
                          <div>Min spend: ${tier.requirements.minSpend}</div>
                          <div>Min points: {tier.requirements.minPoints}</div>
                          <div>Min purchases: {tier.requirements.minPurchases}</div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Benefits</Label>
                        <div className="space-y-1">
                          {tier.benefits.slice(0, 3).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <IconCheck className="h-3 w-3 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                          {tier.benefits.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{tier.benefits.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Switch checked={tier.isActive} />
                        <Button variant="ghost" size="sm">
                          <IconEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Members</CardTitle>
              <CardDescription>
                View and manage your VIP members and their activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Points Earned</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last active: {member.lastActive}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{member.email}</div>
                          <div>{member.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={tierColors[member.tier]}>
                          {tierIcons[member.tier]}
                          <span className="ml-1">{member.tier}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${member.totalSpent.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconBolt className="h-3 w-3 text-yellow-500" />
                          <span>{member.pointsEarned.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[member.status]}>
                          {member.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <IconEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}