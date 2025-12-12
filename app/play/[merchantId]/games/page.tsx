"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  IconTrophy,
  IconUsers,
  IconStar,
  IconCoin,
  IconSparkles,
  IconTarget,
  IconDeviceGamepad,
  IconDice3,
  IconPuzzle,
  IconBrandInstagram,
  IconArrowLeft
} from "@tabler/icons-react"

interface Game {
  id: string
  name: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  plays: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface PlayerData {
  name: string
  phone: string
  instagram?: string
  merchantId: string
  timestamp: string
  totalPoints: number
  gamesPlayed: string[]
}

const games: Game[] = [
  {
    id: "spin-wheel",
    name: "Spin & Win",
    description: "Spin the wheel to win instant prizes and points!",
    difficulty: "Easy",
    points: 10,
    plays: 2847,
    icon: <IconSparkles className="w-8 h-8" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    id: "memory-cards",
    name: "Memory Match",
    description: "Test your memory with this classic card matching game.",
    difficulty: "Medium",
    points: 25,
    plays: 1523,
    icon: <IconPuzzle className="w-8 h-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    id: "lucky-dice",
    name: "Lucky Dice",
    description: "Roll the dice and try your luck to win big points!",
    difficulty: "Easy",
    points: 15,
    plays: 3421,
    icon: <IconDice3 className="w-8 h-8" />,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    id: "quick-tap",
    name: "Quick Tap Challenge",
    description: "How fast can you tap? Test your reflexes!",
    difficulty: "Hard",
    points: 50,
    plays: 892,
    icon: <IconTarget className="w-8 h-8" />,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  {
    id: "word-puzzle",
    name: "Word Puzzle",
    description: "Unscramble words and test your vocabulary skills!",
    difficulty: "Medium",
    points: 30,
    plays: 1201,
    icon: <IconDeviceGamepad className="w-8 h-8" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
  },
  {
    id: "color-match",
    name: "Color Match",
    description: "Match the colors quickly to score points!",
    difficulty: "Easy",
    points: 20,
    plays: 2156,
    icon: <IconCoin className="w-8 h-8" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
  }
]

export default function GameGallery() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const playerId = searchParams.get("player")
  const merchantId = searchParams.get("merchantId") || "bella-boutique"

  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  useEffect(() => {
    if (playerId) {
      // Clean the player ID by trimming whitespace
      const cleanPlayerId = playerId.trim()
      //console.log('Original playerId:', `"${playerId}"`)
      //console.log('Clean playerId:', `"${cleanPlayerId}"`)

      // Try multiple possible keys for player data
      const possibleKeys = [
        `player_${cleanPlayerId}`,
        `player_+${cleanPlayerId}`, // In case the + was stripped
        `player_${encodeURIComponent(cleanPlayerId)}`, // URL encoded version
        `player_${encodeURIComponent(playerId)}`, // Original encoded version
      ]

      let stored = null
      let foundKey = null

      for (const key of possibleKeys) {
        stored = localStorage.getItem(key)
        if (stored) {
          foundKey = key
          break
        }
      }

      if (stored) {
        try {
          const data = JSON.parse(stored)
          // Ensure the data has all required properties with defaults
          const completePlayerData: PlayerData = {
            ...data,
            totalPoints: data.totalPoints || 0,
            gamesPlayed: data.gamesPlayed || []
          }
          setPlayerData(completePlayerData)
          //console.log(`Found player data with key: ${foundKey}`)
        } catch (error) {
          console.error('Error parsing player data:', error)
        }
      } else {
        console.error(`No player data found for ID: ${cleanPlayerId}`)
        //console.log('Tried keys:', possibleKeys)
        //console.log('Available localStorage keys:', Object.keys(localStorage).filter(k => k.startsWith('player_')))
      }
    }
  }, [playerId])

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
  }

  const handlePlayGame = (gameId: string) => {
    if (playerId) {
      router.push(`/play/${merchantId}/game/${gameId}?player=${playerId}`)
    }
  }

  const handleBackToMerchant = () => {
    router.push(`/play/${merchantId}`)
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 7) {
      return `XXX-XXX-${phone.slice(-4)}`
    }
    return phone
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  if (!playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

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
                onClick={handleBackToMerchant}
                className="p-2"
              >
                <IconArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Game Gallery
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hi, {playerData.name}! 👋
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <IconCoin className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {playerData.totalPoints || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Points
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Player Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {playerData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatPhoneNumber(playerData.phone)}
                </p>
                {playerData.instagram && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <IconBrandInstagram className="w-3 h-3" />
                    {playerData.instagram}
                  </p>
                )}
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  Level {Math.floor((playerData.totalPoints || 0) / 100) + 1}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {playerData.gamesPlayed?.length || 0} games played
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress to Next Level</span>
                <span className="text-gray-900 dark:text-white">
                  {((playerData.totalPoints || 0) % 100)}/100 XP
                </span>
              </div>
              <Progress value={((playerData.totalPoints || 0) % 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <IconDeviceGamepad className="w-5 h-5" />
            Choose Your Game
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <Card
                key={game.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedGame === game.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                onClick={() => handleGameSelect(game.id)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${game.bgColor} rounded-lg flex items-center justify-center ${game.color} mb-2`}>
                    {game.icon}
                  </div>
                  <CardTitle className="text-sm">{game.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <IconUsers className="w-3 h-3" />
                      {game.plays}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs mb-3">
                    {game.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <IconCoin className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {game.points}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayGame(game.id)
                      }}
                      className="text-xs"
                    >
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconTrophy className="w-4 h-4" />
              Top Players Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {[
                { rank: 1, name: "XXX-XXX-4567", points: 850 },
                { rank: 2, name: "XXX-XXX-1234", points: 720 },
                { rank: 3, name: "XXX-XXX-9999", points: 680 },
                { rank: 4, name: formatPhoneNumber(playerData.phone), points: playerData.totalPoints || 0 }
              ].map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-2 rounded ${player.name === formatPhoneNumber(playerData.phone)
                      ? 'bg-purple-100 dark:bg-purple-900/20'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${player.rank === 1 ? 'text-yellow-500' :
                        player.rank === 2 ? 'text-gray-400' :
                          player.rank === 3 ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                      #{player.rank}
                    </span>
                    <span className="text-xs text-gray-900 dark:text-white">
                      {player.name}
                    </span>
                    {player.name === formatPhoneNumber(playerData.phone) && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {player.points}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => router.push(`/play/${merchantId}/leaderboard?player=${playerId}`)}
            >
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}