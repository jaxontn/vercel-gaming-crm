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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  IconMail,
  IconUsers,
  IconTrendingUp,
  IconTarget,
  IconDownload,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGift,
  IconEye,
  IconCopy,
  IconBulb
} from "@tabler/icons-react"

interface EmailCapture {
  id: string
  campaignName: string
  offerType: "discount" | "freebie" | "entry" | "upgrade"
  offerValue: string
  emailsCollected: number
  conversionRate: number
  status: "active" | "paused" | "draft"
  createdAt: string
  QRCode: string
  landingPage: string
}

interface EmailData {
  id: string
  email: string
  name?: string
  source: string
  capturedAt: string
  status: "new" | "contacted" | "converted" | "bounced"
}

const mockEmailCaptures: EmailCapture[] = [
  {
    id: "email-001",
    campaignName: "15% Welcome Discount",
    offerType: "discount",
    offerValue: "15% OFF",
    emailsCollected: 342,
    conversionRate: 23.4,
    status: "active",
    createdAt: "2025-06-01",
    QRCode: "/welcome-discount",
    landingPage: "https://yourstore.com/welcome-offer"
  },
  {
    id: "email-002",
    campaignName: "Free Gift Card",
    offerType: "freebie",
    offerValue: "$10 Gift Card",
    emailsCollected: 567,
    conversionRate: 45.2,
    status: "active",
    createdAt: "2025-06-15",
    QRCode: "/gift-card",
    landingPage: "https://yourstore.com/gift-card"
  },
  {
    id: "email-003",
    campaignName: "Product Launch Access",
    offerType: "upgrade",
    offerValue: "Early Access",
    emailsCollected: 234,
    conversionRate: 67.8,
    status: "paused",
    createdAt: "2025-07-01",
    QRCode: "/product-launch",
    landingPage: "https://yourstore.com/early-access"
  }
]

const mockEmailData: EmailData[] = [
  { id: "1", email: "sarah.j@email.com", name: "Sarah Johnson", source: "15% Welcome Discount", capturedAt: "2025-11-06", status: "new" },
  { id: "2", email: "mike.chen@email.com", name: "Mike Chen", source: "Free Gift Card", capturedAt: "2025-11-05", status: "contacted" },
  { id: "3", email: "emily.davis@email.com", name: "Emily Davis", source: "15% Welcome Discount", capturedAt: "2025-11-04", status: "converted" },
  { id: "4", email: "james.wilson@email.com", source: "Product Launch Access", capturedAt: "2025-11-03", status: "new" },
  { id: "5", email: "lisa.anderson@email.com", name: "Lisa Anderson", source: "Free Gift Card", capturedAt: "2025-11-02", status: "contacted" }
]

const offerTypes = {
  discount: "Discount",
  freebie: "Free Gift",
  entry: "Contest Entry",
  upgrade: "Special Access"
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
}

const emailStatusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  bounced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

export default function EmailCapturePage() {
  const [campaigns, setCampaigns] = useState<EmailCapture[]>(mockEmailCaptures)
  const [emailData, setEmailData] = useState<EmailData[]>(mockEmailData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    campaignName: "",
    offerType: "discount" as EmailCapture['offerType'],
    offerValue: "",
    landingPage: ""
  })

  const handleCreateCampaign = () => {
    const campaign: EmailCapture = {
      id: `email-${Date.now()}`,
      campaignName: newCampaign.campaignName,
      offerType: newCampaign.offerType,
      offerValue: newCampaign.offerValue,
      emailsCollected: 0,
      conversionRate: 0,
      status: "draft",
      createdAt: new Date().toISOString().split('T')[0],
      QRCode: `/${newCampaign.campaignName.toLowerCase().replace(/\s+/g, '-')}`,
      landingPage: newCampaign.landingPage
    }

    setCampaigns([campaign, ...campaigns])
    setNewCampaign({
      campaignName: "",
      offerType: "discount",
      offerValue: "",
      landingPage: ""
    })
    setIsCreateDialogOpen(false)
  }

  const totalEmailsCollected = campaigns.reduce((sum, c) => sum + c.emailsCollected, 0)
  const avgConversionRate = campaigns.length > 0 ?
    (campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length).toFixed(1) : 0

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Capture</h2>
          <p className="text-muted-foreground">Create and manage email collection campaigns with incentives</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Export Emails
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Email Campaign</DialogTitle>
                <DialogDescription>
                  Create a new email capture campaign with an attractive offer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., 15% Welcome Discount"
                    value={newCampaign.campaignName}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, campaignName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-type">Offer Type</Label>
                  <Select value={newCampaign.offerType} onValueChange={(value: EmailCapture['offerType']) => setNewCampaign(prev => ({ ...prev, offerType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount Code</SelectItem>
                      <SelectItem value="freebie">Free Gift</SelectItem>
                      <SelectItem value="entry">Contest Entry</SelectItem>
                      <SelectItem value="upgrade">Special Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offer-value">Offer Value</Label>
                  <Input
                    id="offer-value"
                    placeholder="e.g., 15% OFF, $10 Gift Card"
                    value={newCampaign.offerValue}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, offerValue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="landing-page">Landing Page URL</Label>
                  <Input
                    id="landing-page"
                    placeholder="https://yourstore.com/offer"
                    value={newCampaign.landingPage}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, landingPage: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} disabled={!newCampaign.campaignName}>
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
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <IconMail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmailsCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +28.4% from last month
            </p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Emails Today</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>
            Manage your email capture campaigns and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Emails Collected</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.campaignName}</div>
                      <div className="text-sm text-muted-foreground">
                        Created {campaign.createdAt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">
                        {offerTypes[campaign.offerType]}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {campaign.offerValue}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{campaign.emailsCollected.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconTrendingUp className="w-4 h-4 text-green-500" />
                      {campaign.conversionRate}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {campaign.QRCode}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <IconEye className="h-4 w-4" />
                      </Button>
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

      {/* Recent Email Signups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Email Signups</CardTitle>
          <CardDescription>
            Latest email addresses collected from your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailData.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>
                    <div className="font-medium">{email.email}</div>
                  </TableCell>
                  <TableCell>
                    {email.name || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{email.source}</div>
                  </TableCell>
                  <TableCell>
                    {email.capturedAt}
                  </TableCell>
                  <TableCell>
                    <Badge className={emailStatusColors[email.status]}>
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <IconEye className="h-4 w-4" />
                    </Button>
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