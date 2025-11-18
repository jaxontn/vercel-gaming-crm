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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  IconBulb,
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconCopy,
  IconChartBar,
  IconCalendar,
  IconUsers,
  IconTarget,
  IconTrendingUp,
  IconClock,
  IconCircleCheck
} from "@tabler/icons-react"

interface Campaign {
  id: string
  name: string
  type: "spin-wheel" | "points" | "lead-gen" | "social" | "referral" | "vip"
  status: "active" | "paused" | "draft" | "completed"
  description: string
  startDate: string
  endDate: string
  targetAudience: string
  budget: number
  participants: number
  conversionRate: number
  revenue: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Summer Spin & Win",
    type: "spin-wheel",
    status: "active",
    description: "Summer collection promotion with interactive spinning wheel game",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    targetAudience: "All Customers",
    budget: 2500,
    participants: 1247,
    conversionRate: 23.4,
    revenue: 4250
  },
  {
    id: "camp-002",
    name: "Loyalty Points Program",
    type: "points",
    status: "active",
    description: "Ongoing customer engagement through points accumulation",
    startDate: "2025-05-15",
    endDate: "2025-12-31",
    targetAudience: "Existing Customers",
    budget: 5000,
    participants: 3521,
    conversionRate: 45.2,
    revenue: 12800
  },
  {
    id: "camp-003",
    name: "Email Capture Challenge",
    type: "lead-gen",
    status: "completed",
    description: "Email collection campaign with discount incentives",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    targetAudience: "New Visitors",
    budget: 1000,
    participants: 892,
    conversionRate: 67.8,
    revenue: 1450
  },
  {
    id: "camp-004",
    name: "Social Media Contest",
    type: "social",
    status: "active",
    description: "Instagram sharing contest for brand awareness",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    targetAudience: "Social Media Followers",
    budget: 3000,
    participants: 3456,
    conversionRate: 31.2,
    revenue: 6720
  },
  {
    id: "camp-005",
    name: "VIP Early Access",
    type: "vip",
    status: "draft",
    description: "Exclusive early access for VIP customers",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    targetAudience: "VIP Customers",
    budget: 2000,
    participants: 0,
    conversionRate: 0,
    revenue: 0
  },
  {
    id: "camp-006",
    name: "Refer-a-Friend Bonus",
    type: "referral",
    status: "active",
    description: "Referral program with dual incentives",
    startDate: "2025-06-15",
    endDate: "2025-11-15",
    targetAudience: "All Customers",
    budget: 1500,
    participants: 1234,
    conversionRate: 52.1,
    revenue: 3920
  }
]

const campaignTypes = {
  "spin-wheel": "Spin Wheel",
  "points": "Points System",
  "lead-gen": "Lead Generation",
  "social": "Social Sharing",
  "referral": "Referral Program",
  "vip": "VIP Program"
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "spin-wheel" as Campaign['type'],
    description: "",
    targetAudience: "",
    budget: "",
    startDate: "",
    endDate: ""
  })

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaign.name,
      type: newCampaign.type,
      status: "draft",
      description: newCampaign.description,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      targetAudience: newCampaign.targetAudience,
      budget: parseFloat(newCampaign.budget) || 0,
      participants: 0,
      conversionRate: 0,
      revenue: 0
    }

    setCampaigns([campaign, ...campaigns])
    setNewCampaign({
      name: "",
      type: "spin-wheel",
      description: "",
      targetAudience: "",
      budget: "",
      startDate: "",
      endDate: ""
    })
    setIsCreateDialogOpen(false)
  }

  const getROI = (campaign: Campaign) => {
    if (campaign.budget === 0) return "0%"
    return ((campaign.revenue - campaign.budget) / campaign.budget * 100).toFixed(1) + "%"
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Launch a new marketing campaign with gamification elements.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Summer Spin & Win"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select value={newCampaign.type} onValueChange={(value: Campaign['type']) => setNewCampaign(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spin-wheel">Spin Wheel</SelectItem>
                      <SelectItem value="points">Points System</SelectItem>
                      <SelectItem value="lead-gen">Lead Generation</SelectItem>
                      <SelectItem value="social">Social Sharing</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                      <SelectItem value="vip">VIP Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="campaign-description">Description</Label>
                  <Input
                    id="campaign-description"
                    placeholder="Brief description of the campaign"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., All Customers, New Visitors"
                    value={newCampaign.targetAudience}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} disabled={!newCampaign.name}>
                  Create Campaign
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
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 ? (campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +22.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage your marketing campaigns and track their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {campaignTypes[campaign.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[campaign.status]}>
                      {campaign.status === "active" && <IconCircleCheck className="w-3 h-3 mr-1 fill-current" />}
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconUsers className="w-4 h-4 text-muted-foreground" />
                      {campaign.participants.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconTrendingUp className="w-4 h-4 text-green-500" />
                      {campaign.conversionRate}%
                    </div>
                  </TableCell>
                  <TableCell>
                    ${campaign.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${parseFloat(getROI(campaign)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getROI(campaign)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconCopy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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