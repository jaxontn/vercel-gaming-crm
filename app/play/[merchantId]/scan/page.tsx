'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QRScanner } from "@/components/qr-scanner"
import { ArrowLeft, QrCode, CheckCircle } from 'lucide-react'

export default function QRScanPage() {
  const params = useParams()
  const router = useRouter()
  const merchantId = params.merchantId as string
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleScanSuccess = async (qrValue: string) => {
    setScanResult(qrValue)
    setIsProcessing(true)

    // Check if this looks like a QR code from our system
    if (qrValue.startsWith('qr_')) {
      // Redirect to the QR registration page
      setTimeout(() => {
        router.push(`/play/qr-register/${qrValue}`)
      }, 1500)
    } else {
      // Handle other QR codes or show error
      setTimeout(() => {
        setIsProcessing(false)
        setScanResult(null)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Scan QR Code
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan a QR code to play a game
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                <QrCode className="w-3 h-3 mr-1" />
                QR Scanner
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {scanResult && isProcessing ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                QR Code Detected!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {scanResult.startsWith('qr_')
                  ? 'Redirecting to game...'
                  : 'This QR code is not recognized. Please scan a valid game QR code.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            merchantId={merchantId}
          />
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>1. Allow camera access when prompted</li>
              <li>2. Position the QR code within the frame</li>
              <li>3. Hold steady until the code is detected</li>
              <li>4. Wait for automatic redirect to the game</li>
            </ol>
            <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-purple-700 dark:text-purple-300">
                <strong>Note:</strong> Only QR codes from this gaming system are valid.
                Game QR codes start with "qr_"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}