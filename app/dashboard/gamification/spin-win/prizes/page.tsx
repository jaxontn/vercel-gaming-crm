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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconGift,
  IconSettings,
  IconAlertTriangle,
  IconTrophy,
  IconCoins
} from "@tabler/icons-react"

interface Prize {
  id: string
  label: string
  value: number
  probability: number
  color: string
  quantity: number
  claimed: number
  category: "points" | "physical" | "digital" | "discount"
  description?: string
  imageUrl?: string
}

const mockPrizes: Prize[] = [
  {
    id: "1",
    label: "10 Points",
    value: 10,
    probability: 35,
    color: "#10B981",
    quantity: 1000,
    claimed: 342,
    category: "points",
    description: "Small reward bonus"
  },
  {
    id: "2",
    label: "25 Points",
    value: 25,
    probability: 25,
    color: "#3B82F6",
    quantity: 500,
    claimed: 189,
    category: "points",
    description: "Medium reward bonus"
  },
  {
    id: "3",
    label: "50 Points",
    value: 50,
    probability: 15,
    color: "#8B5CF6",
    quantity: 200,
    claimed: 87,
    category: "points",
    description: "Large reward bonus"
  },
  {
    id: "4",
    label: "10% Discount",
    value: 0,
    probability: 10,
    color: "#F59E0B",
    quantity: 100,
    claimed: 45,
    category: "discount",
    description: "10% off next purchase"
  },
  {
    id: "5",
    label: "Try Again",
    value: 0,
    probability: 10,
    color: "#EF4444",
    quantity: 999999,
    claimed: 123,
    category: "points",
    description: "No prize this time"
  },
  {
    id: "6",
    label: "Mystery Box",
    value: 150,
    probability: 5,
    color: "#EC4899",
    quantity: 50,
    claimed: 12,
    category: "digital",
    description: "Special surprise reward"
  }
]

const categoryIcons = {
  points: IconCoins,
  physical: IconGift,
  digital: IconTrophy,
  discount: IconSettings
}

const categoryColors = {
  points: "bg-green-100 text-green-800",
  physical: "bg-blue-100 text-blue-800",
  digital: "bg-purple-100 text-purple-800",
  discount: "bg-amber-100 text-amber-800"
}

export default function SpinWinPrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>(mockPrizes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    probability: "",
    color: "#10B981",
    quantity: "",
    category: "points" as Prize["category"],
    description: ""
  })

  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)

  const handleEdit = (prize: Prize) => {
    setEditingPrize(prize)
    setFormData({
      label: prize.label,
      value: prize.value.toString(),
      probability: prize.probability.toString(),
      color: prize.color,
      quantity: prize.quantity.toString(),
      category: prize.category,
      description: prize.description || ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingPrize) {
      setPrizes(prizes.map(p =>
        p.id === editingPrize.id
          ? {
              ...p,
              label: formData.label,
              value: parseInt(formData.value) || 0,
              probability: parseInt(formData.probability) || 0,
              color: formData.color,
              quantity: parseInt(formData.quantity) || 0,
              category: formData.category,
              description: formData.description
            }
          : p
      ))
    } else {
      const newPrize: Prize = {
        id: Date.now().toString(),
        label: formData.label,
        value: parseInt(formData.value) || 0,
        probability: parseInt(formData.probability) || 0,
        color: formData.color,
        quantity: parseInt(formData.quantity) || 0,
        claimed: 0,
        category: formData.category,
        description: formData.description
      }
      setPrizes([...prizes, newPrize])
    }

    setFormData({
      label: "",
      value: "",
      probability: "",
      color: "#10B981",
      quantity: "",
      category: "points",
      description: ""
    })
    setEditingPrize(null)
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id))
  }

  const CategoryIcon = categoryIcons[formData.category]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prize Configuration</h2>
          <p className="text-muted-foreground">Manage prizes, rewards, and winning probabilities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Prize
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingPrize ? "Edit Prize" : "Add New Prize"}
              </DialogTitle>
              <DialogDescription>
                Configure the prize details and winning probability
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize-label">Prize Name</Label>
                  <Input
                    id="prize-label"
                    placeholder="e.g., 50 Points"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="prize-category">Category</Label>
                  <select
                    id="prize-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Prize["category"] }))}
                  >
                    <option value="points">Points</option>
                    <option value="discount">Discount</option>
                    <option value="physical">Physical Item</option>
                    <option value="digital">Digital Item</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize-value">Value</Label>
                  <Input
                    id="prize-value"
                    type="number"
                    placeholder="50"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Point value or discount percentage
                  </p>
                </div>
                <div>
                  <Label htmlFor="prize-probability">Probability (%)</Label>
                  <Input
                    id="prize-probability"
                    type="number"
                    placeholder="15"
                    value={formData.probability}
                    onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Chance of winning this prize
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize-quantity">Quantity Available</Label>
                  <Input
                    id="prize-quantity"
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank for unlimited
                  </p>
                </div>
                <div>
                  <Label htmlFor="prize-color">Wheel Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="prize-color"
                      type="color"
                      className="h-10 w-20"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="prize-description">Description</Label>
                <Input
                  id="prize-description"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {totalProbability > 100 && (
                <Alert>
                  <IconAlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Total probability exceeds 100%. Current total: {totalProbability}%
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                setEditingPrize(null)
                setFormData({
                  label: "",
                  value: "",
                  probability: "",
                  color: "#10B981",
                  quantity: "",
                  category: "points",
                  description: ""
                })
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.label || totalProbability > 100}>
                {editingPrize ? "Update" : "Add"} Prize
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prizes</CardTitle>
            <IconGift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prizes.length}</div>
            <p className="text-xs text-muted-foreground">
              Active prize segments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Probability</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProbability === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProbability}%
            </div>
            <p className="text-xs text-muted-foreground">
              {totalProbability === 100 ? 'Perfect balance' : 'Needs adjustment'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claimed</CardTitle>
            <IconCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prizes.reduce((sum, prize) => sum + prize.claimed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Prizes awarded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prizes.reduce((sum, prize) => sum + (prize.value * prize.claimed), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Points distributed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prize Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Prizes</CardTitle>
          <CardDescription>
            Configure prize segments and their probabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prize</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Claimed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prizes.map((prize) => {
                const CategoryIcon = categoryIcons[prize.category]
                const isOutOfStock = prize.quantity !== 999999 && prize.claimed >= prize.quantity

                return (
                  <TableRow key={prize.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: prize.color }}
                        />
                        <div>
                          <div className="font-medium">{prize.label}</div>
                          {prize.description && (
                            <div className="text-sm text-muted-foreground">
                              {prize.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={categoryColors[prize.category]}>
                        <CategoryIcon className="mr-1 h-3 w-3" />
                        {prize.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {prize.value > 0 ? `${prize.value} points` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={prize.probability > 20 ? "default" : "secondary"}>
                        {prize.probability}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {prize.quantity === 999999 ? 'Unlimited' : prize.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>{prize.claimed.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={isOutOfStock ? "destructive" : "default"}>
                        {isOutOfStock ? 'Out of Stock' : 'Available'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(prize)}
                        >
                          <IconEdit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prize.id)}
                        >
                          <IconTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}