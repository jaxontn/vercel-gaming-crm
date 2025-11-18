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
  IconGift,
  IconQuestionMark,
  IconBox,
  IconBolt,
  IconUsers,
  IconTrendingUp,
  IconCurrencyDollar,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconAward,
  IconCheck,
  IconX,
  IconSparkles,
  IconShoppingCart,
} from "@tabler/icons-react"

interface MysteryOffer {
  id: string
  title: string
  description: string
  type: "discount" | "product" | "points" | "voucher" | "experience"
  possibleRewards: PossibleReward[]
  revealMechanism: "instant" | "spin" | "scratch" | "box"
  costToReveal: number
  maxClaims: number
  currentClaims: number
  startDate: string
  endDate: string
  isActive: boolean
  targetAudience: "all" | "vip" | "loyalty_members"
  totalReveals: number
  successRate: number
}

interface PossibleReward {
  id: string
  name: string
  description: string
  type: "discount" | "product" | "points" | "voucher" | "experience"
  value: string
  rarity: "common" | "rare" | "epic" | "legendary"
  probability: number
  imageUrl?: string
}

interface MysteryReveal {
  id: string
  customerName: string
  offerTitle: string
  rewardReceived: string
  revealDate: string
  pointsSpent: number
  rewardValue: string
  rarity: string
}

const mockMysteryOffers: MysteryOffer[] = [
  {
    id: "offer-001",
    title: "Mystery Box November",
    description: "Discover amazing prizes in our limited edition mystery box!",
    type: "product",
    possibleRewards: [
      {
        id: "reward-001",
        name: "10% Discount",
        description: "Get 10% off your next purchase",
        type: "discount",
        value: "10%",
        rarity: "common",
        probability: 40,
      },
      {
        id: "reward-002",
        name: "Free Coffee",
        description: "Redeem for any medium coffee",
        type: "product",
        value: "$5",
        rarity: "rare",
        probability: 30,
      },
      {
        id: "reward-003",
        name: "500 Points",
        description: "Bonus loyalty points",
        type: "points",
        value: "500",
        rarity: "epic",
        probability: 25,
      },
      {
        id: "reward-004",
        name: "$20 Gift Card",
        description: "Store gift card",
        type: "voucher",
        value: "$20",
        rarity: "legendary",
        probability: 5,
      },
    ],
    revealMechanism: "box",
    costToReveal: 100,
    maxClaims: 500,
    currentClaims: 234,
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    isActive: true,
    targetAudience: "all",
    totalReveals: 234,
    successRate: 89,
  },
  {
    id: "offer-002",
    title: "Spin to Win",
    description: "Spin the wheel and win instant prizes!",
    type: "voucher",
    possibleRewards: [
      {
        id: "reward-005",
        name: "5% Discount",
        description: "Small discount",
        type: "discount",
        value: "5%",
        rarity: "common",
        probability: 50,
      },
      {
        id: "reward-006",
        name: "15% Discount",
        description: "Medium discount",
        type: "discount",
        value: "15%",
        rarity: "rare",
        probability: 35,
      },
      {
        id: "reward-007",
        name: "Free Shipping",
        description: "Free delivery on next order",
        type: "voucher",
        value: "Free",
        rarity: "epic",
        probability: 14,
      },
      {
        id: "reward-008",
        name: "50% Discount",
        description: "Half price on next purchase",
        type: "discount",
        value: "50%",
        rarity: "legendary",
        probability: 1,
      },
    ],
    revealMechanism: "spin",
    costToReveal: 50,
    maxClaims: 1000,
    currentClaims: 567,
    startDate: "2025-11-01",
    endDate: "2025-11-15",
    isActive: true,
    targetAudience: "loyalty_members",
    totalReveals: 567,
    successRate: 95,
  },
]

const mockMysteryReveals: MysteryReveal[] = [
  {
    id: "reveal-001",
    customerName: "Sarah Johnson",
    offerTitle: "Mystery Box November",
    rewardReceived: "Free Coffee",
    revealDate: "2025-11-06",
    pointsSpent: 100,
    rewardValue: "$5",
    rarity: "rare",
  },
  {
    id: "reveal-002",
    customerName: "Mike Chen",
    offerTitle: "Spin to Win",
    rewardReceived: "15% Discount",
    revealDate: "2025-11-05",
    pointsSpent: 50,
    rewardValue: "15%",
    rarity: "rare",
  },
  {
    id: "reveal-003",
    customerName: "Emily Davis",
    offerTitle: "Mystery Box November",
    rewardReceived: "$20 Gift Card",
    revealDate: "2025-11-04",
    pointsSpent: 100,
    rewardValue: "$20",
    rarity: "legendary",
  },
]

const typeLabels = {
  discount: "Discount",
  product: "Product",
  points: "Points",
  voucher: "Voucher",
  experience: "Experience",
}

const mechanismLabels = {
  instant: "Instant Reveal",
  spin: "Spin Wheel",
  scratch: "Scratch Card",
  box: "Mystery Box",
}

const rarityLabels = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
}

const rarityColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const rarityIcons = {
  common: <IconBox className="h-4 w-4" />,
  rare: <IconGift className="h-4 w-4" />,
  epic: <IconSparkles className="h-4 w-4" />,
  legendary: <IconAward className="h-4 w-4" />,
}

const mechanismIcons = {
  instant: <IconBolt className="h-4 w-4" />,
  spin: <IconSparkles className="h-4 w-4" />,
  scratch: <IconQuestionMark className="h-4 w-4" />,
  box: <IconBox className="h-4 w-4" />,
}

export default function MysteryOffersPage() {
  const [offers, setOffers] = useState<MysteryOffer[]>(mockMysteryOffers)
  const [reveals, setReveals] = useState<MysteryReveal[]>(mockMysteryReveals)
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("offers")

  const totalReveals = offers.reduce((sum, offer) => sum + offer.totalReveals, 0)
  const totalPointsSpent = reveals.reduce((sum, reveal) => sum + reveal.pointsSpent, 0)
  const averageSuccessRate = Math.round(offers.reduce((sum, offer) => sum + offer.successRate, 0) / offers.length)
  const legendaryClaims = reveals.filter(r => r.rarity === "legendary").length

  const getClaimProgress = (offer: MysteryOffer) => {
    if (offer.maxClaims === 0) return 0
    return Math.round((offer.currentClaims / offer.maxClaims) * 100)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mystery Offers</h2>
        <div className="flex items-center space-x-2">
          {activeTab === "offers" && (
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Create Mystery Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Mystery Offer</DialogTitle>
                  <DialogDescription>
                    Design an exciting mystery offer with multiple possible rewards.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="offer-title">Offer Title</Label>
                    <Input id="offer-title" placeholder="e.g., Mystery Box November" />
                  </div>
                  <div>
                    <Label htmlFor="offer-description">Description</Label>
                    <Input id="offer-description" placeholder="Describe the mystery offer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reveal-mechanism">Reveal Mechanism</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mechanism" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(mechanismLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cost-to-reveal">Cost to Reveal (Points)</Label>
                      <Input id="cost-to-reveal" type="number" placeholder="e.g., 100" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="max-claims">Max Claims</Label>
                      <Input id="max-claims" type="number" placeholder="e.g., 500" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsOfferDialogOpen(false)}>
                    Create Offer
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
            <CardTitle className="text-sm font-medium">Total Reveals</CardTitle>
            <IconQuestionMark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReveals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +67.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Spent</CardTitle>
            <IconBolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              On mystery reveals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legendary Wins</CardTitle>
            <IconAward className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legendaryClaims}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="offers">Active Offers</TabsTrigger>
          <TabsTrigger value="reveals">Recent Reveals</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <Card key={offer.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <Switch checked={offer.isActive} />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mechanismIcons[offer.revealMechanism]}
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{typeLabels[offer.type]}</Badge>
                  </div>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Cost to Reveal</Label>
                      <div className="flex items-center gap-1">
                        <IconBolt className="h-3 w-3" />
                        <span className="font-medium">{offer.costToReveal} points</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Progress</Label>
                      <div className="space-y-1">
                        <div className="text-sm">{offer.currentClaims}/{offer.maxClaims}</div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${getClaimProgress(offer)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Possible Rewards</Label>
                    <div className="space-y-2 mt-1">
                      {offer.possibleRewards.slice(0, 3).map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {rarityIcons[reward.rarity]}
                            <span>{reward.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={rarityColors[reward.rarity]} variant="outline">
                              {rarityLabels[reward.rarity]}
                            </Badge>
                            <span className="text-muted-foreground">{reward.probability}%</span>
                          </div>
                        </div>
                      ))}
                      {offer.possibleRewards.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{offer.possibleRewards.length - 3} more rewards
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Duration</Label>
                      <div>{offer.startDate} - {offer.endDate}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Performance</Label>
                      <div className="flex items-center gap-1">
                        <IconTrendingUp className="h-3 w-3" />
                        <span>{offer.successRate}% success</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm">
                      <IconEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reveals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Mystery Reveals</CardTitle>
              <CardDescription>
                Track what customers have discovered in mystery offers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>Reward Received</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>Points Spent</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Reveal Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reveals.map((reveal) => (
                    <TableRow key={reveal.id}>
                      <TableCell className="font-medium">{reveal.customerName}</TableCell>
                      <TableCell>{reveal.offerTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconGift className="h-4 w-4 text-blue-500" />
                          <span>{reveal.rewardReceived}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rarityIcons[reveal.rarity]}
                          <Badge className={rarityColors[reveal.rarity]}>
                            {rarityLabels[reveal.rarity]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconBolt className="h-3 w-3 text-yellow-500" />
                          <span>{reveal.pointsSpent}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{reveal.rewardValue}</TableCell>
                      <TableCell>{reveal.revealDate}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}