"use client"

import { useState, useEffect } from "react"
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
  IconQrcode,
  IconPlus,
  IconDownload,
  IconCopy,
  IconTrash,
  IconEye,
  IconEdit,
  IconShare,
  IconUsers,
  IconTrendingUp,
  IconClock,
  IconCircleCheck,
  IconDots
} from "@tabler/icons-react"

interface QRCampaign {
  id: string
  name: string
  description: string
  qrUrl: string
  totalScans: number
  uniqueScans: number
  conversions: number
  status: "active" | "paused" | "expired"
  createdAt: string
  expiresAt?: string
  location?: string
}

// Mock QR campaign data
const mockQRCampaigns: QRCampaign[] = [
  {
    id: "qr-001",
    name: "Summer Spin & Win",
    description: "In-store promotion for summer collection",
    qrUrl: "http://localhost:3000/play/your-store",
    totalScans: 1247,
    uniqueScans: 892,
    conversions: 234,
    status: "active",
    createdAt: "2025-06-01T10:00:00Z",
    expiresAt: "2025-08-31T23:59:59Z",
    location: "Main Store - Front Counter"
  },
  {
    id: "qr-002",
    name: "Loyalty Points Program",
    description: "Ongoing customer engagement campaign",
    qrUrl: "http://localhost:3000/play/your-store",
    totalScans: 3521,
    uniqueScans: 2156,
    conversions: 890,
    status: "active",
    createdAt: "2025-05-15T09:00:00Z",
    location: "All Branches"
  },
  {
    id: "qr-003",
    name: "Weekend Special",
    description: "Limited time weekend promotion",
    qrUrl: "http://localhost:3000/play/your-store",
    totalScans: 567,
    uniqueScans: 423,
    conversions: 156,
    status: "paused",
    createdAt: "2025-07-10T08:00:00Z",
    expiresAt: "2025-07-14T23:59:59Z",
    location: "Store Entrance"
  }
]

export default function QRCodesPage() {
  const [campaigns, setCampaigns] = useState<QRCampaign[]>(mockQRCampaigns)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    location: "",
    expiresAt: ""
  })

  const handleCreateQRCode = () => {
    const newQRCampaign: QRCampaign = {
      id: `qr-${Date.now()}`,
      name: newCampaign.name,
      description: newCampaign.description,
      qrUrl: "http://localhost:3000/play/your-store",
      totalScans: 0,
      uniqueScans: 0,
      conversions: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: newCampaign.expiresAt ? new Date(newCampaign.expiresAt).toISOString() : undefined,
      location: newCampaign.location
    }

    setCampaigns([newQRCampaign, ...campaigns])
    setNewCampaign({ name: "", description: "", location: "", expiresAt: "" })
    setIsCreateDialogOpen(false)
  }

  const handleCopyQRUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // In production, you'd show a toast notification here
  }

  const handleDownloadQR = (campaign: QRCampaign) => {
    // In production, this would generate and download a QR code image
    const link = document.createElement('a')
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(campaign.qrUrl)}`
    link.download = `qr-${campaign.id}.png`
    link.click()
  }

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateConversionRate = (campaign: QRCampaign) => {
    return campaign.uniqueScans > 0
      ? Math.round((campaign.conversions / campaign.uniqueScans) * 100)
      : 0
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">QR Code Campaigns</h2>
          <p className="text-muted-foreground">
            Create and manage QR codes for your gamified marketing campaigns
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Create QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New QR Campaign</DialogTitle>
              <DialogDescription>
                Generate a new QR code for your gamified marketing campaign
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Promotion"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                />
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
                <Label htmlFor="campaign-location">Location (Optional)</Label>
                <Input
                  id="campaign-location"
                  placeholder="e.g., Front Counter, Store Entrance"
                  value={newCampaign.location}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="campaign-expires">Expiry Date (Optional)</Label>
                <Input
                  id="campaign-expires"
                  type="date"
                  value={newCampaign.expiresAt}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQRCode} disabled={!newCampaign.name}>
                Create QR Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
            <IconQrcode className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.totalScans, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last week
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
              {Math.round(
                campaigns.reduce((sum, c) => sum + calculateConversionRate(c), 0) / campaigns.length
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              Above industry average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QR Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Campaigns</CardTitle>
          <CardDescription>
            Manage your QR codes and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.merchantName}
                        {campaign.location && ` • ${campaign.location}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.totalScans.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.uniqueScans} unique
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{campaign.conversions.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{calculateConversionRate(campaign)}%</span>
                      {calculateConversionRate(campaign) >= 25 && (
                        <IconTrendingUp className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(campaign.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyQRUrl(campaign.qrUrl)}>
                          <IconCopy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadQR(campaign)}>
                          <IconDownload className="mr-2 h-4 w-4" />
                          Download QR
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconShare className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-red-600"
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
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