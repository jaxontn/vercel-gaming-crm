"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Switch,
} from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  IconSettings,
  IconBuildingStore,
  IconBell,
  IconLock,
  IconPalette,
  IconCreditCard,
  IconDeviceFloppy,
  IconCamera,
  IconUpload,
  IconDownload,
  IconShield,
  IconTrash,
  IconKey,
  IconMail,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter
} from "@tabler/icons-react"

interface StoreSettings {
  name: string
  description: string
  logo: string
  brandColor: string
  website: string
  phone: string
  email: string
  address: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  weeklyReports: boolean
  newCustomerAlerts: boolean
  campaignAlerts: boolean
  lowBalanceAlerts: boolean
}

interface GameSettings {
  dailySpinLimit: number
  pointsPerLevel: number
  welcomeBonus: number
  referralBonus: number
  shareBonus: number
  leaderboardEnabled: boolean
  achievementsEnabled: boolean
  socialSharingEnabled: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store")
  const [isLoading, setIsLoading] = useState(false)

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "Your Store",
    description: "Amazing products and great customer service",
    logo: "🏪",
    brandColor: "#8B5CF6",
    website: "https://yourstore.com",
    phone: "+1-555-123-4567",
    email: "contact@yourstore.com",
    address: "123 Main Street, City, State 12345"
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    newCustomerAlerts: true,
    campaignAlerts: true,
    lowBalanceAlerts: false
  })

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    dailySpinLimit: 3,
    pointsPerLevel: 100,
    welcomeBonus: 50,
    referralBonus: 25,
    shareBonus: 10,
    leaderboardEnabled: true,
    achievementsEnabled: true,
    socialSharingEnabled: true
  })

  const handleSaveStoreSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  const handleSaveNotificationSettings = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleSaveGameSettings = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="gamification">Gamification</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuildingStore className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Update your store details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input
                    id="store-phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="store-description">Description</Label>
                  <Input
                    id="store-description"
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="store-email">Email</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="store-website">Website</Label>
                  <Input
                    id="store-website"
                    value={storeSettings.website}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Input
                    id="store-address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                    {storeSettings.logo}
                  </div>
                  <div>
                    <h4 className="font-medium">Store Logo</h4>
                    <p className="text-sm text-muted-foreground">Upload your store logo or use emoji</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <IconCamera className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-color">Brand Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="brand-color"
                    type="color"
                    value={storeSettings.brandColor}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                    className="w-20 h-10"
                  />
                  <Input
                    value={storeSettings.brandColor}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                    placeholder="#8B5CF6"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: storeSettings.brandColor }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveStoreSettings} disabled={isLoading}>
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser notifications when active
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Summary of weekly performance
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Customer Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when new customers join
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newCustomerAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, newCustomerAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Campaign Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates on campaign performance
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.campaignAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, campaignAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Balance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when running low on credits
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowBalanceAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, lowBalanceAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotificationSettings} disabled={isLoading}>
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPalette className="h-5 w-5" />
                Gamification Settings
              </CardTitle>
              <CardDescription>
                Configure game mechanics and rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="daily-limit">Daily Spin Limit</Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    value={gameSettings.dailySpinLimit}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, dailySpinLimit: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum spins per user per day
                  </p>
                </div>
                <div>
                  <Label htmlFor="points-per-level">Points per Level</Label>
                  <Input
                    id="points-per-level"
                    type="number"
                    value={gameSettings.pointsPerLevel}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, pointsPerLevel: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points needed to advance to next level
                  </p>
                </div>
                <div>
                  <Label htmlFor="welcome-bonus">Welcome Bonus</Label>
                  <Input
                    id="welcome-bonus"
                    type="number"
                    value={gameSettings.welcomeBonus}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, welcomeBonus: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points given to new users
                  </p>
                </div>
                <div>
                  <Label htmlFor="referral-bonus">Referral Bonus</Label>
                  <Input
                    id="referral-bonus"
                    type="number"
                    value={gameSettings.referralBonus}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, referralBonus: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points for successful referrals
                  </p>
                </div>
                <div>
                  <Label htmlFor="share-bonus">Share Bonus</Label>
                  <Input
                    id="share-bonus"
                    type="number"
                    value={gameSettings.shareBonus}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, shareBonus: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points for social sharing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feature Toggles</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Leaderboard</Label>
                      <p className="text-sm text-muted-foreground">
                        Show competitive rankings
                      </p>
                    </div>
                    <Switch
                      checked={gameSettings.leaderboardEnabled}
                      onCheckedChange={(checked) =>
                        setGameSettings(prev => ({ ...prev, leaderboardEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Unlock badges and milestones
                      </p>
                    </div>
                    <Switch
                      checked={gameSettings.achievementsEnabled}
                      onCheckedChange={(checked) =>
                        setGameSettings(prev => ({ ...prev, achievementsEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Social Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing achievements
                      </p>
                    </div>
                    <Switch
                      checked={gameSettings.socialSharingEnabled}
                      onCheckedChange={(checked) =>
                        setGameSettings(prev => ({ ...prev, socialSharingEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGameSettings} disabled={isLoading}>
                  <IconDeviceFloppy className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Payment & Social Integrations
              </CardTitle>
              <CardDescription>
                Connect external services and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Processors</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Stripe</h4>
                      <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">PayPal</h4>
                      <p className="text-sm text-muted-foreground">PayPal and Venmo payments</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconBrandInstagram className="h-5 w-5 text-pink-500" />
                      <div>
                        <h4 className="font-medium">Instagram</h4>
                        <p className="text-sm text-muted-foreground">Connect Instagram Business</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconBrandFacebook className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Facebook</h4>
                        <p className="text-sm text-muted-foreground">Connect Facebook Page</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconBrandTwitter className="h-5 w-5 text-sky-500" />
                      <div>
                        <h4 className="font-medium">Twitter/X</h4>
                        <p className="text-sm text-muted-foreground">Connect Twitter Account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Messaging</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconBrandWhatsapp className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-muted-foreground">Send notifications via WhatsApp</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconMail className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Email Service</h4>
                        <p className="text-sm text-muted-foreground">Send marketing emails</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Enable 2FA</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <IconKey className="mr-2 h-4 w-4" />
                    Enable
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Access</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API Key</h4>
                      <p className="text-sm text-muted-foreground">sk_test_...</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <IconDownload className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data & Privacy</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <IconTrash className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}