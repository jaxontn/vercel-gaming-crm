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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  IconUserPlus,
  IconGift,
  IconCopy,
  IconUsers,
  IconTrendingUp,
  IconAward,
  IconShare,
  IconLink,
  IconCheck,
  IconX,
  IconCalendar,
  IconMail,
  IconBolt,
  IconTarget,
  IconCurrencyDollar,
  IconEdit,
} from "@tabler/icons-react"

interface ReferralProgram {
  id: string
  name: string
  description: string
  referrerReward: {
    type: "points" | "discount" | "cash"
    value: number
    description: string
  }
  refereeReward: {
    type: "points" | "discount" | "cash"
    value: number
    description: string
  }
  isActive: boolean
  startDate: string
  endDate: string
  totalReferrals: number
  successfulReferrals: number
  conversionRate: number
}

interface Referral {
  id: string
  referrerName: string
  referrerEmail: string
  refereeName: string
  refereeEmail: string
  referralCode: string
  status: "pending" | "completed" | "expired"
  referralDate: string
  completionDate?: string
  referrerReward: number
  refereeReward: number
}

const mockReferralPrograms: ReferralProgram[] = [
  {
    id: "program-001",
    name: "Friend Referral Bonus",
    description: "Invite friends and both get rewarded when they sign up and make their first purchase",
    referrerReward: {
      type: "points",
      value: 500,
      description: "500 bonus points"
    },
    refereeReward: {
      type: "discount",
      value: 10,
      description: "10% off first purchase"
    },
    isActive: true,
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    totalReferrals: 234,
    successfulReferrals: 156,
    conversionRate: 66.7,
  },
  {
    id: "program-002",
    name: "VIP Member Referral",
    description: "VIP members get exclusive rewards for referring new VIP members",
    referrerReward: {
      type: "cash",
      value: 25,
      description: "$25 cash reward"
    },
    refereeReward: {
      type: "points",
      value: 1000,
      description: "1000 welcome points"
    },
    isActive: true,
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    totalReferrals: 89,
    successfulReferrals: 67,
    conversionRate: 75.3,
  },
]

const mockReferrals: Referral[] = [
  {
    id: "ref-001",
    referrerName: "Sarah Johnson",
    referrerEmail: "sarah.j@email.com",
    refereeName: "Mike Chen",
    refereeEmail: "mike.chen@email.com",
    referralCode: "SARAH2025",
    status: "completed",
    referralDate: "2025-11-01",
    completionDate: "2025-11-05",
    referrerReward: 500,
    refereeReward: 10,
  },
  {
    id: "ref-002",
    referrerName: "Emily Davis",
    referrerEmail: "emily.d@email.com",
    refereeName: "Lisa Anderson",
    refereeEmail: "lisa.a@email.com",
    referralCode: "EMILY2025",
    status: "pending",
    referralDate: "2025-11-06",
    referrerReward: 500,
    refereeReward: 10,
  },
  {
    id: "ref-003",
    referrerName: "James Wilson",
    referrerEmail: "james.w@email.com",
    refereeName: "David Brown",
    refereeEmail: "david.b@email.com",
    referralCode: "JAMES2025",
    status: "expired",
    referralDate: "2025-10-15",
    referrerReward: 500,
    refereeReward: 10,
  },
]

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  expired: "Expired",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const rewardTypeIcons = {
  points: <IconBolt className="h-3 w-3 text-yellow-500" />,
  discount: <IconGift className="h-3 w-3 text-blue-500" />,
  cash: <IconCurrencyDollar className="h-3 w-3 text-green-500" />,
}

export default function ReferralProgramPage() {
  const [programs, setPrograms] = useState<ReferralProgram[]>(mockReferralPrograms)
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals)
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("programs")

  const totalReferrals = programs.reduce((sum, program) => sum + program.totalReferrals, 0)
  const successfulReferrals = programs.reduce((sum, program) => sum + program.successfulReferrals, 0)
  const averageConversionRate = Math.round(programs.reduce((sum, program) => sum + program.conversionRate, 0) / programs.length)
  const totalRewardsPaid = referrals.filter(r => r.status === "completed").reduce((sum, referral) => sum + referral.referrerReward, 0)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you'd show a toast notification here
  }

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Referral Program</h2>
        <div className="flex items-center space-x-2">
          {activeTab === "programs" && (
            <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconUserPlus className="mr-2 h-4 w-4" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Referral Program</DialogTitle>
                  <DialogDescription>
                    Set up a new referral program to encourage customer referrals.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="program-name">Program Name</Label>
                    <Input id="program-name" placeholder="e.g., Friend Referral Bonus" />
                  </div>
                  <div>
                    <Label htmlFor="program-description">Description</Label>
                    <Input id="program-description" placeholder="Describe how the program works" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>Referrer Reward</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Reward type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="points">Points</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Reward value" />
                    </div>
                    <div className="space-y-3">
                      <Label>Referee Reward</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Reward type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="points">Points</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Reward value" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProgramDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsProgramDialogOpen(false)}>
                    Create Program
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
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +28.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {successfulReferrals} of {totalReferrals} successful
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <IconAward className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.filter(p => p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {programs.length} total programs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Paid</CardTitle>
            <IconGift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewardsPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Points/Cash/Discounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Programs</CardTitle>
              <CardDescription>
                Manage your referral programs and their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Referrer Reward</TableHead>
                    <TableHead>Referee Reward</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{program.name}</div>
                          <div className="text-sm text-muted-foreground">{program.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rewardTypeIcons[program.referrerReward.type]}
                          <div>
                            <div className="font-medium">{program.referrerReward.value}</div>
                            <div className="text-xs text-muted-foreground">
                              {program.referrerReward.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rewardTypeIcons[program.refereeReward.type]}
                          <div>
                            <div className="font-medium">{program.refereeReward.value}</div>
                            <div className="text-xs text-muted-foreground">
                              {program.refereeReward.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {program.successfulReferrals} / {program.totalReferrals}
                          </div>
                          <Progress
                            value={program.conversionRate}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {program.conversionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{program.startDate}</div>
                          <div className="text-muted-foreground">{program.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={program.isActive} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <IconCopy className="h-4 w-4" />
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

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>
                Track individual referrals and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Referee</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referral Date</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Rewards</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.referrerName}</div>
                          <div className="text-sm text-muted-foreground">{referral.referrerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.refereeName}</div>
                          <div className="text-sm text-muted-foreground">{referral.refereeEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {referral.referralCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(referral.referralCode)}
                          >
                            <IconCopy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[referral.status]}>
                          {statusLabels[referral.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{referral.referralDate}</TableCell>
                      <TableCell>
                        {referral.completionDate || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <IconUserPlus className="h-3 w-3" />
                            <span>+{referral.referrerReward}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <IconGift className="h-3 w-3" />
                            <span>+{referral.refereeReward}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {referral.status === "completed" && (
                            <Button variant="ghost" size="sm">
                              <IconCheck className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {referral.status === "expired" && (
                            <Button variant="ghost" size="sm">
                              <IconX className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <IconMail className="h-4 w-4" />
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