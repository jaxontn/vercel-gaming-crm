"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "@tabler/icons-react"
import { callApi } from "@/lib/api-client"
import { NavDocuments } from "@/components/nav-documents"
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
const gameIcons: Record<string, typeof IconTrophy> = {
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

// Define types
interface GameData {
  game_code: string
  game_name: string
  icon: string
  is_enabled: boolean | string
}

// Transform game data from API to NavClouds format
const transformGamesToNavClouds = (games: GameData[]) => {
  // Group games by category
  const gameItems = games.map((game) => ({
    title: game.game_name,
    url: `/dashboard/gamification/${game.game_code}`,
    badge: (game.is_enabled === true || game.is_enabled === '1') ? 'Active' : 'Disabled',
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
  }]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [games, setGames] = React.useState<GameData[]>([])
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

          console.log('Sidebar API Response:', response) // Debug log

          if (response.status === 'SUCCESS' && response.data?.games) {
            console.log('Games found:', response.data.games) // Debug log
            setGames(response.data.games)
          } else {
            // No games available if API response is not successful
            console.log('No games found or API response not successful')
            console.log('Response status:', response.status)
            console.log('Response data:', response.data)
            setGames([])
          }
        } else {
          // User is not authenticated, no games available
          console.log('User not authenticated, no games to display')
          setGames([])
        }
      } catch (err) {
        console.error('Failed to fetch games:', err)
        // Set empty games array if API fails
        setGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Transform games to NavClouds format
  const navClouds = React.useMemo(() => {
    const transformed = transformGamesToNavClouds(games)
    console.log('Transformed navClouds:', transformed) // Debug log
    return transformed
  }, [games])

  // Enhanced NavClouds component that supports badges
  const NavCloudsWithBadges = ({ items, pathname }: { items: typeof navClouds; pathname: string }) => {
    console.log('NavCloudsWithBadges - loading:', loading, 'items:', items) // Debug log
    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <IconLoader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        <NavClouds items={items} pathname={pathname} />
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
              className="data-[slot=sidebar-menu-button]:!p-1.5 bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm"
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
        <NavMain items={data.navMain} pathname={pathname} />
        <NavCloudsWithBadges items={navClouds} pathname={pathname} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
