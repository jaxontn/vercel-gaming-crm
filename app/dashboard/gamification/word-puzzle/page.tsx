"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Switch,
} from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  IconTrophy,
  IconSettings,
  IconUsers,
  IconTarget,
  IconTrendingUp,
  IconClock,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGift,
  IconStar,
  IconDeviceGamepad,
  IconPlayerPlay
} from "@tabler/icons-react"
import { UserGameDataTable } from "@/components/user-game-data-table"
import { GameLeaderboard } from "@/components/game-leaderboard"

interface PuzzleWord {
  id: string
  word: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  hint: string
  pointsReward: number
  timesSolved: number
}

interface WordPuzzleStats {
  totalGames: number
  todayGames: number
  uniquePlayers: number
  avgSolveTime: number
  successRate: number
  wordsCompleted: number
}

const mockWords: PuzzleWord[] = [
  { id: "1", word: "CUSTOMER", category: "Business", difficulty: "Easy", hint: "Someone who buys goods or services", pointsReward: 30, timesSolved: 342 },
  { id: "2", word: "LOYALTY", category: "Business", difficulty: "Medium", hint: "Faithful support to a brand", pointsReward: 45, timesSolved: 256 },
  { id: "3", word: "CHALLENGE", category: "General", difficulty: "Medium", hint: "A task that tests abilities", pointsReward: 40, timesSolved: 198 },
  { id: "4", word: "ENGAGEMENT", category: "Business", difficulty: "Hard", hint: "Interaction and involvement", pointsReward: 60, timesSolved: 87 },
  { id: "5", word: "GAMIFICATION", category: "Technology", difficulty: "Hard", hint: "Applying game elements to non-game contexts", pointsReward: 75, timesSolved: 45 }
]

const mockStats: WordPuzzleStats = {
  totalGames: 2147,
  todayGames: 128,
  uniquePlayers: 923,
  avgSolveTime: 89.5,
  successRate: 71.2,
  wordsCompleted: 1876
}

export default function WordPuzzlePage() {
  const [words, setWords] = useState<PuzzleWord[]>(mockWords)
  const [stats] = useState<WordPuzzleStats>(mockStats)
  const [isWordDialogOpen, setIsWordDialogOpen] = useState(false)
  const [newWord, setNewWord] = useState({
    word: "",
    category: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    hint: "",
    pointsReward: ""
  })
  const [isGameActive, setIsGameActive] = useState(true)
  const [dailyAttempts, setDailyAttempts] = useState(8)

  const handleAddWord = () => {
    const word: PuzzleWord = {
      id: Date.now().toString(),
      word: newWord.word,
      category: newWord.category,
      difficulty: newWord.difficulty,
      hint: newWord.hint,
      pointsReward: parseInt(newWord.pointsReward) || 30,
      timesSolved: 0
    }

    setWords([...words, word])
    setNewWord({
      word: "",
      category: "",
      difficulty: "Easy",
      hint: "",
      pointsReward: ""
    })
    setIsWordDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Word Puzzle</h2>
          <p className="text-muted-foreground">Manage your word unscrambling game configuration and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isWordDialogOpen} onOpenChange={setIsWordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Word
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Word Puzzle</DialogTitle>
                <DialogDescription>
                  Add a new word to the word puzzle game.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="puzzle-word">Word</Label>
                  <Input
                    id="puzzle-word"
                    placeholder="e.g., PUZZLE"
                    value={newWord.word}
                    onChange={(e) => setNewWord(prev => ({ ...prev, word: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div>
                  <Label htmlFor="word-category">Category</Label>
                  <Input
                    id="word-category"
                    placeholder="e.g., Technology"
                    value={newWord.category}
                    onChange={(e) => setNewWord(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="word-difficulty">Difficulty</Label>
                    <Select value={newWord.difficulty} onValueChange={(value: "Easy" | "Medium" | "Hard") => setNewWord(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="word-points">Points Reward</Label>
                    <Input
                      id="word-points"
                      type="number"
                      placeholder="40"
                      value={newWord.pointsReward}
                      onChange={(e) => setNewWord(prev => ({ ...prev, pointsReward: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="word-hint">Hint</Label>
                  <Input
                    id="word-hint"
                    placeholder="Helpful hint for the player"
                    value={newWord.hint}
                    onChange={(e) => setNewWord(prev => ({ ...prev, hint: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsWordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWord} disabled={!newWord.word || !newWord.category}>
                  Add Word
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +19.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Games</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayGames}</div>
            <p className="text-xs text-muted-foreground">
              +11.8% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Players</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniquePlayers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +27.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Solve Time</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSolveTime}s</div>
            <p className="text-xs text-muted-foreground">
              -5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              High completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Solved</CardTitle>
            <IconDeviceGamepad className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wordsCompleted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total completions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSettings className="h-5 w-5" />
              Game Settings
            </CardTitle>
            <CardDescription>
              Configure the word puzzle game behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Game Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the game for players
                </p>
              </div>
              <Switch
                checked={isGameActive}
                onCheckedChange={setIsGameActive}
              />
            </div>
            <div>
              <Label htmlFor="daily-attempts">Daily Attempts Limit</Label>
              <Input
                id="daily-attempts"
                type="number"
                value={dailyAttempts}
                onChange={(e) => setDailyAttempts(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum puzzles per player per day
              </p>
            </div>
            <div>
              <Label htmlFor="hints-allowed">Hints Per Game</Label>
              <Input
                id="hints-allowed"
                type="number"
                defaultValue="3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of hints available per puzzle
              </p>
            </div>
            <Button className="w-full">
              <IconSettings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Word Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceGamepad className="h-5 w-5" />
              Word Library
            </CardTitle>
            <CardDescription>
              Manage your puzzle word collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Words</span>
                <Badge variant="outline">{words.length}</Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {words.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{word.word}</div>
                      <div className="text-xs text-muted-foreground">
                        {word.category} • {word.hint}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={word.difficulty === "Easy" ? "default" : word.difficulty === "Medium" ? "secondary" : "destructive"}>
                          {word.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Solved {word.timesSolved} times
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-bold text-sm">{word.pointsReward} pts</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <IconEdit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Track how your word puzzle game is performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockWords.filter(w => w.difficulty === "Easy").reduce((sum, w) => sum + w.timesSolved, 0)}</div>
              <div className="text-sm text-muted-foreground">Easy Words Solved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockWords.filter(w => w.difficulty === "Medium").reduce((sum, w) => sum + w.timesSolved, 0)}</div>
              <div className="text-sm text-muted-foreground">Medium Words Solved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockWords.filter(w => w.difficulty === "Hard").reduce((sum, w) => sum + w.timesSolved, 0)}</div>
              <div className="text-sm text-muted-foreground">Hard Words Solved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Game Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPlayerPlay className="h-5 w-5" />
            User Game Data
          </CardTitle>
          <CardDescription>
            Track individual player performance and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserGameDataTable
            gameType="word-puzzle"
            scoreLabel="Words Solved"
            additionalColumns={[
              {
                key: "wordsFound",
                label: "Words Found",
                render: (item: any) => item.wordsFound || 0
              },
              {
                key: "hintsUsed",
                label: "Hints Used",
                render: (item: any) => item.hintsUsed || 0
              }
            ]}
            data={[
              { id: "1", playerName: "Word Wizard", playerPhone: "+1-555-0101", playerEmail: "wizard@example.com", score: 342, level: "18", timeSpent: 16200, completionRate: 89.2, timestamp: "2025-11-24T14:30:00Z", difficulty: "Hard", wordsFound: 89, hintsUsed: 12 },
              { id: "2", playerName: "Puzzle Master", playerPhone: "+1-555-0102", playerEmail: "master@example.com", score: 298, level: "16", timeSpent: 13500, completionRate: 85.7, timestamp: "2025-11-24T12:30:00Z", difficulty: "Hard", wordsFound: 76, hintsUsed: 8 },
              { id: "3", playerName: "Vocabulary King", playerPhone: "+1-555-0103", score: 276, level: "14", timeSpent: 19200, completionRate: 82.1, timestamp: "2025-11-24T09:30:00Z", difficulty: "Medium", wordsFound: 71, hintsUsed: 15 },
              { id: "4", playerName: "Word Detective", playerPhone: "+1-555-0104", playerEmail: "detective@example.com", score: 234, level: "12", timeSpent: 11400, completionRate: 78.3, timestamp: "2025-11-24T03:30:00Z", difficulty: "Medium", wordsFound: 58, hintsUsed: 6 },
              { id: "5", playerName: "Letter Solver", playerPhone: "+1-555-0105", score: 198, level: "10", timeSpent: 10200, completionRate: 74.5, timestamp: "2025-11-23T14:30:00Z", difficulty: "Medium", wordsFound: 49, hintsUsed: 9 }
            ] as any[]}
          />
        </CardContent>
      </Card>

      {/* Game Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5" />
            Game Leaderboard
          </CardTitle>
          <CardDescription>
            Top players competing for the most words solved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameLeaderboard
            gameType="word-puzzle"
            scoreLabel="Total Words Solved"
            showLevel={true}
            showDifficulty={true}
            data={[
              { id: "1", rank: 1, playerName: "Word Wizard", playerPhone: "+1-555-0101", score: 342, level: "18", timeSpent: 16200, achievement: "Word Master", timestamp: "2025-11-24T14:30:00Z", difficulty: "Hard" },
              { id: "2", rank: 2, playerName: "Puzzle Master", playerPhone: "+1-555-0102", score: 298, level: "16", timeSpent: 13500, achievement: "Puzzle Expert", timestamp: "2025-11-24T12:30:00Z", difficulty: "Hard" },
              { id: "3", rank: 3, playerName: "Vocabulary King", playerPhone: "+1-555-0103", score: 276, level: "14", timeSpent: 19200, achievement: "Vocabulary Pro", timestamp: "2025-11-24T09:30:00Z", difficulty: "Hard" },
              { id: "4", rank: 4, playerName: "Word Detective", playerPhone: "+1-555-0104", score: 234, level: "12", timeSpent: 11400, achievement: "Word Hunter", timestamp: "2025-11-24T03:30:00Z", difficulty: "Medium" },
              { id: "5", rank: 5, playerName: "Letter Solver", playerPhone: "+1-555-0105", score: 198, level: "10", timeSpent: 10200, achievement: "Letter Master", timestamp: "2025-11-23T14:30:00Z", difficulty: "Medium" },
              { id: "6", rank: 6, playerName: "Crossword Pro", playerPhone: "+1-555-0106", score: 165, level: "9", timeSpent: 8100, achievement: "Crossword Expert", timestamp: "2025-11-22T16:30:00Z", difficulty: "Medium" },
              { id: "7", rank: 7, playerName: "Word Explorer", playerPhone: "+1-555-0107", score: 134, level: "7", timeSpent: 6000, achievement: "Word Adventurer", timestamp: "2025-11-22T10:30:00Z", difficulty: "Easy" },
              { id: "8", rank: 8, playerName: "Puzzle Novice", playerPhone: "+1-555-0108", score: 98, level: "5", timeSpent: 4800, achievement: "Puzzle Learner", timestamp: "2025-11-21T14:30:00Z", difficulty: "Easy" }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}