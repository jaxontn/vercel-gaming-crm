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

  // Normalize game data before passing to GameCard
  const normalizedGames = games.map((game) => ({
    ...game,
    is_enabled: typeof game.is_enabled === 'string' ? game.is_enabled === 'true' : game.is_enabled,
    daily_play_limit: typeof game.daily_play_limit === 'string' ? parseInt(game.daily_play_limit, 10) || 0 : game.daily_play_limit,
    total_sessions: typeof game.total_sessions === 'string' ? parseInt(game.total_sessions, 10) || 0 : game.total_sessions,
    avg_score: typeof game.avg_score === 'string' ? parseFloat(game.avg_score) || 0 : game.avg_score,
    prizes_count: typeof game.prizes_count === 'string' ? parseInt(game.prizes_count, 10) || 0 : game.prizes_count,
    achievements_count: typeof game.achievements_count === 'string' ? parseInt(game.achievements_count, 10) || 0 : game.achievements_count,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {normalizedGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}