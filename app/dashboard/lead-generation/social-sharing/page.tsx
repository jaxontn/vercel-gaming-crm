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
  IconShare,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCopy,
  IconTrendingUp,
  IconUsers,
  IconHeart,
  IconMessageCircle,
  IconLink,
  IconBolt,
  IconCalendar,
} from "@tabler/icons-react"

interface SocialSharingCampaign {
  id: string
  title: string
  description: string
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "all"
  content: string
  imageUrl?: string
  hashtags: string[]
  pointsReward: number
  isActive: boolean
  createdDate: string
  sharesCount: number
  clicksCount: number
  leadsGenerated: number
}

interface SocialShare {
  id: string
  customerName: string
  platform: string
  campaignTitle: string
  sharedContent: string
  shareDate: string
  pointsEarned: number
  clicksGenerated: number
  leadsGenerated: number
}

const mockSharingCampaigns: SocialSharingCampaign[] = [
  {
    id: "campaign-001",
    title: "Summer Spin & Win",
    description: "Share your Spin & Win winnings for bonus points!",
    platform: "all",
    content: "Just won amazing prizes in the Spin & Win game! 🎰 Join me and try your luck! #SpinAndWin #[YourBusiness] #SummerFun",
    hashtags: ["SpinAndWin", "YourBusiness", "SummerFun"],
    pointsReward: 25,
    isActive: true,
    createdDate: "2025-06-01",
    sharesCount: 234,
    clicksCount: 567,
    leadsGenerated: 89,
  },
  {
    id: "campaign-002",
    title: "VIP Membership Benefits",
    description: "Showcase your VIP status and exclusive perks",
    platform: "instagram",
    content: "Loving my VIP membership at [YourBusiness]! ✨ Exclusive access, special discounts, and amazing rewards! #VIP #LoyaltyProgram",
    hashtags: ["VIP", "LoyaltyProgram", "Exclusive"],
    pointsReward: 50,
    isActive: true,
    createdDate: "2025-06-15",
    sharesCount: 145,
    clicksCount: 289,
    leadsGenerated: 34,
  },
  {
    id: "campaign-003",
    title: "Birthday Special",
    description: "Share your birthday celebration with us",
    platform: "facebook",
    content: "Celebrating my birthday with amazing treats from [YourBusiness]! 🎂 Thank you for making it special! #Birthday #[YourBusiness]",
    hashtags: ["Birthday", "Celebration"],
    pointsReward: 100,
    isActive: true,
    createdDate: "2025-07-01",
    sharesCount: 67,
    clicksCount: 156,
    leadsGenerated: 23,
  },
]

const mockSocialShares: SocialShare[] = [
  {
    id: "share-001",
    customerName: "Sarah Johnson",
    platform: "Facebook",
    campaignTitle: "Summer Spin & Win",
    sharedContent: "Just won 500 points in the Spin & Win game! 🎯",
    shareDate: "2025-11-06",
    pointsEarned: 25,
    clicksGenerated: 12,
    leadsGenerated: 3,
  },
  {
    id: "share-002",
    customerName: "Mike Chen",
    platform: "Instagram",
    campaignTitle: "VIP Membership Benefits",
    sharedContent: "VIP perks are amazing! Just got exclusive access to the new collection 👑",
    shareDate: "2025-11-05",
    pointsEarned: 50,
    clicksGenerated: 8,
    leadsGenerated: 2,
  },
  {
    id: "share-003",
    customerName: "Emily Davis",
    platform: "Twitter",
    campaignTitle: "Summer Spin & Win",
    sharedContent: "Spin & Win is so addictive! Already won 3 times today! 🎰",
    shareDate: "2025-11-04",
    pointsEarned: 25,
    clicksGenerated: 15,
    leadsGenerated: 4,
  },
]

const platformLabels = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  all: "All Platforms",
}

const platformIcons = {
  facebook: <IconBrandFacebook className="h-4 w-4 text-blue-600" />,
  twitter: <IconBrandTwitter className="h-4 w-4 text-sky-500" />,
  instagram: <IconBrandInstagram className="h-4 w-4 text-pink-600" />,
  linkedin: <IconBrandLinkedin className="h-4 w-4 text-blue-700" />,
  all: <IconShare className="h-4 w-4 text-gray-600" />,
}

export default function SocialSharingPage() {
  const [campaigns, setCampaigns] = useState<SocialSharingCampaign[]>(mockSharingCampaigns)
  const [socialShares, setSocialShares] = useState<SocialShare[]>(mockSocialShares)
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("campaigns")

  const totalShares = campaigns.reduce((sum, campaign) => sum + campaign.sharesCount, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicksCount, 0)
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leadsGenerated, 0)
  const totalPointsAwarded = socialShares.reduce((sum, share) => sum + share.pointsEarned, 0)

  const getEngagementRate = (clicks: number, shares: number) => {
    if (shares === 0) return 0
    return Math.round((clicks / shares) * 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you'd show a toast notification here
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Social Sharing</h2>
        <div className="flex items-center space-x-2">
          {activeTab === "campaigns" && (
            <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Social Sharing Campaign</DialogTitle>
                  <DialogDescription>
                    Design a campaign that encourages customers to share on social media.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-title">Campaign Title</Label>
                    <Input id="campaign-title" placeholder="e.g., Summer Spin & Win" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-description">Description</Label>
                    <Input id="campaign-description" placeholder="e.g., Share your winnings for bonus points" />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(platformLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="share-content">Share Content</Label>
                    <Input
                      id="share-content"
                      placeholder="What customers will share..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hashtags">Hashtags</Label>
                      <Input id="hashtags" placeholder="e.g., #SpinAndWin #YourBusiness" />
                    </div>
                    <div>
                      <Label htmlFor="points-reward">Points Reward</Label>
                      <Input id="points-reward" type="number" placeholder="e.g., 25" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCampaignDialogOpen(false)}>
                    Create Campaign
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
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <IconShare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +24.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getEngagementRate(totalClicks, totalShares)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Clicks per share
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +18.7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
            <IconBolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From social shares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="shares">Recent Shares</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Sharing Campaigns</CardTitle>
              <CardDescription>
                Manage campaigns that encourage customers to share on social media.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <IconCalendar className="inline h-3 w-3 mr-1" />
                            {campaign.createdDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {platformIcons[campaign.platform]}
                          <Badge variant="outline">
                            {platformLabels[campaign.platform]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          <p className="text-sm">{campaign.content}</p>
                          {campaign.hashtags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {campaign.hashtags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {campaign.hashtags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{campaign.hashtags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <IconShare className="h-3 w-3" />
                            <span>{campaign.sharesCount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IconHeart className="h-3 w-3" />
                            <span>{campaign.clicksCount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IconUsers className="h-3 w-3" />
                            <span>{campaign.leadsGenerated}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconBolt className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{campaign.pointsReward}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={campaign.isActive} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <IconEye className="h-4 w-4" />
                          </Button>
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

        <TabsContent value="shares" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Social Shares</CardTitle>
              <CardDescription>
                Track customer social media shares and their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Shared Content</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Points Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialShares.map((share) => (
                    <TableRow key={share.id}>
                      <TableCell className="font-medium">{share.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{share.platform}</Badge>
                      </TableCell>
                      <TableCell>{share.campaignTitle}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">
                          <p className="text-sm">{share.sharedContent}</p>
                        </div>
                      </TableCell>
                      <TableCell>{share.shareDate}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <IconMessageCircle className="h-3 w-3" />
                            <span>{share.clicksGenerated}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <IconUsers className="h-3 w-3" />
                            <span>{share.leadsGenerated}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconBolt className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{share.pointsEarned}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <IconCopy className="h-4 w-4" />
                        </Button>
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