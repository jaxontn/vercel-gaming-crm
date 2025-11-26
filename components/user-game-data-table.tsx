"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconSearch,
  IconDownload,
  IconCalendar,
  IconTrendingUp,
  IconTrophy,
  IconClock,
  IconTarget
} from "@tabler/icons-react"

interface UserGameData {
  id: string
  playerName: string
  playerPhone: string
  playerEmail?: string
  score: number
  level?: string
  timeSpent: number
  completionRate: number
  timestamp: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface UserGameDataTableProps {
  data: UserGameData[]
  gameType: string
  scoreLabel?: string
  additionalColumns?: Array<{
    key: string
    label: string
    render: (item: UserGameData) => React.ReactNode
  }>
}

export function UserGameDataTable({ data, gameType, scoreLabel = "Score", additionalColumns = [] }: UserGameDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("timestamp")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = data
    .filter(item => {
      const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.playerPhone.includes(searchTerm) ||
                           item.playerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score
        case "name":
          return a.playerName.localeCompare(b.playerName)
        case "time":
          return a.timeSpent - b.timeSpent
        case "completion":
          return b.completionRate - a.completionRate
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const headers = ["Player Name", "Phone", "Email", scoreLabel, "Level", "Time Spent", "Completion Rate", "Difficulty", "Timestamp"]
    const rows = filteredData.map(item => [
      item.playerName,
      formatPhoneNumber(item.playerPhone),
      item.playerEmail || "",
      item.score,
      item.level || "",
      formatTime(item.timeSpent),
      `${item.completionRate}%`,
      item.difficulty,
      formatDate(item.timestamp)
    ])

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gameType.toLowerCase().replace(/\s+/g, "-")}-user-data.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">Recent</SelectItem>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <IconDownload className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>{scoreLabel}</TableHead>
              {additionalColumns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Time</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.playerName}</div>
                    <div className="text-sm text-muted-foreground">{formatPhoneNumber(item.playerPhone)}</div>
                    {item.playerEmail && (
                      <div className="text-xs text-muted-foreground">{item.playerEmail}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-lg">{item.score.toLocaleString()}</div>
                  {item.level && (
                    <div className="text-sm text-muted-foreground">{item.level}</div>
                  )}
                </TableCell>
                {additionalColumns.map(col => (
                  <TableCell key={col.key}>
                    {col.render(item)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <IconClock className="h-3 w-3 text-muted-foreground" />
                    {formatTime(item.timeSpent)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm">{item.completionRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(item.difficulty)}>
                    {item.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <IconCalendar className="h-3 w-3 text-muted-foreground" />
                    {formatDate(item.timestamp)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
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