"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTrophy, IconRotateClockwise, IconSparkles, IconDice1, IconDice2, IconDice3, IconDice4, IconDice5, IconDice6 } from "@tabler/icons-react"

interface DiceProps {
  value: number
  isRolling: boolean
  size?: "sm" | "md" | "lg"
}

const DiceComponent = ({ value, isRolling, size = "md" }: DiceProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24"
  }

  const dotSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  const diceIcons = [IconDice1, IconDice2, IconDice3, IconDice4, IconDice5, IconDice6]
  const DiceIcon = diceIcons[value - 1] || IconDice1

  if (isRolling) {
    return (
      <div className={`${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center`}>
        <div className="animate-spin">
          <DiceIcon className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center`}>
      <DiceIcon className="w-12 h-12 text-purple-600" />
    </div>
  )
}

interface LuckyDiceProps {
  onPointsEarned: (points: number) => void
  playerName: string
}

export function LuckyDice({ onPointsEarned, playerName }: LuckyDiceProps) {
  const [dice, setDice] = useState([1, 1])
  const [isRolling, setIsRolling] = useState(false)
  const [rollsLeft, setRollsLeft] = useState(3)
  const [totalScore, setTotalScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [lastRollPoints, setLastRollPoints] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [bestRoll, setBestRoll] = useState<number[]>([1, 1])

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const rollDice = () => {
    if (isRolling || rollsLeft <= 0 || !isClient) return

    setIsRolling(true)
    setLastRollPoints(0)

    // Simulate dice rolling animation
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ])
      rollCount++

      if (rollCount > 10) {
        clearInterval(rollInterval)

        // Final roll values
        const finalDice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ]
        setDice(finalDice)

        const points = calculatePoints(finalDice)
        setLastRollPoints(points)
        setTotalScore(prev => prev + points)
        setRollsLeft(prev => prev - 1)

        if (points > calculatePoints(bestRoll)) {
          setBestRoll(finalDice)
        }

        setIsRolling(false)

        if (rollsLeft === 1) {
          setGameComplete(true)
          onPointsEarned(totalScore + points)
        }
      }
    }, 100)
  }

  const calculatePoints = (diceValues: number[]) => {
    const [die1, die2] = diceValues
    const sum = die1 + die2

    // Special combinations
    if (die1 === 6 && die2 === 6) return 50 // Double sixes
    if (die1 === die2) return 30 // Doubles
    if (sum === 7) return 20 // Lucky 7
    if (sum === 11) return 15 //

    // Regular points based on sum
    return sum
  }

  const resetGame = () => {
    setDice([1, 1])
    setRollsLeft(3)
    setTotalScore(0)
    setGameComplete(false)
    setLastRollPoints(0)
    setBestRoll([1, 1])
  }

  const getDiceSum = () => dice[0] + dice[1]
  const getBestRollSum = () => bestRoll[0] + bestRoll[1]

  const getGameStatus = () => {
    if (totalScore >= 100) return "Amazing! 🌟"
    if (totalScore >= 75) return "Excellent! 🎉"
    if (totalScore >= 50) return "Great job! 👏"
    return "Good effort! 💪"
  }

  const getStatusColor = () => {
    if (totalScore >= 100) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    if (totalScore >= 75) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    if (totalScore >= 50) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  const getRollMessage = (diceValues: number[]) => {
    const [die1, die2] = diceValues
    const sum = die1 + die2

    if (die1 === 6 && die2 === 6) return "Double Sixes! 🎰"
    if (die1 === die2) return `Double ${die1}s! 🎯`
    if (sum === 7) return "Lucky 7! 🍀"
    if (sum === 11) return "Eleven! 🎲"
    return `Rolled ${sum}`
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
            Rolls Left: {rollsLeft}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {totalScore}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Best: {getBestRollSum()}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetGame}
          className="flex items-center gap-2"
        >
          <IconRotateClockwise className="w-4 h-4" />
          New Game
        </Button>
      </div>

      {/* Game Complete Message */}
      {gameComplete && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6 text-center">
            <IconTrophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Game Complete, {playerName}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {getGameStatus()}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className={getStatusColor()}>
                Total Score: {totalScore}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <IconSparkles className="w-3 h-3 mr-1" />
                {totalScore} points earned
              </Badge>
            </div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dice Area */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border-2 border-green-200 dark:border-green-700">
          <div className="flex gap-6 mb-6">
            <DiceComponent value={dice[0]} isRolling={isRolling} size="lg" />
            <DiceComponent value={dice[1]} isRolling={isRolling} size="lg" />
          </div>

          {/* Roll Result */}
          {!isRolling && (dice[0] !== 1 || dice[1] !== 1 || rollsLeft < 3) && (
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {getRollMessage(dice)}
              </div>
              {lastRollPoints > 0 && (
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{lastRollPoints} points
                </div>
              )}
            </div>
          )}

          <Button
            onClick={rollDice}
            disabled={isRolling || rollsLeft <= 0}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isRolling ? (
              <>
                <IconRotateClockwise className="w-4 h-4 mr-2 animate-spin" />
                Rolling...
              </>
            ) : rollsLeft <= 0 ? (
              <>
                <IconTrophy className="w-4 h-4 mr-2" />
                Game Complete!
              </>
            ) : (
              <>
                <IconSparkles className="w-4 h-4 mr-2" />
                Roll Dice ({rollsLeft} left)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Game Instructions */}
      {!gameComplete && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Play:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Roll the dice up to 3 times per game</li>
              <li>• Special combos: Double Sixes (50pts), Any Doubles (30pts)</li>
              <li>• Lucky 7 = 20 points, 11 = 15 points</li>
              <li>• Regular rolls = sum of both dice</li>
              <li>• Try to get the highest score possible!</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Current Game Stats */}
      {rollsLeft < 3 && !gameComplete && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {dice[0]} + {dice[1]}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Current Roll</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {lastRollPoints}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last Points</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalScore}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Score</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}