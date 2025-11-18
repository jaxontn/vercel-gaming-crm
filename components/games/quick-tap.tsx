"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTrophy, IconRotateClockwise, IconSparkles, IconTarget, IconBolt, IconClock } from "@tabler/icons-react"

interface QuickTapProps {
  onPointsEarned: (points: number) => void
  playerName: string
}

interface TapTarget {
  id: number
  x: number
  y: number
  size: number
  points: number
  color: string
  lifetime: number
}

export function QuickTap({ onPointsEarned, playerName }: QuickTapProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [targets, setTargets] = useState<TapTarget[]>([])
  const [combo, setCombo] = useState(0)
  const [lastTapPoints, setLastTapPoints] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [missedTaps, setMissedTaps] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame()
    }
  }, [gameState, timeLeft])

  // Game loop for spawning targets
  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp
        const deltaTime = timestamp - lastTimeRef.current

        // Spawn new targets
        if (deltaTime > 800 - Math.min(score * 2, 500)) { // Increase difficulty
          spawnTarget()
          lastTimeRef.current = timestamp
        }

        // Update existing targets
        setTargets(prev => prev.filter(target => {
          const newLifetime = target.lifetime - 16
          return newLifetime > 0
        }).map(target => ({
          ...target,
          lifetime: target.lifetime - 16
        })))

        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [gameState, score])

  const spawnTarget = useCallback(() => {
    if (!gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const targetTypes = [
      { points: 10, size: 60, color: "bg-blue-500", probability: 0.4 },
      { points: 25, size: 50, color: "bg-green-500", probability: 0.3 },
      { points: 50, size: 40, color: "bg-yellow-500", probability: 0.2 },
      { points: 100, size: 30, color: "bg-red-500", probability: 0.1 }
    ]

    const random = Math.random()
    let targetType = targetTypes[0]
    let cumulativeProbability = 0

    for (const type of targetTypes) {
      cumulativeProbability += type.probability
      if (random <= cumulativeProbability) {
        targetType = type
        break
      }
    }

    const maxX = rect.width - targetType.size
    const maxY = rect.height - targetType.size

    const newTarget: TapTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      size: targetType.size,
      points: targetType.points,
      color: targetType.color,
      lifetime: 800 + Math.random() * 700 // 0.8-1.5 seconds lifetime
    }

    setTargets(prev => [...prev, newTarget])
  }, [])

  const handleTargetClick = (targetId: number, points: number) => {
    if (gameState !== "playing") return

    // Remove the target
    setTargets(prev => prev.filter(t => t.id !== targetId))

    // Update score and combo
    setCombo(prev => prev + 1)
    const bonusPoints = points + (combo > 0 ? combo * 5 : 0)
    setScore(prev => prev + bonusPoints)
    setLastTapPoints(bonusPoints)

    // Reset last tap points after animation
    setTimeout(() => setLastTapPoints(0), 1000)
  }

  const handleMissedTap = () => {
    if (gameState !== "playing") return
    setCombo(0)
    setMissedTaps(prev => prev + 1)
  }

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(30)
    setTargets([])
    setCombo(0)
    setMissedTaps(0)
    setLastTapPoints(0)
    lastTimeRef.current = 0
  }

  const endGame = () => {
    setGameState("finished")
    setTargets([])
    if (score > highScore) {
      setHighScore(score)
    }
    onPointsEarned(score)
  }

  const resetGame = () => {
    setGameState("ready")
    setScore(0)
    setTimeLeft(30)
    setTargets([])
    setCombo(0)
    setMissedTaps(0)
    setLastTapPoints(0)
    lastTimeRef.current = 0
  }

  const getGameStatus = () => {
    const accuracy = ((score / Math.max(1, score + missedTaps * 10)) * 100)
    if (score >= 1000) return "Legendary! 🏆"
    if (score >= 750) return "Amazing! 🌟"
    if (score >= 500) return "Excellent! 🎉"
    if (score >= 250) return "Great job! 👏"
    return "Good effort! 💪"
  }

  const getStatusColor = () => {
    if (score >= 1000) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    if (score >= 750) return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    if (score >= 500) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    if (score >= 250) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  const getAccuracy = () => {
    const totalAttempts = (score / 25) + missedTaps // Estimate based on average points
    return totalAttempts > 0 ? Math.round((score / (score + missedTaps * 10)) * 100) : 0
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <IconClock className="w-3 h-3 mr-1" />
            {timeLeft}s
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score}
          </Badge>
          {combo > 0 && (
            <Badge className="text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
              <IconBolt className="w-3 h-3 mr-1" />
              Combo x{combo}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetGame}
          className="flex items-center gap-2"
        >
          <IconRotateClockwise className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Game Complete Message */}
      {gameState === "finished" && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
          <CardContent className="p-6 text-center">
            <IconTrophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Time's Up, {playerName}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {getGameStatus()}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{getAccuracy()}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className={getStatusColor()}>
                {getGameStatus()}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <IconSparkles className="w-3 h-3 mr-1" />
                {score} points earned
              </Badge>
            </div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Area */}
      <div className="relative">
        {gameState === "ready" && (
          <div className="text-center py-16">
            <IconTarget className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Tap Challenge
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tap as many targets as you can in 30 seconds!
            </p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <IconTarget className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div
            ref={gameAreaRef}
            className="relative h-96 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border-2 border-red-200 dark:border-red-700 overflow-hidden"
            onClick={handleMissedTap}
          >
            {/* Floating points animation */}
            {lastTapPoints > 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full font-bold animate-bounce">
                  +{lastTapPoints}
                </div>
              </div>
            )}

            {/* Targets */}
            {targets.map(target => (
              <div
                key={target.id}
                className={`absolute ${target.color} rounded-full cursor-pointer transform transition-all hover:scale-110 animate-pulse shadow-lg border-2 border-white`}
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  width: `${target.size}px`,
                  height: `${target.size}px`,
                  opacity: Math.max(0.3, target.lifetime / 3000)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleTargetClick(target.id, target.points)
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                  {target.points}
                </div>
              </div>
            ))}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Game Instructions */}
      {gameState === "ready" && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Play:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Tap targets quickly to earn points before they disappear</li>
              <li>• Smaller targets = more points (10-100 points)</li>
              <li>• Build combos for bonus points (5pts per combo level)</li>
              <li>• You have 30 seconds - be fast and accurate!</li>
              <li>• Missing targets resets your combo</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Current Game Stats */}
      {gameState === "playing" && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {score}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Current Score</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {combo}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Combo</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {targets.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Targets</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}