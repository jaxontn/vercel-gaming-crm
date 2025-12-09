"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconSettings,
  IconTrophy,
  IconTarget,
  IconShield,
  IconUsers,
  IconTrendingUp,
  IconAlertTriangle,
  IconRefresh
} from "@tabler/icons-react"

interface GameConfigProps {
  gameId: string
  gameName: string
  gameCode: string
  initialConfig?: any
  onSave?: (config: any) => void
}

interface ConfigSection {
  title: string
  icon: any
  fields: ConfigField[]
}

interface ConfigField {
  key: string
  label: string
  type: "switch" | "number" | "text" | "select" | "slider" | "textarea"
  description?: string
  options?: string[]
  min?: number
  max?: number
  step?: number
  default?: any
}

export function GameConfig({ gameId, gameName, gameCode, initialConfig, onSave }: GameConfigProps) {
  const [config, setConfig] = useState(initialConfig || getDefaultConfig(gameCode))
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function getDefaultConfig(gameType: string) {
    const baseConfig = {
      isGameActive: true,
      dailyPlayLimit: 5,
      pointMultiplier: 1.0,
      soundEnabled: true,
      animationEnabled: true,
      sessionTimeout: 30
    }

    switch (gameType) {
      case "spin-win":
        return {
          ...baseConfig,
          spinDuration: 3,
          autoSpin: false,
          jackpotEnabled: true,
          jackpotPool: 5000,
          bonusSpinFrequency: 10
        }
      case "memory-match":
        return {
          ...baseConfig,
          gridDifficulty: "medium",
          timeLimit: 60,
          revealTime: 1,
          minMatches: 3,
          bonusPoints: 50
        }
      case "lucky-dice":
        return {
          ...baseConfig,
          diceCount: 2,
          targetNumber: 7,
          maxRolls: 3,
          bonusForDoubles: true,
          streakBonus: 10
        }
      case "quick-tap":
        return {
          ...baseConfig,
          gameDuration: 30,
          targetFrequency: 2,
          minReactionTime: 0.5,
          comboMultiplier: true,
          maxCombo: 10
        }
      case "word-puzzle":
        return {
          ...baseConfig,
          difficulty: "medium",
          wordLength: [4, 6],
          timePerWord: 30,
          hintCost: 10,
          bonusForSpeed: true
        }
      case "color-match":
        return {
          ...baseConfig,
          colorCount: 4,
          patternLength: 4,
          timeLimit: 45,
          revealPattern: false,
          mistakeLimit: 3
        }
      default:
        return baseConfig
    }
  }

  const configSections: ConfigSection[] = getConfigSections(gameCode)

  function getConfigSections(gameType: string): ConfigSection[] {
    const basicSection: ConfigSection = {
      title: "Basic Settings",
      icon: IconSettings,
      fields: [
        {
          key: "isGameActive",
          label: "Game Status",
          type: "switch",
          description: "Enable or disable the game for players"
        },
        {
          key: "dailyPlayLimit",
          label: "Daily Play Limit",
          type: "number",
          description: "Maximum plays per player per day",
          min: 1,
          max: 20
        },
        {
          key: "pointMultiplier",
          label: "Point Multiplier",
          type: "slider",
          description: "Multiply all points earned",
          min: 0.5,
          max: 5,
          step: 0.1,
          default: 1.0
        },
        {
          key: "sessionTimeout",
          label: "Session Timeout (minutes)",
          type: "number",
          description: "Auto-logout after inactivity",
          default: 30
        }
      ]
    }

    const gameSpecificSections: ConfigSection[] = []

    switch (gameType) {
      case "spin-win":
        gameSpecificSections.push({
          title: "Wheel Settings",
          icon: IconTrophy,
          fields: [
            {
              key: "spinDuration",
              label: "Spin Duration (seconds)",
              type: "number",
              min: 1,
              max: 10,
              default: 3
            },
            {
              key: "autoSpin",
              label: "Auto Spin",
              type: "switch",
              description: "Enable auto-play feature"
            },
            {
              key: "jackpotEnabled",
              label: "Jackpot",
              type: "switch",
              description: "Enable progressive jackpot"
            },
            {
              key: "jackpotPool",
              label: "Jackpot Pool (points)",
              type: "number",
              min: 1000,
              default: 5000
            },
            {
              key: "bonusSpinFrequency",
              label: "Bonus Spin Frequency",
              type: "number",
              description: "Every N spins grant a bonus",
              min: 5,
              max: 50,
              default: 10
            }
          ]
        })
        break

      case "memory-match":
        gameSpecificSections.push({
          title: "Game Rules",
          icon: IconTarget,
          fields: [
            {
              key: "gridDifficulty",
              label: "Grid Size",
              type: "select",
              options: ["Easy (4x4)", "Medium (6x6)", "Hard (8x8)"],
              default: "Medium (6x6)"
            },
            {
              key: "timeLimit",
              label: "Time Limit (seconds)",
              type: "number",
              min: 30,
              max: 300,
              default: 60
            },
            {
              key: "revealTime",
              label: "Card Reveal Time (seconds)",
              type: "number",
              min: 0.5,
              max: 3,
              step: 0.5,
              default: 1
            },
            {
              key: "minMatches",
              label: "Minimum Matches to Win",
              type: "number",
              min: 1,
              max: 10,
              default: 3
            }
          ]
        })
        break

      case "lucky-dice":
        gameSpecificSections.push({
          title: "Dice Rules",
          icon: IconTarget,
          fields: [
            {
              key: "diceCount",
              label: "Number of Dice",
              type: "select",
              options: ["1", "2", "3"],
              default: "2"
            },
            {
              key: "targetNumber",
              label: "Target Number",
              type: "number",
              min: 2,
              max: 18,
              default: 7
            },
            {
              key: "maxRolls",
              label: "Max Rolls per Game",
              type: "number",
              min: 1,
              max: 10,
              default: 3
            },
            {
              key: "bonusForDoubles",
              label: "Bonus for Doubles",
              type: "switch",
              description: "Extra points for rolling same numbers"
            },
            {
              key: "streakBonus",
              label: "Streak Bonus (points)",
              type: "number",
              min: 0,
              max: 50,
              default: 10
            }
          ]
        })
        break

      case "quick-tap":
        gameSpecificSections.push({
          title: "Speed Settings",
          icon: IconTrendingUp,
          fields: [
            {
              key: "gameDuration",
              label: "Game Duration (seconds)",
              type: "number",
              min: 15,
              max: 120,
              default: 30
            },
            {
              key: "targetFrequency",
              label: "Target Frequency (per second)",
              type: "slider",
              min: 1,
              max: 5,
              step: 0.5,
              default: 2
            },
            {
              key: "minReactionTime",
              label: "Min Reaction Time (ms)",
              type: "number",
              min: 200,
              max: 1000,
              step: 100,
              default: 500
            },
            {
              key: "comboMultiplier",
              label: "Combo Multiplier",
              type: "switch",
              description: "Multiply points for consecutive hits"
            },
            {
              key: "maxCombo",
              label: "Max Combo",
              type: "number",
              min: 5,
              max: 50,
              default: 10
            }
          ]
        })
        break
    }

    const experienceSection: ConfigSection = {
      title: "Player Experience",
      icon: IconUsers,
      fields: [
        {
          key: "soundEnabled",
          label: "Sound Effects",
          type: "switch",
          description: "Play sounds during game"
        },
        {
          key: "animationEnabled",
          label: "Animations",
          type: "switch",
          description: "Enable visual effects"
        },
        {
          key: "showLeaderboard",
          label: "Show Leaderboard",
          type: "switch",
          description: "Display top players"
        },
        {
          key: "difficultyMode",
          label: "Difficulty Mode",
          type: "select",
          options: ["Easy", "Normal", "Hard", "Adaptive"],
          default: "Normal"
        }
      ]
    }

    const restrictionsSection: ConfigSection = {
      title: "Restrictions",
      icon: IconShield,
      fields: [
        {
          key: "minAge",
          label: "Minimum Age",
          type: "number",
          min: 13,
          max: 21,
          default: 18
        },
        {
          key: "maxDailyPoints",
          label: "Max Daily Points",
          type: "number",
          min: 100,
          max: 10000,
          default: 1000
        },
        {
          key: "cooldownPeriod",
          label: "Cooldown Period (seconds)",
          type: "number",
          min: 0,
          max: 300,
          default: 60,
          description: "Wait time between plays"
        },
        {
          key: "geoRestrictions",
          label: "Geo Restrictions",
          type: "select",
          options: ["None", "Allowed Countries", "Blocked Countries"],
          default: "None"
        }
      ]
    }

    return [basicSection, ...gameSpecificSections, experienceSection, restrictionsSection]
  }

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    if (onSave) {
      await onSave(config)
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHasChanges(false)
    setIsSaving(false)
  }

  const handleReset = () => {
    setConfig(getDefaultConfig(gameCode))
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{gameName} Configuration</h3>
          <p className="text-sm text-muted-foreground">Game ID: {gameId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <IconRefresh className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center space-x-2">
          <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            You have unsaved changes. Remember to save them before leaving.
          </span>
        </div>
      )}

      <div className="grid gap-6">
        {configSections.map((section) => {
          const IconComponent = section.icon
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    {field.type === "switch" ? (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{field.label}</Label>
                          {field.description && (
                            <p className="text-sm text-muted-foreground">{field.description}</p>
                          )}
                        </div>
                        <Switch
                          checked={config[field.key] || false}
                          onCheckedChange={(checked) => updateConfig(field.key, checked)}
                        />
                      </div>
                    ) : field.type === "number" ? (
                      <div>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={config[field.key] || field.default || ""}
                          onChange={(e) => updateConfig(field.key, parseInt(e.target.value) || 0)}
                        />
                        {field.description && (
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        )}
                      </div>
                    ) : field.type === "text" || field.type === "textarea" ? (
                      <div>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          value={config[field.key] || ""}
                          onChange={(e) => updateConfig(field.key, e.target.value)}
                        />
                        {field.description && (
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        )}
                      </div>
                    ) : field.type === "select" ? (
                      <div>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Select
                          value={config[field.key] || field.default}
                          onValueChange={(value) => updateConfig(field.key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.description && (
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        )}
                      </div>
                    ) : field.type === "slider" ? (
                      <div>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <div className="pt-2">
                          <Slider
                            value={[config[field.key] || field.default || 1]}
                            onValueChange={([value]) => updateConfig(field.key, value)}
                            max={field.max || 10}
                            min={field.min || 0}
                            step={field.step || 0.1}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Current: {config[field.key] || field.default || 1}
                            {field.key === "pointMultiplier" && "x"}
                          </p>
                        </div>
                        {field.description && (
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={config.isGameActive ? "default" : "secondary"}>
                {config.isGameActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Game Status</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{config.dailyPlayLimit || 0}</p>
              <p className="text-xs text-muted-foreground">Daily Limit</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{config.pointMultiplier || 1}x</p>
              <p className="text-xs text-muted-foreground">Point Multiplier</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{config.sessionTimeout || 30}m</p>
              <p className="text-xs text-muted-foreground">Session Timeout</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}