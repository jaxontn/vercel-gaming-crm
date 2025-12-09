"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconQrcode, IconGift, IconTrophy, IconUser, IconPhone, IconBrandInstagram, AlertCircle } from "@tabler/icons-react"
import { callApi } from "@/lib/api-client"

interface PlayerData {
  id?: string
  name: string
  phone: string
  instagram?: string
  email?: string
}

interface CustomerInfo {
  id: string
  name: string
  phone: string
  email?: string
  instagram?: string
}

// Single merchant data (in production, this would come from your database/config)
const merchantData = {
  name: "Your Store",
  logo: "🏪",
  brandColor: "bg-purple-500"
}

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const merchantId = params.merchantId as string
  const qrCode = searchParams.get('qrCode')

  // For single merchant, use the same data regardless of the merchantId
  const merchant = merchantData
  const [isLoading, setIsLoading] = useState(false)
  const [showRegistration, setShowRegistration] = useState(true)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: "",
    phone: "",
    instagram: "",
    email: ""
  })

  // Check if customer info is already stored (from QR registration flow)
  useEffect(() => {
    if (qrCode) {
      const stored = localStorage.getItem('customerInfo');
      if (stored) {
        const info = JSON.parse(stored);
        setCustomerInfo(info);
        setPlayerData({
          name: info.name,
          phone: info.phone,
          instagram: info.instagram || '',
          email: info.email || ''
        });
        setShowRegistration(false);
      }
    }
  }, [qrCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let customerId: string;

      if (customerInfo?.id) {
        // Already have customer ID from QR registration
        customerId = customerInfo.id;
      } else {
        // Find or create customer
        const customerResponse = await callApi('POST', '/customers/find_by_phone', {
          phone: playerData.phone,
          merchantId: merchantId
        });

        if (customerResponse.status === 'SUCCESS' && customerResponse.data) {
          // Customer exists
          customerId = customerResponse.data.id;
        } else {
          // Create new customer
          const createResponse = await callApi('POST', '/customers/upsert', {
            merchantId: merchantId,
            name: playerData.name,
            phone: playerData.phone,
            email: playerData.email || '',
            instagram: playerData.instagram || ''
          });

          if (createResponse.status !== 'SUCCESS') {
            throw new Error(createResponse.message || 'Failed to create customer');
          }
          customerId = createResponse.data.id;
        }
      }

      // Store player data in localStorage
      const playerId = customerId || `${playerData.phone}_${Date.now()}`
      localStorage.setItem(`player_${playerId}`, JSON.stringify({
        id: playerId,
        ...playerData,
        merchantId,
        timestamp: new Date().toISOString()
      }))

      // Redirect to game gallery
      setTimeout(() => {
        router.push(`/play/${merchantId}/games?player=${playerId}${qrCode ? `&qrCode=${qrCode}` : ''}`)
      }, 1000)
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setIsLoading(false);
      // Show error message (you might want to add a toast notification here)
    }
  }

  const handleInputChange = (field: keyof PlayerData, value: string) => {
    setPlayerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${merchant.brandColor} rounded-lg flex items-center justify-center text-white text-lg`}>
                {merchant.logo}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {merchant.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Play & Win Rewards!
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              <IconQrcode className="w-3 h-3 mr-1" />
              Scan to Play
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {!showRegistration && customerInfo ? (
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                <IconTrophy />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {customerInfo.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to continue playing and winning more rewards?
            </p>
            {qrCode && (
              <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <IconQrcode className="inline w-4 h-4 mr-1" />
                  QR Code Scanned Successfully
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                <IconGift />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Play?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your details to unlock exclusive games and win amazing prizes!
            </p>
          </div>
        )}

        {showRegistration && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="w-5 h-5" />
                Player Information
              </CardTitle>
              <CardDescription>
                Your information helps us track your scores and prizes
              </CardDescription>
            </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={playerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <IconPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={playerData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used for leaderboard identification (XXX-XXX-1234)
                </p>
              </div>

              <div>
                <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                <div className="relative mt-1">
                  <IconBrandInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="@yourusername"
                    value={playerData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading || !playerData.name || !playerData.phone}
              >
                {isLoading ? (
                  "Loading Games..."
                ) : (
                  <>
                    <IconTrophy className="w-4 h-4 mr-2" />
                    Start Playing
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        )}

        {/* Play Button for QR users */}
        {!showRegistration && customerInfo && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading Games..."
                ) : (
                  <>
                    <IconTrophy className="w-4 h-4 mr-2" />
                    Continue Playing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 text-lg mx-auto mb-2">
              🎮
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">Fun Games</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center text-pink-600 dark:text-pink-400 text-lg mx-auto mb-2">
              🏆
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">Leaderboard</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg mx-auto mb-2">
              🎁
            </div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">Prizes</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          By playing, you agree to participate in {merchant.name}'s promotional campaign.
          <br />
          Your phone number will be partially displayed on leaderboards.
        </div>
      </div>
    </div>
  )
}