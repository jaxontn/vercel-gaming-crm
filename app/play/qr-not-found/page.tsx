"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchX, AlertCircle, Home, ArrowLeft, RefreshCw, Camera } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QRNotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">QR Code Not Found</CardTitle>
          <CardDescription className="text-lg">
            This QR code is invalid or doesn't exist
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">What's wrong?</p>
                <p>The QR code you scanned is not recognized by our system. This could mean:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>The QR code is from a different promotion</li>
                  <li>The code has been damaged or altered</li>
                  <li>It's not a valid promotional QR code</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Badge variant="destructive" className="w-full justify-center py-2">
              Invalid QR Code
            </Badge>

            <p className="text-sm text-center text-gray-600">
              Please check that you're scanning the correct QR code from a legitimate source
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Tips for Scanning
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure good lighting when scanning</li>
              <li>• Hold your camera steady</li>
              <li>• Make sure the entire QR code is visible</li>
              <li>• Clean the QR code if it's on a physical surface</li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Still having trouble? We're here to help!
            </p>
            <div className="flex justify-center space-x-2">
              <Button asChild variant="link" size="sm">
                <Link href="/support">Contact Support</Link>
              </Button>
              <span className="text-gray-300">•</span>
              <Button asChild variant="link" size="sm">
                <Link href="/faq">FAQ</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}