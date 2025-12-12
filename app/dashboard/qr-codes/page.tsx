"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
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
  IconDots,
  IconLoader2,
  IconToggleLeft,
  IconToggleRight
} from "@tabler/icons-react"
import {
  getQRCampaigns,
  createQRCampaign,
  generateQRCode,
  deleteQRCampaign,
  getMerchantGames
} from "@/lib/api-client"

interface Game {
  id: string
  game_name: string
  game_code: string
  icon: string
  category: string
}

interface QRCampaign {
  id: string
  name: string
  description: string
  qr_url: string
  total_scans?: number
  unique_scans?: number
  total_participants?: number
  current_uses?: number
  max_uses?: number
  is_one_time_use?: boolean
  game_id?: string
  game_name?: string
  game_icon?: string
  status: "active" | "paused" | "expired" | "draft"
  created_at: string
  created_by?: string
  start_date?: string
  end_date?: string
  campaign_type?: string
  budget?: number
  total_spent?: number
  qr_code_image?: string
}

export default function QRCodesPage() {
  const { user, getMerchantId } = useAuth()
  const [campaigns, setCampaigns] = useState<QRCampaign[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    game_id: "",
    is_one_time_use: true,
    max_uses: 1,
    location: "",
    expires_at: ""
  })

  // Load QR campaigns
  useEffect(() => {
    //console.log('QR Codes useEffect - user:', user)
    //console.log('User keys:', user ? Object.keys(user) : 'No user')

    const merchantId = getMerchantId();
    //console.log('Merchant ID from helper:', merchantId)

    // Only load data if user is authenticated and has a merchant ID
    if (user && merchantId) {
      //console.log('User is authenticated with merchant ID, loading data...')
      loadQRCampaigns()
      loadMerchantGames()
    } else {
      //console.log('User not authenticated or missing merchantId')
      //console.log('SessionStorage contents:')
      //console.log('  - id:', sessionStorage.getItem('id'))
      //console.log('  - session_secret exists:', !!sessionStorage.getItem('session_secret'))
      //console.log('  - user_data:', sessionStorage.getItem('user_data'))
      setIsLoading(false)
    }
  }, [user, getMerchantId])

  const loadQRCampaigns = async () => {
    try {
      setIsLoading(true)
      const response = await getQRCampaigns()
      //console.log('QR campaigns response:', response)
      //console.log('Response type:', typeof response)
      //console.log('Response keys:', Object.keys(response || {}))

      // Check if response is valid and has status
      if (response && typeof response === 'object' && response.status === 'SUCCESS') {
        setCampaigns(response.data || [])
      } else {
        console.error('Invalid response format:', response)
        console.error('Expected: {status: "SUCCESS", data: [...]}')
        console.error('Got:', response)
        // Set empty array to prevent crashes
        setCampaigns([])
      }
    } catch (error) {
      console.error('Failed to load QR campaigns:', error)
      // Set empty array to prevent crashes
      setCampaigns([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMerchantGames = async () => {
    try {
      //console.log('Loading merchant games...')
      const response = await getMerchantGames()
      //console.log('Merchant games response:', response)
      //console.log('Response type:', typeof response)
      //console.log('Response keys:', Object.keys(response || {}))

      // Check if response is valid and has status
      if (response && typeof response === 'object' && response.status === 'SUCCESS') {
        // merchant_games API returns data.games array
        const gamesData = response.data?.games || response.data || []
        //console.log('Games data:', gamesData)
        setGames(gamesData)
      } else {
        console.error('Invalid response format:', response)
        console.error('Expected: {status: "SUCCESS", data: {games: [...]}}')
        console.error('Got:', response)
        // Set empty array if API fails
        setGames([])
      }
    } catch (error) {
      console.error('Failed to load games:', error)
      // Set empty array if API fails
      setGames([])
    }
  }

  const handleCreateQRCode = async () => {
    try {
      // Create campaign first
      const createResponse = await createQRCampaign({
        name: newCampaign.name,
        description: newCampaign.description,
        gameId: newCampaign.game_id,
        isOneTimeUse: newCampaign.is_one_time_use,
        maxUses: newCampaign.is_one_time_use ? 1 : newCampaign.max_uses,
        campaignType: 'game_promotion',
        location: newCampaign.location,
        expiresAt: newCampaign.expires_at
      })

      if (createResponse.status === 'SUCCESS') {
        const campaignId = createResponse.data.id

        // Generate QR code for the campaign
        setIsGeneratingQR(true)
        const qrResponse = await generateQRCode(campaignId)

        if (qrResponse.status === 'SUCCESS') {
          // Reload campaigns to get updated list
          await loadQRCampaigns()

          // Reset form
          setNewCampaign({
            name: "",
            description: "",
            game_id: "",
            is_one_time_use: true,
            max_uses: 1,
            location: "",
            expires_at: ""
          })
          setIsCreateDialogOpen(false)
        }
      }
    } catch (error) {
      console.error('Failed to create QR code:', error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleCopyQRUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // In production, you'd show a toast notification here
    alert('QR URL copied to clipboard!')
  }

  const handleDownloadQR = (campaign: QRCampaign) => {
    // Use the qr_url from the campaign
    const qrUrl = campaign.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('http://localhost:3000/play/default')}`
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-${campaign.id}.png`
    link.click()
  }

  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this QR campaign?')) {
      try {
        await deleteQRCampaign(id)
        await loadQRCampaigns()
      } catch (error) {
        console.error('Failed to delete campaign:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateConversionRate = (campaign: QRCampaign) => {
    // We need conversions data - for now using a placeholder calculation
    const uniqueScans = campaign.unique_scans || 0
    const conversions = Math.floor(uniqueScans * 0.3) // Placeholder: 30% conversion
    return uniqueScans > 0 ? Math.round((conversions / uniqueScans) * 100) : 0
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
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
          <DialogContent className="max-w-md">
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
                <Label htmlFor="game-select">Select Game</Label>
                <Select value={newCampaign.game_id} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, game_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a game for this QR code" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {game.icon === 'spinner' ? '🎰' :
                              game.icon === 'brain' ? '🧠' :
                                game.icon === 'dice' ? '🎲' :
                                  game.icon === 'hand-pointer' ? '👆' :
                                    game.icon === 'book' ? '📚' :
                                      game.icon === 'palette' ? '🎨' :
                                        '🎮'}
                          </span>
                          <span>{game.game_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usage-type">Usage Type</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="button"
                    variant={newCampaign.is_one_time_use ? "default" : "outline"}
                    onClick={() => setNewCampaign(prev => ({ ...prev, is_one_time_use: true, max_uses: 1 }))}
                    className="flex items-center gap-2"
                  >
                    <IconToggleRight className="w-4 h-4" />
                    One-time Use
                  </Button>
                  <Button
                    type="button"
                    variant={!newCampaign.is_one_time_use ? "default" : "outline"}
                    onClick={() => setNewCampaign(prev => ({ ...prev, is_one_time_use: false }))}
                    className="flex items-center gap-2"
                  >
                    <IconToggleLeft className="w-4 h-4" />
                    Multi-use
                  </Button>
                </div>
              </div>
              {!newCampaign.is_one_time_use && (
                <div>
                  <Label htmlFor="max-uses">Maximum Uses</Label>
                  <Input
                    id="max-uses"
                    type="number"
                    min="1"
                    value={newCampaign.max_uses}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, max_uses: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              )}
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
                  value={newCampaign.expires_at}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateQRCode}
                disabled={!newCampaign.name || !newCampaign.game_id || isGeneratingQR}
              >
                {isGeneratingQR ? (
                  <>
                    <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Create QR Code'
                )}
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
              Total campaigns created
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
              {campaigns.reduce((sum, c) => sum + (c.total_scans || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {campaigns.reduce((sum, c) => sum + (c.unique_scans || 0), 0).toLocaleString()} unique scans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Codes Used</CardTitle>
            <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + (c.current_uses || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total usage count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Usage Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0
                ? Math.round(
                  campaigns.reduce((sum, c) => sum + calculateConversionRate(c), 0) / campaigns.length
                )
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on available data
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
                <TableHead>Participants</TableHead>
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
                        {campaign.campaign_type || 'QR Campaign'}
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
                      <div className="font-medium">{campaign.total_scans || 0}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.unique_scans || 0} unique
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {campaign.total_participants || 0}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Participants
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(campaign.created_at)}
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
                        <DropdownMenuItem onClick={() => handleCopyQRUrl(campaign.qr_url || '')}>
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