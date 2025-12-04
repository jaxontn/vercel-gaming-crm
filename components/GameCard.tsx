"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconEye,
  IconEyeOff,
  IconSettings,
  IconChartBar,
  IconTrophy,
  IconGift,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { callApi } from "@/lib/api-client"

// Icon mapping for games
const gameIcons: Record<string, string> = {
  spinner: "🎰",
  brain: "🧠",
  dice: "🎲",
  "hand-pointer": "👆",
  book: "📚",
  palette: "🎨",
  gamepad: "🎮",
}

// Category colors
const categoryColors: Record<string, string> = {
  luck: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  skill: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  puzzle: "bg-green-100 text-green-800 hover:bg-green-200",
  arcade: "bg-orange-100 text-orange-800 hover:bg-orange-200",
}

interface GameCardProps {
  game: {
    id: string
    game_code: string
    game_name: string
    description: string
    category: string
    icon: string
    is_enabled: boolean
    daily_play_limit: number
    total_sessions: number
    avg_score: number
    completion_rate: number
    prizes_count: number
    achievements_count: number
  }
}

export function GameCard({ game }: GameCardProps) {
  const [isEnabled, setIsEnabled] = useState(game.is_enabled)
  const [loading, setLoading] = useState(false)

  const handleToggleEnable = async () => {
    setLoading(true)
    try {
      const action = isEnabled ? "disable_game" : "enable_game"
      const response = await callApi('merchant_games', 'update', {
        action,
        game_code: game.game_code,
      })

      if (response.status === "SUCCESS") {
        setIsEnabled(!isEnabled)
      } else {
        console.error('Failed to toggle game:', response.message)
        // Revert on error
        setIsEnabled(isEnabled)
      }
    } catch (error) {
      console.error('Failed to toggle game:', error)
      // Revert on error
      setIsEnabled(isEnabled)
    } finally {
      setLoading(false)
    }
  }

  const completionPercentage = game.completion_rate ? Math.round(game.completion_rate * 100) : 0

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      isEnabled ? "" : "opacity-60"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{gameIcons[game.icon] || gameIcons.gamepad}</div>
            <div>
              <CardTitle className="text-lg">{game.game_name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {game.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={categoryColors[game.category] || "bg-gray-100 text-gray-800"}>
              {game.category}
            </Badge>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleEnable}
                disabled={loading}
              />
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <IconUsers className="h-4 w-4" />
              <span>{game.total_sessions.toLocaleString()} plays</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <IconTrendingUp className="h-4 w-4" />
              <span>{completionPercentage}% completion</span>
            </div>
          </div>

          {/* Daily Limit */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Daily Limit:</span>
            <span className="text-sm font-medium">{game.daily_play_limit} plays</span>
          </div>

          {/* Progress Bar */}
          {game.total_sessions > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Engagement</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <IconGift className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{game.prizes_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{game.achievements_count}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <IconSettings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/gamification/${game.game_code}`}>
                    <IconChartBar className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/gamification/${game.game_code}/settings`}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {isEnabled ? (
                    <>
                      <IconEyeOff className="mr-2 h-4 w-4" />
                      Disable Game
                    </>
                  ) : (
                    <>
                      <IconEye className="mr-2 h-4 w-4" />
                      Enable Game
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}