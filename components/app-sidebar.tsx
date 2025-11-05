"use client"

import * as React from "react"
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
    name: "CRM Admin",
    email: "admin@dataharvest.com",
    avatar: "/avatars/crm.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Campaigns",
      url: "#",
      icon: IconBulb,
    },
    {
      title: "Data Harvest",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Merchants",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Gamification",
      icon: IconTrophy,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Spin & Win",
          url: "#",
        },
        {
          title: "Loyalty Points",
          url: "#",
        },
        {
          title: "Challenges",
          url: "#",
        },
      ],
    },
    {
      title: "Lead Gen",
      icon: IconUserPlus,
      url: "#",
      items: [
        {
          title: "Email Capture",
          url: "#",
        },
        {
          title: "Social Sharing",
          url: "#",
        },
        {
          title: "Referral Program",
          url: "#",
        },
      ],
    },
    {
      title: "Promotions",
      icon: IconTarget,
      url: "#",
      items: [
        {
          title: "Flash Sales",
          url: "#",
        },
        {
          title: "VIP Access",
          url: "#",
        },
        {
          title: "Mystery Offers",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
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
      url: "#",
      icon: IconChartDots3,
    },
    {
      name: "Performance",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Automation",
      url: "#",
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
              <a href="#">
                <IconBulb className="!size-5" />
                <span className="text-base font-semibold">DataHarvest CRM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
