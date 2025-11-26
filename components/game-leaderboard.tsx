"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconTrophy,
  IconMedal,
  IconSearch,
  IconCalendar,
  IconTrendingUp,
  IconTarget,
  IconDownload
} from "@tabler/icons-react"

interface LeaderboardEntry {
  id: string
  rank: number
  playerName: string
  playerPhone: string
  score: number
  level?: string
  timeSpent: number
  achievement: string
  timestamp: string
  difficulty: "Easy" | "Medium" | "Hard"
  previousRank?: number
  avatar?: string
}

interface GameLeaderboardProps {
  data: LeaderboardEntry[]
  gameType: string
  scoreLabel?: string
  timePeriods?: Array<{ value: string; label: string }>
  showTimeSpent?: boolean
  showDifficulty?: boolean
  showLevel?: boolean
}

export function GameLeaderboard({
  data,
  gameType,
  scoreLabel = "Score",
  timePeriods = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" }
  ],
  showTimeSpent = true,
  showDifficulty = true,
  showLevel = false
}: GameLeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [timePeriod, setTimePeriod] = useState("week")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredData = data
    .filter(item => {
      const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.playerPhone.includes(searchTerm)
      const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }))

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone || typeof phone !== 'string') return 'Unknown'
    if (phone.length >= 7) {
      return `XXX-XXX-${phone.slice(-4)}`
    }
    return phone
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <IconTrophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <IconMedal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <IconMedal className="w-5 h-5 text-orange-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">🏆 Champion</Badge>
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800 border-gray-300">🥈 Runner-up</Badge>
    if (rank === 3) return <Badge className="bg-orange-100 text-orange-800 border-orange-300">🥉 Third Place</Badge>
    if (rank <= 10) return <Badge variant="outline">Top 10</Badge>
    if (rank <= 50) return <Badge variant="secondary">Top 50</Badge>
    return null
  }

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return null
    if (current < previous) return <span className="text-green-600 text-sm">↑ {previous - current}</span>
    if (current > previous) return <span className="text-red-600 text-sm">↓ {current - previous}</span>
    return <span className="text-gray-600 text-sm">—</span>
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const headers = ["Rank", "Player Name", "Phone", scoreLabel, "Level", "Time Spent", "Achievement", "Difficulty", "Timestamp", "Rank Change"]
    const rows = filteredData.map(item => [
      item.rank,
      item.playerName,
      formatPhoneNumber(item.playerPhone),
      item.score,
      item.level || "",
      formatTime(item.timeSpent),
      item.achievement,
      item.difficulty,
      formatDate(item.timestamp),
      item.previousRank ? `${item.rank - item.previousRank}` : "New"
    ])

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gameType.toLowerCase().replace(/\s+/g, "-")}-leaderboard.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map(period => (
                <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showDifficulty && (
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="relative">
            <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <IconDownload className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Top 3 Podium */}
      {currentData.length >= 3 && currentPage === 1 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {currentData.slice(0, 3).map((entry, index) => (
            <div key={entry.id} className={`text-center p-6 rounded-lg border-2 ${
              index === 0 ? 'border-yellow-300 bg-yellow-50' :
              index === 1 ? 'border-gray-300 bg-gray-50' :
              'border-orange-300 bg-orange-50'
            }`}>
              <div className="text-3xl mb-2">{getRankIcon(entry.rank)}</div>
              <div className="font-bold text-lg mb-1">{entry.playerName}</div>
              <div className="text-2xl font-bold mb-1">{entry.score.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mb-2">{formatPhoneNumber(entry.playerPhone)}</div>
              {showTimeSpent && (
                <div className="text-sm text-muted-foreground mb-2">
                  <IconTarget className="inline w-3 h-3 mr-1" />
                  {formatTime(entry.timeSpent)}
                </div>
              )}
              {showDifficulty && (
                <Badge className={getDifficultyColor(entry.difficulty)}>
                  {entry.difficulty}
                </Badge>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                {entry.achievement}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>{scoreLabel}</TableHead>
              {showLevel && <TableHead>Level</TableHead>}
              {showTimeSpent && <TableHead>Time</TableHead>}
              <TableHead>Achievement</TableHead>
              {showDifficulty && <TableHead>Difficulty</TableHead>}
              <TableHead>When</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id} className={item.rank <= 3 ? 'bg-muted/50' : ''}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRankIcon(item.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.playerName}</div>
                    <div className="text-sm text-muted-foreground">{formatPhoneNumber(item.playerPhone)}</div>
                    {getRankBadge(item.rank) && (
                      <div className="mt-1">
                        {getRankBadge(item.rank)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-lg">{item.score.toLocaleString()}</div>
                  {item.level && showLevel && (
                    <div className="text-sm text-muted-foreground">{item.level}</div>
                  )}
                </TableCell>
                {showLevel && (
                  <TableCell>
                    {item.level || '-'}
                  </TableCell>
                )}
                {showTimeSpent && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IconTarget className="h-3 w-3 text-muted-foreground" />
                      {formatTime(item.timeSpent)}
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="text-sm font-medium">{item.achievement}</div>
                </TableCell>
                {showDifficulty && (
                  <TableCell>
                    <Badge className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  {getRankChange(item.rank, item.previousRank)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} players
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}