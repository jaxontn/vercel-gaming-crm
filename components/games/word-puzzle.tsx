"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { IconTrophy, IconRotateClockwise, IconSparkles, IconDeviceGamepad, IconCheck, IconX, IconBulb } from "@tabler/icons-react"

interface WordPuzzleProps {
  onPointsEarned: (points: number) => void
  playerName: string
}

interface Puzzle {
  id: number
  scrambled: string
  solution: string
  hint: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

const WORD_PUZZLES: Puzzle[] = [
  // Easy words
  { id: 1, scrambled: "MAMEG", solution: "GAME", hint: "Fun activity", difficulty: "easy", points: 10 },
  { id: 2, scrambled: "TAPL", solution: "PLAY", hint: "What you do with toys", difficulty: "easy", points: 10 },
  { id: 3, scrambled: "WIN", solution: "WIN", hint: "Victory", difficulty: "easy", points: 10 },
  { id: 4, scrambled: "TUFN", solution: "FUN", hint: "Enjoyable", difficulty: "easy", points: 10 },
  { id: 5, scrambled: "RUEN", solution: "RUN", hint: "Fast movement", difficulty: "easy", points: 10 },

  // Medium words
  { id: 6, scrambled: "ZPIUZZEL", solution: "PUZZLE", hint: "Brain teaser", difficulty: "medium", points: 20 },
  { id: 7, scrambled: "LANEGEGCH", solution: "CHALLENGE", hint: "Difficult task", difficulty: "medium", points: 20 },
  { id: 8, scrambled: "SCOREP", solution: "SCORE", hint: "Game points", difficulty: "medium", points: 20 },
  { id: 9, scrambled: "YVITOCRT", solution: "VICTORY", hint: "Winning moment", difficulty: "medium", points: 20 },
  { id: 10, scrambled: "EMORYMM", solution: "MEMORY", hint: "Recall ability", difficulty: "medium", points: 20 },

  // Hard words
  { id: 11, scrambled: "QIUCKTAP", solution: "QUICKTAP", hint: "Fast clicking game", difficulty: "hard", points: 30 },
  { id: 12, scrambled: "YBMRASTE", solution: "MYSTERY", hint: "Something unknown", difficulty: "hard", points: 30 },
  { id: 13, scrambled: "EGALCHNNEEL", solution: "CHALLENGE", hint: "Test of skill", difficulty: "hard", points: 30 },
  { id: 14, scrambled: "CUACSSER", solution: "SUCCESS", hint: "Achievement", difficulty: "hard", points: 30 },
  { id: 15, scrambled: "GRALATYU", solution: "GRATUITY", hint: "Extra tip", difficulty: "hard", points: 30 }
]

export function WordPuzzle({ onPointsEarned, playerName }: WordPuzzleProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isClient, setIsClient] = useState(false)
  const [usedPuzzles, setUsedPuzzles] = useState<number[]>([])
  const [puzzleHistory, setPuzzleHistory] = useState<{puzzle: Puzzle, correct: boolean, attempts: number}[]>([])

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

  const startGame = () => {
    const firstPuzzle = WORD_PUZZLES[Math.floor(Math.random() * WORD_PUZZLES.length)]
    setGameState("playing")
    setScore(0)
    setTimeLeft(120)
    setAttempts(0)
    setHintsUsed(0)
    setCorrectAnswers(0)
    setCurrentPuzzleIndex(firstPuzzle.id)
    setUsedPuzzles([firstPuzzle.id])
    setUserAnswer("")
    setShowResult(null)
    setPuzzleHistory([])
  }

  const selectRandomPuzzle = useCallback(() => {
    const availablePuzzles = WORD_PUZZLES.filter(p => !usedPuzzles.includes(p.id))
    if (availablePuzzles.length === 0) {
      // All puzzles used - return null to signal we need to reset
      return null
    }
    return availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)]
  }, [usedPuzzles])

  const getCurrentPuzzle = () => {
    return WORD_PUZZLES.find(p => p.id === currentPuzzleIndex)
  }

  const checkAnswer = () => {
    const currentPuzzle = getCurrentPuzzle()
    if (!currentPuzzle) return

    const isCorrect = userAnswer.toUpperCase().trim() === currentPuzzle.solution.toUpperCase()
    setAttempts(prev => prev + 1)

    if (isCorrect) {
      setShowResult("correct")
      const points = currentPuzzle.points - (hintsUsed * 2) // Deduct points for hints
      setScore(prev => prev + Math.max(5, points)) // Minimum 5 points
      setCorrectAnswers(prev => prev + 1)

      // Add to history
      setPuzzleHistory(prev => [...prev, { puzzle: currentPuzzle, correct: true, attempts: 1 }])

      // Select next puzzle after delay
      setTimeout(() => {
        nextPuzzle()
      }, 1500)
    } else {
      setShowResult("incorrect")
      setTimeout(() => {
        setShowResult(null)
      }, 1000)
    }

    setUserAnswer("")
    setHintsUsed(0)
  }

  const nextPuzzle = () => {
    const nextPuzzle = selectRandomPuzzle()
    if (nextPuzzle) {
      setCurrentPuzzleIndex(nextPuzzle.id)
      setUsedPuzzles(prev => [...prev, nextPuzzle.id])
    } else {
      // If all puzzles are used, reset and start again
      const resetPuzzle = WORD_PUZZLES[Math.floor(Math.random() * WORD_PUZZLES.length)]
      setCurrentPuzzleIndex(resetPuzzle.id)
      setUsedPuzzles([resetPuzzle.id])
    }
    setShowResult(null)
    setUserAnswer("")
  }

  const skipPuzzle = () => {
    const currentPuzzle = getCurrentPuzzle()
    if (currentPuzzle) {
      setPuzzleHistory(prev => [...prev, { puzzle: currentPuzzle, correct: false, attempts: 0 }])
    }
    nextPuzzle()
  }

  const showHint = () => {
    setHintsUsed(prev => prev + 1)
  }

  const endGame = () => {
    setGameState("finished")
    onPointsEarned(score)
  }

  const resetGame = () => {
    setGameState("ready")
    setScore(0)
    setTimeLeft(120)
    setAttempts(0)
    setHintsUsed(0)
    setCorrectAnswers(0)
    setCurrentPuzzleIndex(0)
    setUserAnswer("")
    setShowResult(null)
    setUsedPuzzles([])
    setPuzzleHistory([])
  }

  const getGameStatus = () => {
    const accuracy = attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0
    if (score >= 200) return "Word Master! 🏆"
    if (score >= 150) return "Vocabulary Expert! 📚"
    if (score >= 100) return "Great job! 🌟"
    if (score >= 50) return "Good effort! 👏"
    return "Keep practicing! 💪"
  }

  const getStatusColor = () => {
    if (score >= 200) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    if (score >= 150) return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    if (score >= 100) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    if (score >= 50) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  const currentPuzzle = getCurrentPuzzle()

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Time: {formatTime(timeLeft)}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {correctAnswers}/{attempts} Correct
          </Badge>
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
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
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
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{correctAnswers}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Words Solved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0}%
                </div>
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
            <IconDeviceGamepad className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Word Puzzle Challenge
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Unscramble words and test your vocabulary skills!
            </p>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <IconDeviceGamepad className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </div>
        )}

        {gameState === "playing" && currentPuzzle && (
          <Card className="p-8">
            <div className="space-y-6">
              {/* Difficulty Badge */}
              <div className="flex justify-center">
                <Badge className={
                  currentPuzzle.difficulty === "easy" ? "bg-green-100 text-green-800" :
                  currentPuzzle.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {currentPuzzle.difficulty.charAt(0).toUpperCase() + currentPuzzle.difficulty.slice(1)} - {currentPuzzle.points} points
                </Badge>
              </div>

              {/* Scrambled Word */}
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider">
                  {currentPuzzle.scrambled.split('').join(' ')}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unscramble this word
                </p>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  placeholder="Answer"
                  className="text-center text-3xl font-bold tracking-wider h-16"
                  style={{ textTransform: 'uppercase' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkAnswer()
                    }
                  }}
                  disabled={showResult === "correct"}
                />

                {/* Result Feedback */}
                {showResult && (
                  <div className={`text-center p-3 rounded-lg ${
                    showResult === "correct"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    {showResult === "correct" ? (
                      <>
                        <IconCheck className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold">Correct! Well done!</p>
                      </>
                    ) : (
                      <>
                        <IconX className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold">Try again!</p>
                      </>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={checkAnswer}
                    disabled={showResult === "correct" || !userAnswer.trim()}
                    className="w-full"
                  >
                    Check
                  </Button>
                  <Button
                    onClick={showHint}
                    disabled={hintsUsed >= 2}
                    variant="outline"
                    className="w-full"
                  >
                    <IconBulb className="w-4 h-4 mr-1" />
                    Hint ({2 - hintsUsed})
                  </Button>
                  <Button
                    onClick={skipPuzzle}
                    variant="outline"
                    className="w-full"
                  >
                    Skip
                  </Button>
                </div>

                {/* Hint Display */}
                {hintsUsed > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <IconBulb className="w-4 h-4 inline mr-1" />
                      Hint: {currentPuzzle.hint}
                    </p>
                  </div>
                )}
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
              <li>• Unscramble the letters to form the correct word</li>
              <li>• Easy words (10 pts), Medium words (20 pts), Hard words (30 pts)</li>
              <li>• Use hints if needed, but they'll reduce your points</li>
              <li>• You have 2 minutes to solve as many words as possible</li>
              <li>• Type your answer and press Enter or click Check</li>
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
                {correctAnswers}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Solved</div>
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
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {attempts > 0 ? Math.round((correctAnswers / Math.max(1, attempts)) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {gameState === "playing" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Time Progress</span>
                <span className="text-gray-900 dark:text-white">
                  {Math.round(((120 - timeLeft) / 120) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((120 - timeLeft) / 120) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}