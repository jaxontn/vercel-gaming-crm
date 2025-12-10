"use client"

import { IconEye } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Category colors matching the dashboard
const categoryColors: Record<string, string> = {
  luck: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  skill: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  puzzle: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300",
  arcade: "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
}

interface GamePreviewCardProps {
  game: {
    name: string
    description: string
    category: string
    icon: string
    metric: string
  }
  onPreview?: () => void
}

export function GamePreviewCard({ game, onPreview }: GamePreviewCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-4xl">{game.icon}</div>
          <Badge className={categoryColors[game.category] || "bg-gray-100 text-gray-800"}>
            {game.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{game.name}</CardTitle>
        <CardDescription className="text-base">
          {game.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{game.metric}</span>
          <span>engagement rate</span>
        </div>
      </CardContent>

      <CardFooter className="relative">
        <Button
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={onPreview}
        >
          <IconEye className="mr-2 h-4 w-4" />
          Preview Game
        </Button>
      </CardFooter>
    </Card>
  )
}
