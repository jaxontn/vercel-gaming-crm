"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconBulb,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconTarget,
  IconTrophy,
  IconSettings,
  IconHelp,
  IconSearch,
  IconChartDots3,
  IconGitBranch,
  IconLoader,
  IconBrain,
  IconDice,
  IconPointer,
  IconBook,
  IconPalette,
  IconStar,
  IconCoin,
  IconFlag,
  IconLoader2,
  type Icon,
} from "@tabler/icons-react"
import { callApi } from "@/lib/api-client"
import { NavMain } from "@/components/nav-main"
import { NavClouds } from "@/components/nav-clouds"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Icon mapping for games
const gameIcons: Record<string, Icon> = {
  spinner: IconLoader,
  brain: IconBrain,
  dice: IconDice,
  'hand-pointer': IconPointer,
  book: IconBook,
  palette: IconPalette,
  'gamepad': IconStar, // Default for legacy games
  'trophy': IconTrophy, // For achievements/challenges
  'coins': IconCoin,   // For loyalty points
  'flag': IconFlag,     // For challenges
}

interface Game {
  game_code: string
  game_name: string
  icon: string
  is_enabled: boolean
}

// Transform game data from API to NavClouds format
const transformGamesToNavClouds = (games: Game[]) => {
  // Group games by category
  const gameItems = games.map((game) => ({
    title: game.game_name,
    url: `/dashboard/gamification/${game.game_code}`,
    badge: game.is_enabled ? 'Active' : 'Disabled',
    icon: gameIcons[game.icon] || IconStar,
  }))

  // Add static gamification items that are not games
  const staticGamificationItems = [
    {
      title: "Loyalty Points",
      url: "/dashboard/gamification/loyalty-points",
      icon: IconCoin,
    },
    {
      title: "Challenges",
      url: "/dashboard/gamification/challenges",
      icon: IconFlag,
    },
  ]

  const allItems = [...gameItems, ...staticGamificationItems]

  return [{
    title: "Gamification",
    icon: IconTrophy,
    isActive: true,
    url: "/dashboard/gamification",
    items: allItems
  }] as {
    title: string
    icon: Icon
    url: string
    isActive?: boolean
    items: {
      title: string
      url: string
      badge?: string
      icon?: Icon
    }[]
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [games, setGames] = React.useState<Game[]>([])
  const [loading, setLoading] = React.useState(true)

  // Static navigation items (non-games)
  const data = {
    user: {
      name: "Merchant Admin",
      email: "admin@yourbusiness.com",
      avatar: "/avatars/merchant.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "QR Codes",
        url: "/dashboard/qr-codes",
        icon: IconTarget,
      },
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
        icon: IconBulb,
      },
      {
        title: "Customer Data",
        url: "/dashboard/customer-data",
        icon: IconDatabase,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: IconChartBar,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Customer Data",
        url: "/dashboard/customer-data",
        icon: IconChartDots3,
      },
      {
        name: "Performance",
        url: "/dashboard/analytics",
        icon: IconChartBar,
      },
      {
        name: "Automation",
        url: "/dashboard/campaigns",
        icon: IconGitBranch,
      },
    ],
  }

  // Fetch games from API
  React.useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)

        // Check if user is authenticated before making API call
        const userId = sessionStorage.getItem('id')
        const sessionSecret = sessionStorage.getItem('session_secret')

        if (userId && sessionSecret) {
          // User is authenticated, fetch games from API
          const response = await callApi('merchant_games', 'list')

          if (response.status === 'SUCCESS' && response.data?.games) {
            setGames(response.data.games)
          } else {
            // Set default games if API response is not successful
            setGames([
              {
                game_code: 'spin_win',
                game_name: 'Spin & Win',
                icon: 'spinner',
                is_enabled: true,
              },
              {
                game_code: 'memory_match',
                game_name: 'Memory Match',
                icon: 'brain',
                is_enabled: true,
              },
              {
                game_code: 'lucky_dice',
                game_name: 'Lucky Dice',
                icon: 'dice',
                is_enabled: false,
              },
              {
                game_code: 'quick_tap',
                game_name: 'Quick Tap Challenge',
                icon: 'hand-pointer',
                is_enabled: true,
              },
              {
                game_code: 'word_puzzle',
                game_name: 'Word Puzzle',
                icon: 'book',
                is_enabled: true,
              },
              {
                game_code: 'color_match',
                game_name: 'Color Match',
                icon: 'palette',
                is_enabled: false,
              },
            ])
          }
        } else {
          // User is not authenticated, set default games without API call
          console.log('User not authenticated, showing default games')
          setGames([
            {
              game_code: 'spin_win',
              game_name: 'Spin & Win',
              icon: 'spinner',
              is_enabled: true,
            },
            {
              game_code: 'memory_match',
              game_name: 'Memory Match',
              icon: 'brain',
              is_enabled: true,
            },
            {
              game_code: 'lucky_dice',
              game_name: 'Lucky Dice',
              icon: 'dice',
              is_enabled: false,
            },
            {
              game_code: 'quick_tap',
              game_name: 'Quick Tap Challenge',
              icon: 'hand-pointer',
              is_enabled: true,
            },
            {
              game_code: 'word_puzzle',
              game_name: 'Word Puzzle',
              icon: 'book',
              is_enabled: true,
            },
            {
              game_code: 'color_match',
              game_name: 'Color Match',
              icon: 'palette',
              is_enabled: false,
            },
          ])
        }
      } catch (err) {
        console.error('Failed to fetch games:', err)
        // Set default games if API fails
        setGames([
          {
            game_code: 'spin_win',
            game_name: 'Spin & Win',
            icon: 'spinner',
            is_enabled: true,
          },
          {
            game_code: 'memory_match',
            game_name: 'Memory Match',
            icon: 'brain',
            is_enabled: true,
          },
          {
            game_code: 'lucky_dice',
            game_name: 'Lucky Dice',
            icon: 'dice',
            is_enabled: false,
          },
          {
            game_code: 'quick_tap',
            game_name: 'Quick Tap Challenge',
            icon: 'hand-pointer',
            is_enabled: true,
          },
          {
            game_code: 'word_puzzle',
            game_name: 'Word Puzzle',
            icon: 'book',
            is_enabled: true,
          },
          {
            game_code: 'color_match',
            game_name: 'Color Match',
            icon: 'palette',
            is_enabled: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Transform games to NavClouds format
  const navClouds = React.useMemo(() => {
    return transformGamesToNavClouds(games)
  }, [games])

  // Enhanced NavClouds component that supports badges
  const NavCloudsWithBadges = ({ items }: { items: {
    title: string
    icon: Icon
    url: string
    isActive?: boolean
    items: {
      title: string
      url: string
      badge?: string
      icon?: Icon
    }[]
  }[] }) => {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <IconLoader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        <NavClouds items={items} />
      </div>
    )
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconBulb className="!size-5" />
                <span className="text-base font-semibold">Gamified CRM</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCloudsWithBadges items={navClouds} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}