'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Camera, CameraOff, QrCode } from 'lucide-react'

interface QRScannerProps {
  onScanSuccess: (qrValue: string) => void
  merchantId: string
}

export function QRScanner({ onScanSuccess, merchantId }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStartingCamera, setIsStartingCamera] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  // Check for camera support and HTTPS
  useEffect(() => {
    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported in this browser. Please try a modern browser like Chrome, Firefox, or Safari.')
      setHasPermission(false)
      return
    }

    // Check if running on HTTPS or localhost
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!isSecure) {
      setError('Camera access requires HTTPS. Please access this site via HTTPS or run on localhost.')
      setHasPermission(false)
    }
  }, [])

  // Start camera
  const startCamera = async () => {
    try {
      setError(null)
      setIsStartingCamera(true)

      console.log('Requesting camera access...')
      console.log('Video ref exists:', !!videoRef.current)

      // Set scanning to true to ensure video ref is rendered
      setHasPermission(true)
      setIsScanning(true)

      // Wait a tick for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100))

      if (!videoRef.current) {
        console.error('Video ref is still null after render!')
        throw new Error('Video element not found')
      }

      // Try different camera configurations
      const constraints = [
        // Try rear camera first
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Try any camera with lower resolution
        { video: { width: { ideal: 640 }, height: { ideal: 480 } } },
        // Last resort - any camera
        { video: true }
      ]

      let stream: MediaStream | null = null

      for (const constraint of constraints) {
        try {
          console.log('Trying constraints:', constraint)
          stream = await navigator.mediaDevices.getUserMedia(constraint)
          console.log('Camera access granted!')
          break
        } catch (err) {
          console.log('Failed with constraints:', constraint, err)
          continue
        }
      }

      if (!stream) {
        throw new Error('Could not access camera with any configuration')
      }

      // Store stream reference immediately
      streamRef.current = stream
      console.log('Stream stored, tracks:', stream.getTracks().length)

      // Assign stream to video with a small delay to ensure ref is mounted
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          console.log('Assigning stream to video...')

          // Safari specific: Assign attributes before srcObject
          videoRef.current.setAttribute('playsinline', 'true')
          videoRef.current.setAttribute('muted', 'true')
          videoRef.current.muted = true

          videoRef.current.srcObject = streamRef.current

          // Force load for Safari
          if (videoRef.current.load) {
            videoRef.current.load()
          }

          // Try to play with user gesture
          const tryPlay = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                console.log('Video started playing')
              }).catch(err => {
                console.error('Play failed:', err)
                // Safari might require user interaction
                if (err.name === 'NotAllowedError') {
                  setError('Safari requires you to tap the video to start. Please tap the black area.')
                }
              })
            }
          }

          tryPlay()
        }
      }, 100)

      setIsStartingCamera(false)

      // Start QR code scanning simulation after a delay
      setTimeout(() => {
        simulateQRScanning()
      }, 500)
    } catch (err) {
      setIsStartingCamera(false)
      console.error('Camera error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access to scan QR codes. Check the camera icon in your browser\'s address bar.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device. Please ensure you have a camera connected.')
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application. Please close other apps using the camera.')
        } else {
          setError('Failed to access camera: ' + err.message)
        }
      }
      setHasPermission(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  // Simulate QR scanning (replace with real QR scanning library)
  const simulateQRScanning = () => {
    // This is a placeholder - in production, integrate with a QR scanning library
    // For demo purposes, we'll show a message about manual QR entry

    // Simulate finding a QR after 3 seconds
    setTimeout(() => {
      // In real implementation, this would be triggered by actual QR detection
      // For now, we'll show a prompt for manual entry
      stopCamera()
    }, 3000)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleManualEntry = () => {
    const qrValue = prompt('Enter QR code value manually:')
    if (qrValue) {
      onScanSuccess(qrValue)
    }
  }

  if (hasPermission === false) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CameraOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <CardTitle>Camera Access Required</CardTitle>
          <CardDescription>
            {error || 'Camera permission is required to scan QR codes'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={startCamera} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={handleManualEntry} variant="outline" className="w-full">
            <QrCode className="w-4 h-4 mr-2" />
            Enter QR Code Manually
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Position the QR code within the frame to scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isScanning && hasPermission !== false && (
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 text-gray-400 mx-auto" />
              <Button onClick={startCamera} size="lg" className="w-full" disabled={isStartingCamera}>
                {isStartingCamera ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Starting Camera...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </>
                )}
              </Button>
              <Button onClick={handleManualEntry} variant="outline" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Enter QR Code Manually
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{
                    transform: 'scaleX(-1)',
                    backgroundColor: '#000'
                  }}
                  onPlay={() => console.log('Video is playing')}
                  onError={(e) => console.error('Video error:', e)}
                />
                {/* Clickable overlay for Safari */}
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => {
                    if (videoRef.current && videoRef.current.paused) {
                      console.log('User clicked video, attempting to play...')
                      videoRef.current.muted = true
                      videoRef.current.play().then(() => {
                        console.log('Video playing after user click')
                      }).catch(err => {
                        console.error('Still failed after user click:', err)
                      })
                    }
                  }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white rounded-lg opacity-75">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-0.5 bg-green-400 animate-pulse"></div>
                    <div className="h-48 w-0.5 bg-green-400 animate-pulse absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  {/* Safari tap instruction */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-center bg-black/50 px-4 py-2 rounded-lg">
                    <p className="text-sm">📱 Tap here to start camera</p>
                  </div>
                </div>
                {/* Debug overlay */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                  Debug: {videoRef.current ? 'Video ref exists' : 'No video ref'} |
                  Stream: {streamRef.current ? 'Active' : 'None'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
                <Button onClick={handleManualEntry} variant="outline" className="flex-1">
                  <QrCode className="w-4 h-4 mr-2" />
                  Manual Entry
                </Button>
              </div>
              <Button
                onClick={() => {
                  console.log('Video element:', videoRef.current);
                  console.log('Video readyState:', videoRef.current?.readyState);
                  console.log('Video srcObject:', videoRef.current?.srcObject);
                  console.log('Stream active:', streamRef.current?.active);
                  if (streamRef.current) {
                        console.log('Stream tracks:', streamRef.current.getTracks());
                        streamRef.current.getTracks().forEach(track => {
                            console.log('Track:', track.kind, track.label, track.readyState);
                        });
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Debug Stream Info
              </Button>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}