"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import {
  IconSettings,
  IconBell,
  IconLock,
  IconClock,
  IconActivity,
  IconShield,
  IconBolt,
  IconUsers,
  IconTarget,
  IconAlertTriangle,
  IconDownload,
  IconTrophy,
  IconRefresh
} from "@tabler/icons-react"

interface GameSettings {
  basic: {
    isGameActive: boolean
    dailyPlayLimit: number
    sessionTimeout: number
    spinDuration: number
    autoSpin: boolean
    soundEnabled: boolean
    animationEnabled: boolean
  }
  rewards: {
    pointMultiplier: number
    loyaltyPointsEnabled: boolean
    loyaltyPointsRatio: number
    bonusSpinFrequency: number
    jackpotEnabled: boolean
    jackpotPool: number
    progressiveResetTime: string
  }
  restrictions: {
    minAge: number
    geoRestrictions: string[]
    ipLimit: number
    cooldownPeriod: number
    maxDailyPrize: number
    weeklyPlayLimit: number
  }
  notifications: {
    pushEnabled: boolean
    emailEnabled: boolean
    smsEnabled: boolean
    dailyReminder: boolean
    winAlert: boolean
    milestoneAlert: boolean
    maintenanceAlert: boolean
  }
  analytics: {
    detailedTracking: boolean
    heatmapEnabled: boolean
    sessionRecording: boolean
    exportData: boolean
    realTimeStats: boolean
  }
}

const mockSettings: GameSettings = {
  basic: {
    isGameActive: true,
    dailyPlayLimit: 5,
    sessionTimeout: 30,
    spinDuration: 3,
    autoSpin: false,
    soundEnabled: true,
    animationEnabled: true
  },
  rewards: {
    pointMultiplier: 1.0,
    loyaltyPointsEnabled: true,
    loyaltyPointsRatio: 0.1,
    bonusSpinFrequency: 10,
    jackpotEnabled: true,
    jackpotPool: 5000,
    progressiveResetTime: "00:00"
  },
  restrictions: {
    minAge: 18,
    geoRestrictions: ["US", "CA", "GB"],
    ipLimit: 3,
    cooldownPeriod: 60,
    maxDailyPrize: 1000,
    weeklyPlayLimit: 30
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    dailyReminder: true,
    winAlert: true,
    milestoneAlert: true,
    maintenanceAlert: true
  },
  analytics: {
    detailedTracking: true,
    heatmapEnabled: false,
    sessionRecording: false,
    exportData: true,
    realTimeStats: true
  }
}

export default function SpinWinSettingsPage() {
  const [settings, setSettings] = useState<GameSettings>(mockSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (category: keyof GameSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHasChanges(false)
    setIsSaving(false)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    setHasChanges(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Game Settings</h2>
          <p className="text-muted-foreground">Configure Spin & Win game behavior and features</p>
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
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Remember to save them before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Basic Settings */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="h-5 w-5" />
                Game Configuration
              </CardTitle>
              <CardDescription>
                Basic game settings and player experience options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Game Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the game for all players
                  </p>
                </div>
                <Switch
                  checked={settings.basic.isGameActive}
                  onCheckedChange={(checked) => updateSetting('basic', 'isGameActive', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="daily-limit">Daily Play Limit</Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    value={settings.basic.dailyPlayLimit}
                    onChange={(e) => updateSetting('basic', 'dailyPlayLimit', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum spins per player per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.basic.sessionTimeout}
                    onChange={(e) => updateSetting('basic', 'sessionTimeout', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="spin-duration">Spin Duration (seconds)</Label>
                  <Input
                    id="spin-duration"
                    type="number"
                    value={settings.basic.spinDuration}
                    onChange={(e) => updateSetting('basic', 'spinDuration', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    How long the wheel spins
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Point Multiplier</Label>
                  <div className="pt-2">
                    <Slider
                      value={[settings.rewards.pointMultiplier]}
                      onValueChange={([value]) => updateSetting('rewards', 'pointMultiplier', value)}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {settings.rewards.pointMultiplier}x
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Spin</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable auto-play feature
                    </p>
                  </div>
                  <Switch
                    checked={settings.basic.autoSpin}
                    onCheckedChange={(checked) => updateSetting('basic', 'autoSpin', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-xs text-muted-foreground">
                      Play sounds during game
                    </p>
                  </div>
                  <Switch
                    checked={settings.basic.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('basic', 'soundEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable visual effects
                    </p>
                  </div>
                  <Switch
                    checked={settings.basic.animationEnabled}
                    onCheckedChange={(checked) => updateSetting('basic', 'animationEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Settings */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTrophy className="h-5 w-5" />
                Reward System
              </CardTitle>
              <CardDescription>
                Configure prize pools, loyalty points, and bonus features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jackpot-pool">Jackpot Pool (points)</Label>
                  <Input
                    id="jackpot-pool"
                    type="number"
                    value={settings.rewards.jackpotPool}
                    onChange={(e) => updateSetting('rewards', 'jackpotPool', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum jackpot amount
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus-frequency">Bonus Spin Frequency</Label>
                  <Input
                    id="bonus-frequency"
                    type="number"
                    value={settings.rewards.bonusSpinFrequency}
                    onChange={(e) => updateSetting('rewards', 'bonusSpinFrequency', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Every N spins grant a bonus
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Jackpot Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable progressive jackpot prizes
                    </p>
                  </div>
                  <Switch
                    checked={settings.rewards.jackpotEnabled}
                    onCheckedChange={(checked) => updateSetting('rewards', 'jackpotEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Loyalty Points</Label>
                    <p className="text-sm text-muted-foreground">
                      Earn points for playing
                    </p>
                  </div>
                  <Switch
                    checked={settings.rewards.loyaltyPointsEnabled}
                    onCheckedChange={(checked) => updateSetting('rewards', 'loyaltyPointsEnabled', checked)}
                  />
                </div>

                {settings.rewards.loyaltyPointsEnabled && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="loyalty-ratio">Loyalty Points Ratio</Label>
                    <Input
                      id="loyalty-ratio"
                      type="number"
                      step="0.01"
                      value={settings.rewards.loyaltyPointsRatio}
                      onChange={(e) => updateSetting('rewards', 'loyaltyPointsRatio', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Points earned per spin
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-time">Progressive Reset Time</Label>
                  <Input
                    id="reset-time"
                    type="time"
                    value={settings.rewards.progressiveResetTime}
                    onChange={(e) => updateSetting('rewards', 'progressiveResetTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time when progressive prizes reset
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restrictions Settings */}
        <TabsContent value="restrictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLock className="h-5 w-5" />
                Player Restrictions
              </CardTitle>
              <CardDescription>
                Set limits and restrictions for fair gameplay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min-age">Minimum Age</Label>
                  <Input
                    id="min-age"
                    type="number"
                    value={settings.restrictions.minAge}
                    onChange={(e) => updateSetting('restrictions', 'minAge', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum player age requirement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-prize">Max Daily Prize (points)</Label>
                  <Input
                    id="max-prize"
                    type="number"
                    value={settings.restrictions.maxDailyPrize}
                    onChange={(e) => updateSetting('restrictions', 'maxDailyPrize', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum points per player per day
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ip-limit">IP Limit</Label>
                  <Input
                    id="ip-limit"
                    type="number"
                    value={settings.restrictions.ipLimit}
                    onChange={(e) => updateSetting('restrictions', 'ipLimit', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max players per IP
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldown">Cooldown (seconds)</Label>
                  <Input
                    id="cooldown"
                    type="number"
                    value={settings.restrictions.cooldownPeriod}
                    onChange={(e) => updateSetting('restrictions', 'cooldownPeriod', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Wait between spins
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekly-limit">Weekly Play Limit</Label>
                  <Input
                    id="weekly-limit"
                    type="number"
                    value={settings.restrictions.weeklyPlayLimit}
                    onChange={(e) => updateSetting('restrictions', 'weeklyPlayLimit', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max spins per week
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Geo Restrictions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.restrictions.geoRestrictions.map((code) => (
                    <Badge key={code} variant="secondary">
                      {code}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Allowed countries for gameplay
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure player notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Notification Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Push Notifications</Label>
                      <Switch
                        checked={settings.notifications.pushEnabled}
                        onCheckedChange={(checked) => updateSetting('notifications', 'pushEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Email Notifications</Label>
                      <Switch
                        checked={settings.notifications.emailEnabled}
                        onCheckedChange={(checked) => updateSetting('notifications', 'emailEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>SMS Notifications</Label>
                      <Switch
                        checked={settings.notifications.smsEnabled}
                        onCheckedChange={(checked) => updateSetting('notifications', 'smsEnabled', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Notification Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Reminder</Label>
                        <p className="text-xs text-muted-foreground">
                          Remind players to play
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.dailyReminder}
                        onCheckedChange={(checked) => updateSetting('notifications', 'dailyReminder', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Win Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Notify on big wins
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.winAlert}
                        onCheckedChange={(checked) => updateSetting('notifications', 'winAlert', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Milestone Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Achievement notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.milestoneAlert}
                        onCheckedChange={(checked) => updateSetting('notifications', 'milestoneAlert', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Downtime notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.maintenanceAlert}
                        onCheckedChange={(checked) => updateSetting('notifications', 'maintenanceAlert', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconActivity className="h-5 w-5" />
                Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Configure data collection and analytics features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Detailed Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track all player actions
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics.detailedTracking}
                      onCheckedChange={(checked) => updateSetting('analytics', 'detailedTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Heatmap Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Track click patterns
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics.heatmapEnabled}
                      onCheckedChange={(checked) => updateSetting('analytics', 'heatmapEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Recording</Label>
                      <p className="text-sm text-muted-foreground">
                        Record gameplay sessions
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics.sessionRecording}
                      onCheckedChange={(checked) => updateSetting('analytics', 'sessionRecording', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Real-time Stats</Label>
                      <p className="text-sm text-muted-foreground">
                        Live dashboard updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics.realTimeStats}
                      onCheckedChange={(checked) => updateSetting('analytics', 'realTimeStats', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Export Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow data exports
                      </p>
                    </div>
                    <Switch
                      checked={settings.analytics.exportData}
                      onCheckedChange={(checked) => updateSetting('analytics', 'exportData', checked)}
                    />
                  </div>

                  <Alert>
                    <IconShield className="h-4 w-4" />
                    <AlertDescription>
                      All analytics data is anonymized and stored securely in compliance with privacy regulations.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}