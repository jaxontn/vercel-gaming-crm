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
  IconUserPlus,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconChartDots3,
  IconGitBranch,
} from "@tabler/icons-react"

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
  navClouds: [
    {
      title: "Gamification",
      icon: IconTrophy,
      isActive: true,
      url: "/dashboard/gamification",
      items: [
        {
          title: "Spin & Win",
          url: "/dashboard/gamification/spin-win",
        },
        {
          title: "Memory Match",
          url: "/dashboard/gamification/memory-match",
        },
        {
          title: "Lucky Dice",
          url: "/dashboard/gamification/lucky-dice",
        },
        {
          title: "Quick Tap Challenge",
          url: "/dashboard/gamification/quick-tap",
        },
        {
          title: "Word Puzzle",
          url: "/dashboard/gamification/word-puzzle",
        },
        {
          title: "Color Match",
          url: "/dashboard/gamification/color-match",
        },
        {
          title: "Loyalty Points",
          url: "/dashboard/gamification/loyalty-points",
        },
        {
          title: "Challenges",
          url: "/dashboard/gamification/challenges",
        },
      ],
    },
    /*{ 
      title: "Lead Gen",
      icon: IconUserPlus,
      url: "/dashboard/lead-generation",
      items: [
        {
          title: "Email Capture",
          url: "/dashboard/lead-generation/email-capture",
        },
        {
          title: "Social Sharing",
          url: "/dashboard/lead-generation/social-sharing",
        },
        {
          title: "Referral Program",
          url: "/dashboard/lead-generation/referral-program",
        },
      ],
    },
    {
      title: "Promotions",
      icon: IconTarget,
      url: "/dashboard/promotions",
      items: [
        {
          title: "Flash Sales",
          url: "/dashboard/promotions/flash-sales",
        },
        {
          title: "VIP Access",
          url: "/dashboard/promotions/vip-access",
        },
        {
          title: "Mystery Offers",
          url: "/dashboard/promotions/mystery-offers",
        },
      ],
    }, */
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavClouds items={data.navClouds} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
