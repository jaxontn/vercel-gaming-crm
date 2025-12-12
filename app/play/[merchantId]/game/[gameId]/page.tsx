"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  IconTrophy,
  IconCoin,
  IconSparkles,
  IconRotateClockwise,
  IconGift,
  IconConfetti,
  IconDeviceGamepad2,
  IconBrandInstagram
} from "@tabler/icons-react"
import { MemoryMatch } from "@/components/games/memory-match"
import { LuckyDice } from "@/components/games/lucky-dice"
import { QuickTap } from "@/components/games/quick-tap"
import { WordPuzzle } from "@/components/games/word-puzzle"
import { ColorMatch } from "@/components/games/color-match"
import { callApi, publicMarkQRUsed, publicCheckQRStatus, trackGameCompletion } from "@/lib/api-client"

interface PlayerData {
  id?: string
  name: string
  phone: string
  instagram?: string
  email?: string
  merchantId: string
  timestamp: string
  totalPoints: number
  gamesPlayed: string[]
}

interface GameData {
  id: string
  name: string
  description: string
  points: number
  color: string
  bgColor: string
}

const games: Record<string, GameData> = {
  "spin-wheel": {
    id: "spin-wheel",
    name: "Spin & Win",
    description: "Spin the wheel to win instant prizes and points!",
    points: 10,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  "memory-cards": {
    id: "memory-cards",
    name: "Memory Match",
    description: "Test your memory with this classic card matching game.",
    points: 25,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  "lucky-dice": {
    id: "lucky-dice",
    name: "Lucky Dice",
    description: "Roll the dice and try your luck to win big points!",
    points: 15,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  "quick-tap": {
    id: "quick-tap",
    name: "Quick Tap Challenge",
    description: "How fast can you tap? Test your reflexes!",
    points: 50,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  },
  "word-puzzle": {
    id: "word-puzzle",
    name: "Word Puzzle",
    description: "Unscramble words and test your vocabulary skills!",
    points: 30,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
  },
  "color-match": {
    id: "color-match",
    name: "Color Match",
    description: "Match the colors quickly to score points!",
    points: 20,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
  }
}

const wheelPrizes = [
  { label: "10 Points", value: 10, color: "bg-purple-500", probability: 0.3 },
  { label: "25 Points", value: 25, color: "bg-blue-500", probability: 0.2 },
  { label: "50 Points", value: 50, color: "bg-green-500", probability: 0.15 },
  { label: "Try Again", value: 0, color: "bg-gray-400", probability: 0.25 },
  { label: "100 Points!", value: 100, color: "bg-yellow-500", probability: 0.08 },
  { label: "5 Points", value: 5, color: "bg-pink-500", probability: 0.02 }
]

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const merchantId = params.merchantId as string
  const qrCode = searchParams.get('qrCode')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now())

  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [lastWin, setLastWin] = useState<number | null>(null)
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0)
  const [hasSpun, setHasSpun] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [qrAlreadyUsed, setQrAlreadyUsed] = useState(false)
  const [qrStatusChecked, setQrStatusChecked] = useState(false)

  const game = games[gameId] || games["spin-wheel"]

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
    const playerParam = searchParams.get("player")
    setPlayerId(playerParam)

    // If player is a customer ID (from QR flow), try to get customer info
    if (playerParam && qrCode) {
      const customerInfo = localStorage.getItem('customerInfo')
      if (customerInfo) {
        const customer = JSON.parse(customerInfo)
        // If the player ID matches the customer ID, store player data with the correct format
        if (customer.id === playerParam) {
          const playerDataToStore = {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            instagram: customer.instagram || '',
            email: customer.email || '',
            merchantId: merchantId,
            timestamp: new Date().toISOString(),
            totalPoints: 0,
            gamesPlayed: []
          }
          localStorage.setItem(`player_${playerParam}`, JSON.stringify(playerDataToStore))
        }
      }
    }
  }, [searchParams, qrCode, merchantId])

  useEffect(() => {
    if (playerId && isClient) {
      const stored = localStorage.getItem(`player_${playerId}`)
      if (stored) {
        const data = JSON.parse(stored)
        setPlayerData(data)

        // Check how many times they've played this game today
        const today = new Date().toDateString()
        const todayKey = `${gameId}_${today}`
        const todayPlays = parseInt(localStorage.getItem(todayKey) || '0')
        setGamesPlayedToday(todayPlays)
        setHasSpun(todayPlays >= 3) // Limit to 3 spins per day
      }
    }
  }, [playerId, gameId, isClient])

  // Check QR status when page loads
  useEffect(() => {
    if (qrCode && isClient && !qrStatusChecked) {
      const checkQRStatus = async () => {
        try {
          const result = await publicCheckQRStatus(qrCode);
          if (result.status === 'SUCCESS') {
            if (result.data.isUsed) {
              setQrAlreadyUsed(true);
            } else if (playerData?.id) {
              // Mark as used if not already used
              await publicMarkQRUsed({
                uniqueId: qrCode,
                customerId: playerData.id!,
                playerInfo: {
                  name: playerData.name,
                  phone: playerData.phone,
                  email: playerData.email || '',
                  instagram: playerData.instagram || ''
                },
                pointsEarned: 0
              });
              console.log('QR code marked as used on page load');
            }
          }
          setQrStatusChecked(true);
        } catch (error) {
          console.error('Failed to check QR status:', error);
          setQrStatusChecked(true);
        }
      };

      checkQRStatus();
    }
  }, [qrCode, isClient, qrStatusChecked, playerData]);

  // Reset game start time when game changes
  useEffect(() => {
    setGameStartTime(Date.now());
  }, [gameId]);

  const handleGameTracking = async (pointsEarned: number, score?: number) => {
    if (!playerData?.id || !isClient) return;

    const duration = Math.floor((Date.now() - gameStartTime) / 1000);

    // snake_case conversion for game type
    const gameType = gameId.replace(/-/g, '_');

    const gameDataPayload = {
      customer_id: playerData.id,
      merchant_id: merchantId,
      game_id: `${gameId}_${Date.now()}`,
      game_type: gameType,
      points_earned: pointsEarned,
      session_duration: duration,
      score: score || pointsEarned * 10,
      completed_at: new Date().toISOString()
    };

    try {
      //console.log('Tracking game completion:', gameDataPayload);
      const result = await trackGameCompletion(gameDataPayload);

      if (result.success && result.data?.updated_stats) {
        //console.log('Game tracking success:', result.data);
        const updatedStats = result.data.updated_stats;

        // Update local state with server authoritative data
        setPlayerData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            totalPoints: updatedStats.total_points || prev.totalPoints,
            // Assuming games_played from server is the count, but we treat it as array in local
            gamesPlayed: [...(prev.gamesPlayed || []), gameId]
          };
        });

        // Also update local storage to persist the new total points
        const stored = localStorage.getItem(`player_${playerData.id}`);
        if (stored) {
          const data = JSON.parse(stored);
          data.totalPoints = updatedStats.total_points || data.totalPoints;
          data.gamesPlayed = [...(data.gamesPlayed || []), gameId];
          localStorage.setItem(`player_${playerData.id}`, JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Failed to track game:', error);
      // Fallback: We already updated local state optimistically in the calling functions
    }
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun || !isClient) return

    setIsSpinning(true)
    setLastWin(null)

    // Simulate wheel spin
    const spins = Math.floor(Math.random() * 5) + 5 // 5-10 full rotations
    const finalRotation = rotation + (spins * 360) + Math.random() * 360
    setRotation(finalRotation)

    // Determine prize based on final position
    setTimeout(() => {
      if (!isClient) return

      const normalizedRotation = finalRotation % 360
      const segmentAngle = 360 / wheelPrizes.length
      const prizeIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % wheelPrizes.length
      const prize = wheelPrizes[prizeIndex]

      setLastWin(prize.value)

      setLastWin(prize.value)

      // Update player points locally (optimistic)
      if (playerData) {
        const newTotalPoints = (playerData.totalPoints || 0) + prize.value
        const updatedData = {
          ...playerData,
          totalPoints: newTotalPoints,
          gamesPlayed: [...(playerData.gamesPlayed || []), gameId]
        }

        localStorage.setItem(`player_${playerId}`, JSON.stringify(updatedData))
        setPlayerData(updatedData)

        // API Tracking
        handleGameTracking(prize.value, prize.value * 10);
      }

      // Update daily play count
      const today = new Date().toDateString()
      const todayKey = `${gameId}_${today}`
      const newPlays = gamesPlayedToday + 1
      localStorage.setItem(todayKey, newPlays.toString())
      setGamesPlayedToday(newPlays)
      setHasSpun(newPlays >= 3)

      setIsSpinning(false)
      // Reset timer for next spin? Or maybe session is just one spin? 
      // Usually session is per game play.
      setGameStartTime(Date.now());
    }, 4000)
  }

  const handlePointsEarned = async (points: number) => {
    // Update player points
    if (playerData && isClient && playerId) {
      const newTotalPoints = (playerData.totalPoints || 0) + points
      const updatedData = {
        ...playerData,
        totalPoints: newTotalPoints,
        gamesPlayed: [...(playerData.gamesPlayed || []), gameId]
      }

      localStorage.setItem(`player_${playerId}`, JSON.stringify(updatedData))
      setPlayerData(updatedData)

      // API Tracking
      handleGameTracking(points);

      // Reset timer for next game
      setGameStartTime(Date.now());

      // QR code is already marked as used when page loads, no need to mark again here
    }
  }


  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 7) {
      return `XXX-XXX-${phone.slice(-4)}`
    }
    return phone
  }

  // Show a consistent loading state during hydration or QR status check
  if (!isClient || !playerData || (qrCode && !qrStatusChecked)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {qrCode && !qrStatusChecked ? 'Checking game status...' : 'Loading game...'}
          </p>
        </div>
      </div>
    )
  }

  // Show thank you message if QR was already used
  if (qrCode && qrAlreadyUsed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
              <IconTrophy />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Playing!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've already played this game. All games can only be played once per QR code.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <IconGift className="inline w-4 h-4 mr-1" />
                  Game: {game.name}
                </p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Player: {playerData.name}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {formatPhoneNumber(playerData.phone)}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/play/${merchantId}/scan`)}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Scan Another QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {game.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {game.description}
              </p>
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
        {/* Player Info */}
        {/*<Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {playerData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatPhoneNumber(playerData.phone)}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs mb-1">
                  Level {Math.floor((playerData.totalPoints || 0) / 100) + 1}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {gamesPlayedToday}/3 spins today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>*/}

        {/* Game Area - Spin Wheel */}
        {gameId === "spin-wheel" && (
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Spin the Wheel!</CardTitle>
              <CardDescription>
                Test your luck and win points! 🍀
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center">
                {/* Wheel */}
                <div className="relative mb-6">
                  <div className="w-64 h-64 relative">
                    {/* Wheel segments */}
                    <div
                      className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-4000 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {wheelPrizes.map((prize, index) => (
                        <div
                          key={index}
                          className={`absolute w-full h-full ${prize.color}`}
                          style={{
                            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((index * 360 / wheelPrizes.length - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((index * 360 / wheelPrizes.length - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos(((index + 1) * 360 / wheelPrizes.length - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((index + 1) * 360 / wheelPrizes.length - 90) * Math.PI / 180)}%)`,
                          }}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs"
                            style={{
                              transform: `rotate(${index * 360 / wheelPrizes.length + 360 / (2 * wheelPrizes.length)}deg)`,
                              transformOrigin: '50% 50%'
                            }}
                          >
                            <span style={{ transform: 'rotate(90deg)' }}>
                              {prize.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
                      <IconSparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-16 border-t-red-500 z-10"></div>
                  </div>
                </div>

                {/* Spin Button */}
                <Button
                  onClick={handleSpin}
                  disabled={isSpinning || hasSpun}
                  size="lg"
                  className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSpinning ? (
                    <>
                      <IconRotateClockwise className="w-4 h-4 mr-2 animate-spin" />
                      Spinning...
                    </>
                  ) : hasSpun ? (
                    <>
                      <IconTrophy className="w-4 h-4 mr-2" />
                      Come Back Tomorrow!
                    </>
                  ) : (
                    <>
                      <IconSparkles className="w-4 h-4 mr-2" />
                      Spin the Wheel ({3 - gamesPlayedToday} left)
                    </>
                  )}
                </Button>

                {/* Result */}
                {lastWin !== null && (
                  <div className={`p-4 rounded-lg text-center ${lastWin > 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                    {lastWin > 0 ? (
                      <>
                        <IconConfetti className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          You won {lastWin} points! 🎉
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                          Try again next time! 🍀
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Memory Match Game */}
        {gameId === "memory-cards" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Memory Match</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg">
              <MemoryMatch
                onPointsEarned={handlePointsEarned}
                playerName={playerData.name}
              />
            </div>
          </div>
        )}

        {/* Lucky Dice Game */}
        {gameId === "lucky-dice" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Lucky Dice</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg">
              <LuckyDice
                onPointsEarned={handlePointsEarned}
                playerName={playerData.name}
              />
            </div>
          </div>
        )}

        {/* Quick Tap Challenge */}
        {gameId === "quick-tap" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Quick Tap Challenge</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg">
              <QuickTap
                onPointsEarned={handlePointsEarned}
                playerName={playerData.name}
              />
            </div>
          </div>
        )}

        {/* Word Puzzle */}
        {gameId === "word-puzzle" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Word Puzzle</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg">
              <WordPuzzle
                onPointsEarned={handlePointsEarned}
                playerName={playerData.name}
              />
            </div>
          </div>
        )}

        {/* Color Match */}
        {gameId === "color-match" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Color Match</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-lg">
              <ColorMatch
                onPointsEarned={handlePointsEarned}
                playerName={playerData.name}
              />
            </div>
          </div>
        )}

        {/* Placeholder for other games */}
        {gameId !== "spin-wheel" && gameId !== "memory-cards" && gameId !== "lucky-dice" && gameId !== "quick-tap" && gameId !== "word-puzzle" && gameId !== "color-match" && (
          <div className="mb-6">
            {/* Game Header with Player Info */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-4">{games[gameId]?.name || "Coming Soon"}</h1>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Player:</span> {playerData.name}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {formatPhoneNumber(playerData.phone)}</p>
                    {playerData.instagram && (
                      <p className="text-sm"><span className="font-medium">Instagram:</span> {playerData.instagram}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">Points</p>
                  <p className="text-3xl font-bold">{playerData.totalPoints || 0}</p>
                </div>
              </div>
            </div>

            {/* Coming Soon Content */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-b-lg shadow-lg text-center">
              <IconDeviceGamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This game is still under development. Try the Spin & Wheel or Memory Match game for now!
              </p>

              {/* Player Stats Card - Following the same pattern as games page */}
              <Card className="mb-6 max-w-sm mx-auto">
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

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => router.push(`/play/${merchantId}/game/spin-wheel?player=${playerId}`)}>
                  Play Spin & Wheel
                </Button>
                <Button variant="outline" onClick={() => router.push(`/play/${merchantId}/game/memory-cards?player=${playerId}`)}>
                  Play Memory Match
                </Button>
                <Button variant="outline" onClick={() => router.push(`/play/${merchantId}/game/lucky-dice?player=${playerId}`)}>
                  Play Lucky Dice
                </Button>
                <Button variant="outline" onClick={() => router.push(`/play/${merchantId}/game/quick-tap?player=${playerId}`)}>
                  Play Quick Tap
                </Button>
                <Button variant="outline" onClick={() => router.push(`/play/${merchantId}/game/word-puzzle?player=${playerId}`)}>
                  Play Word Puzzle
                </Button>
                <Button variant="outline" onClick={() => router.push(`/play/${merchantId}/game/color-match?player=${playerId}`)}>
                  Play Color Match
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <IconTrophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {playerData.totalPoints || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <IconGift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {playerData.gamesPlayed?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Games Played</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}