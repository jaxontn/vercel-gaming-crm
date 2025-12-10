"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, Home, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function QRUsedPage() {
  const [usageInfo, setUsageInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you might get the QR info from URL params
    // For now, we'll show a generic message
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">QR Code Already Used</CardTitle>
          <CardDescription className="text-lg">
            This QR code has already been scanned and used
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">What happened?</p>
                <p>This QR code was designed for one-time use only and has already been claimed.</p>
              </div>
            </div>
          </div>

          {usageInfo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used on:</span>
                <span className="font-medium">{new Date(usageInfo.usedAt).toLocaleString()}</span>
              </div>
              {usageInfo.gameName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Game played:</span>
                  <span className="font-medium">{usageInfo.gameName}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Badge variant="secondary" className="w-full justify-center py-2">
              Limited Offer
            </Badge>

            <p className="text-sm text-center text-gray-600">
              Keep an eye out for new QR codes and special promotions from this merchant!
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Visit Store Front
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
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Help
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Having trouble? Contact customer support for assistance
          </p>
        </CardContent>
      </Card>
    </div>
  )
}