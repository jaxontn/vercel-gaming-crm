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
  IconBolt,
  IconClock,
  IconCurrencyDollar,
  IconShoppingCart,
  IconUsers,
  IconTrendingUp,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCalendar,
  IconTarget,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react"

interface FlashSale {
  id: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  originalPrice: number
  salePrice: number
  maxQuantity: number
  soldQuantity: number
  startTime: string
  endTime: string
  status: "draft" | "active" | "ended" | "cancelled"
  targetAudience: "all" | "vip" | "new_customers" | "loyalty_members"
  redemptionCode?: string
  totalRevenue: number
  participants: number
}

const mockFlashSales: FlashSale[] = [
  {
    id: "sale-001",
    title: "Flash Friday Special",
    description: "50% off on selected items for 3 hours only!",
    discountType: "percentage",
    discountValue: 50,
    originalPrice: 100,
    salePrice: 50,
    maxQuantity: 100,
    soldQuantity: 78,
    startTime: "2025-11-08 14:00",
    endTime: "2025-11-08 17:00",
    status: "active",
    targetAudience: "all",
    redemptionCode: "FLASH50",
    totalRevenue: 3900,
    participants: 234,
  },
  {
    id: "sale-002",
    title: "VIP Exclusive Deal",
    description: "Special $20 discount for VIP members only",
    discountType: "fixed",
    discountValue: 20,
    originalPrice: 80,
    salePrice: 60,
    maxQuantity: 50,
    soldQuantity: 35,
    startTime: "2025-11-07 10:00",
    endTime: "2025-11-07 20:00",
    status: "ended",
    targetAudience: "vip",
    redemptionCode: "VIP20",
    totalRevenue: 2100,
    participants: 89,
  },
  {
    id: "sale-003",
    title: "New Customer Welcome",
    description: "25% discount for first-time customers",
    discountType: "percentage",
    discountValue: 25,
    originalPrice: 60,
    salePrice: 45,
    maxQuantity: 200,
    soldQuantity: 0,
    startTime: "2025-11-09 09:00",
    endTime: "2025-11-09 18:00",
    status: "draft",
    targetAudience: "new_customers",
    redemptionCode: "WELCOME25",
    totalRevenue: 0,
    participants: 0,
  },
  {
    id: "sale-004",
    title: "Loyalty Member Monday",
    description: "Exclusive flash sale for loyalty program members",
    discountType: "percentage",
    discountValue: 30,
    originalPrice: 120,
    salePrice: 84,
    maxQuantity: 75,
    soldQuantity: 75,
    startTime: "2025-11-04 08:00",
    endTime: "2025-11-04 12:00",
    status: "ended",
    targetAudience: "loyalty_members",
    redemptionCode: "LOYAL30",
    totalRevenue: 6300,
    participants: 156,
  },
]

const statusLabels = {
  draft: "Draft",
  active: "Active",
  ended: "Ended",
  cancelled: "Cancelled",
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ended: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const audienceLabels = {
  all: "All Customers",
  vip: "VIP Members",
  new_customers: "New Customers",
  loyalty_members: "Loyalty Members",
}

const audienceColors = {
  all: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  vip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  new_customers: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  loyalty_members: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
}

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>(mockFlashSales)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAudience, setFilterAudience] = useState<string>("all")

  const filteredSales = flashSales.filter(sale => {
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus
    const matchesAudience = filterAudience === "all" || sale.targetAudience === filterAudience
    return matchesStatus && matchesAudience
  })

  const totalRevenue = flashSales.reduce((sum, sale) => sum + sale.totalRevenue, 0)
  const totalParticipants = flashSales.reduce((sum, sale) => sum + sale.participants, 0)
  const activeSalesCount = flashSales.filter(sale => sale.status === "active").length
  const averageDiscount = Math.round(
    flashSales.reduce((sum, sale) => sum + sale.discountValue, 0) / flashSales.length
  )

  const getSoldProgress = (sale: FlashSale) => {
    if (sale.maxQuantity === 0) return 0
    return Math.round((sale.soldQuantity / sale.maxQuantity) * 100)
  }

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const generateRedemptionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Flash Sales</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Create Flash Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Flash Sale</DialogTitle>
                <DialogDescription>
                  Set up a limited-time flash sale to drive urgency and sales.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sale-title">Sale Title</Label>
                  <Input id="sale-title" placeholder="e.g., Flash Friday Special" />
                </div>
                <div>
                  <Label htmlFor="sale-description">Description</Label>
                  <Input id="sale-description" placeholder="Describe the flash sale" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input id="discount-value" type="number" placeholder="e.g., 50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original-price">Original Price ($)</Label>
                    <Input id="original-price" type="number" placeholder="e.g., 100" />
                  </div>
                  <div>
                    <Label htmlFor="max-quantity">Max Quantity</Label>
                    <Input id="max-quantity" type="number" placeholder="e.g., 100" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="target-audience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(audienceLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="redemption-code">Redemption Code (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="redemption-code"
                      placeholder="e.g., FLASH50"
                      value={generateRedemptionCode()}
                    />
                    <Button variant="outline" type="button">
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Create Flash Sale
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +45.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
            <IconBolt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSalesCount}</div>
            <p className="text-xs text-muted-foreground">
              {flashSales.length} total sales
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
              +32.7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDiscount}%</div>
            <p className="text-xs text-muted-foreground">
              Average discount rate
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAudience} onValueChange={setFilterAudience}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                {Object.entries(audienceLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Flash Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Flash Sales Campaigns</CardTitle>
          <CardDescription>
            Manage your flash sales and track their performance in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target Audience</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.title}</div>
                      <div className="text-sm text-muted-foreground">{sale.description}</div>
                      {sale.redemptionCode && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Code: <code className="bg-muted px-1 rounded">{sale.redemptionCode}</code>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[sale.status]}>
                      {statusLabels[sale.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={audienceColors[sale.targetAudience]}>
                      {audienceLabels[sale.targetAudience]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">${sale.salePrice}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${sale.originalPrice}
                        </span>
                      </div>
                      <div className="text-sm text-green-600">
                        {sale.discountType === "percentage" ? `${sale.discountValue}%` : `$${sale.discountValue}`} off
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{sale.soldQuantity}/{sale.maxQuantity}</span>
                        <span>{getSoldProgress(sale)}%</span>
                      </div>
                      <Progress value={getSoldProgress(sale)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IconClock className="h-3 w-3" />
                      <span className="text-sm">{getTimeRemaining(sale.endTime)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <IconUsers className="h-3 w-3" />
                        <span>{sale.participants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconCurrencyDollar className="h-3 w-3" />
                        <span>${sale.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
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
    </div>
  )
}