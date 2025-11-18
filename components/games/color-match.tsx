"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTrophy, IconRotateClockwise, IconSparkles, IconTarget, IconCircle, IconCheck } from "@tabler/icons-react"

interface ColorMatchProps {
  onPointsEarned: (points: number) => void
  playerName: string
}

interface ColorCard {
  id: number
  color: string
  colorName: string
  backgroundColor: string
}

interface Round {
  targetText: ColorCard // What the text SAYS
  textColor: ColorCard // What color the text actually IS
  correctAnswer: ColorCard // The correct color to click
  options: ColorCard[]
  timeLimit: number
  points: number
}

const COLORS: ColorCard[] = [
  { id: 1, color: "text-red-600", colorName: "Red", backgroundColor: "bg-red-500" },
  { id: 2, color: "text-blue-600", colorName: "Blue", backgroundColor: "bg-blue-500" },
  { id: 3, color: "text-green-600", colorName: "Green", backgroundColor: "bg-green-500" },
  { id: 4, color: "text-yellow-600", colorName: "Yellow", backgroundColor: "bg-yellow-500" },
  { id: 5, color: "text-purple-600", colorName: "Purple", backgroundColor: "bg-purple-500" },
  { id: 6, color: "text-pink-600", colorName: "Pink", backgroundColor: "bg-pink-500" },
  { id: 7, color: "text-orange-600", colorName: "Orange", backgroundColor: "bg-orange-500" },
  { id: 8, color: "text-cyan-600", colorName: "Cyan", backgroundColor: "bg-cyan-500" },
]

export function ColorMatch({ onPointsEarned, playerName }: ColorMatchProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [totalRounds, setTotalRounds] = useState(10)
  const [timeLeft, setTimeLeft] = useState(5)
  const [round, setRound] = useState<Round | null>(null)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Timer countdown for each round
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showResult) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === "playing" && !showResult) {
      handleTimeUp()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameState, timeLeft, showResult])

  const generateRound = useCallback(() => {
    const targetText = COLORS[Math.floor(Math.random() * COLORS.length)]

    // Select a different color for the text display (Stroop effect)
    let textColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    while (textColor.id === targetText.id) {
      textColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    }

    // The correct answer is what the TEXT SAYS, not what color it appears
    const correctAnswer = targetText

    // Create options including the correct answer and 3 distractors
    const otherColors = COLORS.filter(c => c.id !== correctAnswer.id && c.id !== textColor.id)
    const selectedOptions = [correctAnswer, ...otherColors.slice(0, 3)]
      .sort(() => Math.random() - 0.5)

    const baseTime = Math.max(3, 6 - Math.floor(currentRound / 2)) // Slightly more time for the harder challenge
    const basePoints = 30 + (currentRound * 3) // Higher points for increased difficulty

    return {
      targetText,
      textColor,
      correctAnswer,
      options: selectedOptions,
      timeLimit: baseTime,
      points: basePoints
    }
  }, [currentRound])

  const startGame = () => {
    setGameState("playing")
    setCurrentRound(1)
    setScore(0)
    setCorrectAnswers(0)
    setStreak(0)
    setMaxStreak(0)
    const newRound = generateRound()
    setRound(newRound)
    setTimeLeft(newRound.timeLimit)
    setSelectedColor(null)
    setShowResult(null)
  }

  const handleColorClick = (colorId: number) => {
    if (showResult || !round) return

    setSelectedColor(colorId)
    const isCorrect = colorId === round.correctAnswer.id
    setShowResult(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      const bonusPoints = Math.min(streak * 7, 25) // Higher streak bonus for harder game
      const totalPoints = round.points + bonusPoints
      setScore(prev => prev + totalPoints)
      setCorrectAnswers(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        setMaxStreak(current => Math.max(current, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    // Move to next round after delay
    setTimeout(() => {
      nextRound()
    }, 1500)
  }

  const handleTimeUp = () => {
    setShowResult("incorrect")
    setStreak(0)

    setTimeout(() => {
      nextRound()
    }, 1500)
  }

  const nextRound = () => {
    if (currentRound >= totalRounds) {
      endGame()
      return
    }

    const nextRoundNumber = currentRound + 1
    setCurrentRound(nextRoundNumber)
    const newRound = generateRound()
    setRound(newRound)
    setTimeLeft(newRound.timeLimit)
    setSelectedColor(null)
    setShowResult(null)
  }

  const endGame = () => {
    setGameState("finished")
    onPointsEarned(score)
  }

  const resetGame = () => {
    setGameState("ready")
    setCurrentRound(1)
    setScore(0)
    setCorrectAnswers(0)
    setStreak(0)
    setMaxStreak(0)
    setRound(null)
    setTimeLeft(5)
    setSelectedColor(null)
    setShowResult(null)
  }

  const getGameStatus = () => {
    const accuracy = totalRounds > 0 ? Math.round((correctAnswers / totalRounds) * 100) : 0
    if (score >= 400) return "Stroop Master! 🌈"
    if (score >= 350) return "Color Genius! 🎨"
    if (score >= 300) return "Amazing Focus! 🎯"
    if (score >= 200) return "Great job! ✨"
    return "Keep practicing! 💪"
  }

  const getStatusColor = () => {
    if (score >= 400) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    if (score >= 350) return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    if (score >= 300) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    if (score >= 200) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  const formatTime = (seconds: number) => {
    return `0:${seconds.toString().padStart(2, '0')}`
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
            Round {currentRound}/{totalRounds}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score}
          </Badge>
          {streak > 1 && (
            <Badge className="text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
              🔥 Streak {streak}
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
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-6 text-center">
            <IconTrophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Game Complete, {playerName}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {getGameStatus()}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{correctAnswers}/{totalRounds}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Colors Matched</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{maxStreak}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Best Streak</div>
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
            <IconTarget className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Color Match Challenge
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Click the color that the TEXT says (ignore the text color)!
            </p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <IconTarget className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </div>
        )}

        {gameState === "playing" && round && (
          <Card className="p-8">
            <div className="space-y-8">
              {/* Timer and Target */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    ⏱️ {formatTime(timeLeft)}
                  </Badge>
                  {streak > 1 && (
                    <Badge className="text-lg bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                      🔥 Streak {streak}
                    </Badge>
                  )}
                </div>

                {/* Target Color Display - Stroop Effect */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Click the color that the TEXT says:</p>
                  <div className={`text-7xl font-bold ${round.textColor.color} uppercase tracking-wider mb-2 animate-pulse`}>
                    {round.targetText.colorName}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                      ⚠️ Ignore this color: {round.textColor.colorName}
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      ✅ Focus on: "{round.targetText.colorName}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {round.options.map((color) => (
                  <Button
                    key={color.id}
                    onClick={() => handleColorClick(color.id)}
                    disabled={showResult !== null}
                    className={`h-24 text-lg font-bold uppercase tracking-wider transition-all transform hover:scale-105 ${
                      selectedColor === color.id
                        ? showResult === "correct" && color.id === round.targetText.id
                          ? "bg-green-600 text-white ring-4 ring-green-400"
                          : showResult === "incorrect" && color.id === selectedColor
                          ? "bg-red-600 text-white ring-4 ring-red-400 animate-pulse"
                          : "ring-4 ring-yellow-400"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-400"
                    } ${color.color}`}
                  >
                    {color.colorName}
                  </Button>
                ))}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className={`text-center p-4 rounded-lg ${
                  showResult === "correct"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}>
                  {showResult === "correct" ? (
                    <>
                      <IconCheck className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-bold text-lg">
                        Correct! The text said "{round.targetText.colorName}"
                      </p>
                      <p className="text-lg">
                        +{round.points + (Math.min((streak - 1) * 7, 25))} points
                        {streak > 1 && ` 🔥 Amazing Streak!`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">
                        {timeLeft === 0 ? "Time's up!" : "Wrong!"}
                      </p>
                      <p className="text-lg">
                        The text said "{round.targetText.colorName}" ({round.targetText.color})
                      </p>
                      <p className="text-sm mt-1">
                        But the text appeared in {round.textColor.colorName}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Round Progress */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Round Progress</span>
                  <span className="text-gray-900 dark:text-white">
                    {currentRound}/{totalRounds}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentRound / totalRounds) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
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
              <li>• Click the color that the TEXT says, NOT the color the text appears in</li>
              <li>• This is a Stroop effect test - ignore the text color!</li>
              <li>• You have limited time that decreases as you progress</li>
              <li>• Build streaks for bonus points (much harder now!)</li>
              <li>• Complete 10 rounds to finish the game</li>
              <li>• Focus on what the text SAYS, not what color you see!</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Current Game Stats */}
      {gameState === "playing" && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {score}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {correctAnswers}/{currentRound - (showResult ? 0 : 1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {streak}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Current Streak</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Time Left</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}