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
  IconDatabase,
  IconDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconDots,
  IconSearch,
  IconFilter,
  IconUser,
  IconPhone,
  IconBrandInstagram,
  IconCalendar,
  IconTrendingUp,
  IconMail,
  IconPlus,
  IconFileExport
} from "@tabler/icons-react"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  instagram?: string
  joinDate: string
  lastActive: string
  totalPoints: number
  level: number
  gamesPlayed: number
  campaignsParticipated: number
  status: "active" | "inactive" | "vip"
  source: string
}

const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Sarah Johnson",
    phone: "555-123-4567",
    email: "sarah.j@email.com",
    instagram: "@sarahj",
    joinDate: "2025-06-01",
    lastActive: "2025-11-06",
    totalPoints: 2450,
    level: 24,
    gamesPlayed: 89,
    campaignsParticipated: 5,
    status: "vip",
    source: "QR Code - Summer Spin"
  },
  {
    id: "cust-002",
    name: "Mike Chen",
    phone: "555-234-5678",
    email: "mike.chen@email.com",
    instagram: "@mikec",
    joinDate: "2025-06-15",
    lastActive: "2025-11-05",
    totalPoints: 1890,
    level: 18,
    gamesPlayed: 67,
    campaignsParticipated: 4,
    status: "active",
    source: "QR Code - Store Front"
  },
  {
    id: "cust-003",
    name: "Emily Davis",
    phone: "555-345-6789",
    email: "emily.davis@email.com",
    instagram: "@emilyd",
    joinDate: "2025-07-01",
    lastActive: "2025-11-04",
    totalPoints: 3200,
    level: 32,
    gamesPlayed: 112,
    campaignsParticipated: 6,
    status: "vip",
    source: "Social Media Contest"
  },
  {
    id: "cust-004",
    name: "James Wilson",
    phone: "555-456-7890",
    email: "",
    instagram: "@jwilson",
    joinDate: "2025-07-10",
    lastActive: "2025-10-28",
    totalPoints: 650,
    level: 6,
    gamesPlayed: 23,
    campaignsParticipated: 2,
    status: "active",
    source: "Referral Program"
  },
  {
    id: "cust-005",
    name: "Lisa Anderson",
    phone: "555-567-8901",
    email: "lisa.a@email.com",
    instagram: "",
    joinDate: "2025-08-01",
    lastActive: "2025-11-06",
    totalPoints: 1450,
    level: 14,
    gamesPlayed: 45,
    campaignsParticipated: 3,
    status: "active",
    source: "Email Capture"
  },
  {
    id: "cust-006",
    name: "David Brown",
    phone: "555-678-9012",
    email: "david.b@email.com",
    instagram: "@davidb",
    joinDate: "2025-05-15",
    lastActive: "2025-09-15",
    totalPoints: 890,
    level: 8,
    gamesPlayed: 31,
    campaignsParticipated: 3,
    status: "inactive",
    source: "QR Code - Store Front"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  vip: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
}

export default function CustomerDataPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<string>("csv")

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (customer.instagram && customer.instagram.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesSource = sourceFilter === "all" || customer.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const uniqueSources = Array.from(new Set(customers.map(c => c.source)))

  const handleExportData = () => {
    // In a real implementation, this would generate and download the file
    console.log(`Exporting data as ${exportFormat}`)
    setIsExportDialogOpen(false)
  }

  const getLastActiveDays = (lastActive: string) => {
    const date = new Date(lastActive)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customer Data</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <IconFileExport className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Customer Data</DialogTitle>
                <DialogDescription>
                  Choose the format for your customer data export.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Export will include:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Customer contact information</li>
                    <li>Engagement metrics</li>
                    <li>Campaign participation history</li>
                    <li>Points and level data</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportData}>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export Data
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <IconDatabase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === "vip").length}
            </div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Points</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(customers.reduce((sum, c) => sum + c.totalPoints, 0) / customers.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
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
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            View and manage all customer data collected through your campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <IconPhone className="w-3 h-3 text-muted-foreground" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <IconMail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                      )}
                      {customer.instagram && (
                        <div className="flex items-center gap-2">
                          <IconBrandInstagram className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{customer.instagram}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[customer.status]}>
                      {customer.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Level {customer.level}</div>
                      <div className="text-muted-foreground">{customer.gamesPlayed} games</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.totalPoints.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.campaignsParticipated} campaigns
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-[150px] truncate">
                      {customer.source}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getLastActiveDays(customer.lastActive)} days ago
                    </div>
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
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete Customer
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