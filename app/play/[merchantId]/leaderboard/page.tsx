"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  IconArrowLeft,
  IconTrophy,
  IconCoin,
  IconMedal,
  IconCrown,
  IconUsers,
  IconTarget,
  IconStar
} from "@tabler/icons-react"

interface PlayerData {
  name: string
  phone: string
  instagram?: string
  merchantId: string
  timestamp: string
  totalPoints: number
  gamesPlayed: string[]
  lastActive: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  phone: string
  totalPoints: number
  gamesPlayed: number
  instagram?: string
  lastActive: string
  isCurrentUser: boolean
}

// Mock leaderboard data (in production, this would come from your database)
const generateMockLeaderboard = (currentPlayerPhone: string): LeaderboardEntry[] => {
  const mockPlayers = [
    { phone: "5551234567", name: "Sarah Johnson", totalPoints: 2850, gamesPlayed: 45, instagram: "@sarahj" },
    { phone: "5559876543", name: "Mike Chen", totalPoints: 2720, gamesPlayed: 38, instagram: "@mikechen" },
    { phone: "5552468135", name: "Emma Davis", totalPoints: 2650, gamesPlayed: 42 },
    { phone: "5553692580", name: "James Wilson", totalPoints: 2580, gamesPlayed: 35, instagram: "@jwilson" },
    { phone: "5551472589", name: "Lisa Anderson", totalPoints: 2450, gamesPlayed: 33 },
    { phone: "5558529631", name: "Robert Taylor", totalPoints: 2380, gamesPlayed: 30 },
    { phone: "5557418529", name: "Maria Garcia", totalPoints: 2290, gamesPlayed: 28, instagram: "@mariag" },
    { phone: "5559632587", name: "David Brown", totalPoints: 2150, gamesPlayed: 25 },
    { phone: "5551597532", name: "Jennifer Martinez", totalPoints: 2080, gamesPlayed: 23 },
    { phone: "5557539514", name: "William Lee", totalPoints: 1950, gamesPlayed: 21 }
  ]

  // Add current player
  const currentPlayerEntry = {
    phone: currentPlayerPhone,
    name: "You",
    totalPoints: Math.floor(Math.random() * 1000) + 500,
    gamesPlayed: Math.floor(Math.random() * 20) + 5
  }

  const allPlayers = [...mockPlayers, currentPlayerEntry]

  // Sort by points
  allPlayers.sort((a, b) => b.totalPoints - a.totalPoints)

  // Assign ranks and format for display
  return allPlayers.map((player, index) => ({
    rank: index + 1,
    name: player.name,
    phone: player.phone,
    totalPoints: player.totalPoints,
    gamesPlayed: player.gamesPlayed,
    instagram: player.instagram,
    lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    isCurrentUser: player.phone === currentPlayerPhone
  }))
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const playerId = searchParams.get("player")
  const merchantId = searchParams.get("merchantId") || "bella-boutique"

  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "all">("all")

  useEffect(() => {
    if (playerId) {
      const stored = localStorage.getItem(`player_${playerId}`)
      if (stored) {
        const data = JSON.parse(stored)
        setPlayerData(data)

        // Generate mock leaderboard with current player
        const mockLeaderboard = generateMockLeaderboard(data.phone)
        setLeaderboard(mockLeaderboard)
      }
    }
  }, [playerId])

  const handleBackToGallery = () => {
    router.push(`/play/${merchantId}/games?player=${playerId}`)
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 7) {
      return `XXX-XXX-${phone.slice(-4)}`
    }
    return phone
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <IconMedal className="w-5 h-5 text-gray-400" />
      case 3:
        return <IconMedal className="w-5 h-5 text-orange-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case 2:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    }
  }

  if (!playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  const currentPlayerRank = leaderboard.find(player => player.isCurrentUser)?.rank
  const topPlayers = leaderboard.slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToGallery}
                className="p-2"
              >
                <IconArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <IconTrophy className="w-5 h-5" />
                  Leaderboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top players this season
                </p>
              </div>
            </div>
            {currentPlayerRank && (
              <div className="text-right">
                <Badge className={getRankBadgeColor(currentPlayerRank)}>
                  Rank #{currentPlayerRank}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your Position
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Player Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {playerData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatPhoneNumber(playerData.phone)}
                </p>
                {playerData.instagram && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    @{playerData.instagram}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <IconCoin className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {playerData.totalPoints || 0}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {playerData.gamesPlayed?.length || 0} games played
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Level Progress</span>
                <span className="text-gray-900 dark:text-white">
                  Level {Math.floor((playerData.totalPoints || 0) / 100) + 1}
                </span>
              </div>
              <Progress
                value={((playerData.totalPoints || 0) % 100)}
                className="h-2 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Players */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconCrown className="w-5 h-5 text-yellow-500" />
              Top Players
            </CardTitle>
            <CardDescription>
              The highest scoring players this season
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {topPlayers.slice(0, 3).map((player) => (
                <div
                  key={player.phone}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.isCurrentUser
                      ? 'bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(player.rank)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {player.name}
                        {player.isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPhoneNumber(player.phone)}
                      </p>
                      {player.instagram && (
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          @{player.instagram}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <IconCoin className="w-3 h-3 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {player.totalPoints}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {player.gamesPlayed} games
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconUsers className="w-5 h-5" />
              Full Rankings
            </CardTitle>
            <CardDescription>
              Complete player standings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {topPlayers.map((player) => (
                <div
                  key={player.phone}
                  className={`flex items-center justify-between p-2 rounded ${
                    player.isCurrentUser
                      ? 'bg-purple-100 dark:bg-purple-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold text-gray-600">
                      #{player.rank}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {player.name}
                        {player.isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPhoneNumber(player.phone)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <IconCoin className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {player.totalPoints}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {player.gamesPlayed} games
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <IconTarget className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {currentPlayerRank && currentPlayerRank <= 3
                ? `Amazing! You're in the top 3! 🏆`
                : currentPlayerRank && currentPlayerRank <= 10
                ? `Great job! You're in the top 10! ⭐`
                : `Keep playing to climb the leaderboard! 🎯`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}