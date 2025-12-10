"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarX, AlertCircle, Home, Phone, MessageSquare, Gift } from "lucide-react"
import Link from "next/link"

export default function QRExpiredPage() {
  const [campaignInfo, setCampaignInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you might get the campaign info from URL params
    // For now, we'll show a generic message
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarX className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">QR Code Expired</CardTitle>
          <CardDescription className="text-lg">
            This QR code promotion has ended
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Promotion ended</p>
                <p>This QR code was valid for a limited time and has now expired.</p>
              </div>
            </div>
          </div>

          {campaignInfo && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Campaign:</span>
                <span className="font-medium">{campaignInfo.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expired on:</span>
                <span className="font-medium">{new Date(campaignInfo.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3 mb-2">
              <Gift className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">New Promotions Available!</h3>
            </div>
            <p className="text-sm text-purple-700">
              Check out our latest offers and promotions. There are more exciting ways to win!
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Current Promotions
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="tel:+1234567890">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Store
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link href="/newsletter">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Updates
                </Link>
              </Button>
            </div>

            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/promotions">
                View All Active Campaigns
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Don't miss out on future promotions!
            </p>
            <Badge variant="outline" className="text-xs">
              New promotions weekly
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}