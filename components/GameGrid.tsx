"use client"

import { GameCard } from "./GameCard"

interface Game {
  id: string
  game_code: string
  game_name: string
  description: string
  category: string
  icon: string
  is_enabled: boolean | string
  daily_play_limit: number | string
  total_sessions: number | string
  avg_score: number | string
  completion_rate: number
  prizes_count: number | string
  achievements_count: number | string
}

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No games found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}