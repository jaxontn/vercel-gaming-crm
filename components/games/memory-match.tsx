"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTrophy, IconRotateClockwise, IconSparkles } from "@tabler/icons-react"

interface MemoryCard {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryMatchProps {
  onPointsEarned: (points: number) => void
  playerName: string
}

const EMOJI_PAIRS = ["🎮", "🎯", "🎪", "🎨", "🎭", "🎪", "🎸", "🎺"]

export function MemoryMatch({ onPointsEarned, playerName }: MemoryMatchProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [points, setPoints] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize cards
  useEffect(() => {
    if (isClient) {
      initializeGame()
    }
  }, [isClient])

  // Check for game completion
  useEffect(() => {
    if (matches === 8 && matches > 0) {
      setGameComplete(true)
      const finalPoints = calculatePoints()
      setPoints(finalPoints)
      onPointsEarned(finalPoints)
    }
  }, [matches])

  const initializeGame = () => {
    const emojis = EMOJI_PAIRS.slice(0, 8)
    const cardPairs = [...emojis, ...emojis]

    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))

    setCards(shuffled)
    setSelectedCards([])
    setMoves(0)
    setMatches(0)
    setGameComplete(false)
    setPoints(0)
  }

  const calculatePoints = () => {
    const basePoints = 25
    const movesBonus = Math.max(0, (20 - moves) * 2)
    return basePoints + movesBonus
  }

  const handleCardClick = (cardId: number) => {
    if (!isClient || isChecking) return
    if (selectedCards.length === 2) return
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    const newSelected = [...selectedCards, cardId]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMoves(moves + 1)
      checkForMatch(newSelected)
    }
  }

  const checkForMatch = (selected: number[]) => {
    setIsChecking(true)
    const [first, second] = selected
    const firstCard = cards[first]
    const secondCard = cards[second]

    setTimeout(() => {
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        const newCards = [...cards]
        newCards[first].isMatched = true
        newCards[second].isMatched = true
        setCards(newCards)
        setMatches(matches + 1)
      } else {
        // No match
        const newCards = [...cards]
        newCards[first].isFlipped = false
        newCards[second].isFlipped = false
        setCards(newCards)
      }

      setSelectedCards([])
      setIsChecking(false)
    }, 1000)
  }

  const getGameStatus = () => {
    if (gameComplete) {
      if (moves <= 12) return "Perfect! 🌟"
      if (moves <= 16) return "Excellent! 🎉"
      if (moves <= 20) return "Great job! 👏"
      return "Good effort! 💪"
    }
    return ""
  }

  const getStatusColor = () => {
    if (gameComplete) {
      if (moves <= 12) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      if (moves <= 16) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      if (moves <= 20) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
    return ""
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
            Moves: {moves}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Matches: {matches}/8
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={initializeGame}
          className="flex items-center gap-2"
        >
          <IconRotateClockwise className="w-4 h-4" />
          New Game
        </Button>
      </div>

      {/* Game Complete Message */}
      {gameComplete && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6 text-center">
            <IconTrophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Congratulations, {playerName}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {getGameStatus()}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge className={getStatusColor()}>
                Completed in {moves} moves
              </Badge>
              <Badge variant="outline" className="text-sm">
                <IconSparkles className="w-3 h-3 mr-1" />
                {points} points earned
              </Badge>
            </div>
            <Button onClick={initializeGame} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square cursor-pointer transform transition-all duration-300
              ${card.isFlipped || card.isMatched ? 'rotate-0' : 'hover:scale-105'}
              ${card.isMatched ? 'opacity-70' : ''}
            `}
          >
            <Card className={`
              h-full flex items-center justify-center text-2xl
              ${card.isFlipped || card.isMatched
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
              }
              ${card.isMatched ? 'ring-2 ring-green-500' : ''}
            `}>
              <CardContent className="p-0 flex items-center justify-center h-full">
                {card.isFlipped || card.isMatched ? (
                  <span className="text-3xl animate-bounce">{card.emoji}</span>
                ) : (
                  <span className="text-3xl">?</span>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Game Instructions */}
      {!gameComplete && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Play:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Click any card to flip it over</li>
              <li>• Find matching pairs of emojis</li>
              <li>• Complete in fewer moves for bonus points</li>
              <li>• Match all 8 pairs to win!</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}