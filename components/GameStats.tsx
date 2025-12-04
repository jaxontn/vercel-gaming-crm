"use client"

import {
  IconUsers,
  IconTrendingUp,
  IconTarget,
  IconClock,
  IconTrophy,
  IconGift,
  IconChartBar,
} from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GameStatsProps {
  statistics?: {
    total_sessions: number
    avg_score: number
    max_score: number
    unique_players: number
    completed_sessions: number
    completion_rate: number
  }
  prizes?: Array<{
    prize_name: string
    prize_type: string
    win_probability: number
    min_score_required: number
  }>
  achievements?: Array<{
    title: string
    description: string
    tier: string
    points_reward: number
  }>
}

export function GameStats({ statistics, prizes, achievements }: GameStatsProps) {
  const stats = statistics || {
    total_sessions: 0,
    avg_score: 0,
    max_score: 0,
    unique_players: 0,
    completed_sessions: 0,
    completion_rate: 0,
  }

  const statCards = [
    {
      title: "Total Plays",
      value: stats.total_sessions.toLocaleString(),
      icon: IconUsers,
      description: "All time sessions",
    },
    {
      title: "Unique Players",
      value: stats.unique_players.toLocaleString(),
      icon: IconTarget,
      description: "Distinct players",
    },
    {
      title: "Avg Score",
      value: stats.avg_score.toFixed(1),
      icon: IconTrendingUp,
      description: `Max: ${stats.max_score}`,
    },
    {
      title: "Completion Rate",
      value: `${stats.completion_rate.toFixed(1)}%`,
      icon: IconChartBar,
      description: `${stats.completed_sessions} completed`,
    },
  ]

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "bronze":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Prizes and Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Prizes */}
        {prizes && prizes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconGift className="mr-2 h-5 w-5" />
                Available Prizes ({prizes.length})
              </CardTitle>
              <CardDescription>
                Rewards players can win
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{prize.prize_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Min score: {prize.min_score_required}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {(prize.win_probability * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Win rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconTrophy className="mr-2 h-5 w-5" />
                Achievements ({achievements.length})
              </CardTitle>
              <CardDescription>
                Milestones for players to unlock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{achievement.points_reward} pts</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTierColor(achievement.tier)}`}>
                        {achievement.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}