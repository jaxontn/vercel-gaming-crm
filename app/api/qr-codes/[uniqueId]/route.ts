import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || 'http://localhost:8080'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueId: string }> }
) {
  try {
    const { uniqueId } = await params

    // Call the backend API directly through the qr-validate endpoint
    const response = await fetch(`${API_BASE}/v1/qr-validate.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uniqueId: uniqueId
      })
    })

    const responseData = await response.json()

    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('QR validation error:', error)

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    return new NextResponse(JSON.stringify({
      status: 'ERROR',
      message: 'Failed to validate QR code'
    }), {
      status: 500,
      headers
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}