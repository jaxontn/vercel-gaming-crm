"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronRight,
  type Icon,
} from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function NavClouds({
  items,
  pathname,
}: {
  items: {
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
  pathname?: string
}) {
  //console.log('NavClouds component - items received:', items) // Debug log

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gamification</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          //console.log(`NavClouds - rendering item: ${item.title}, items count: ${item.items?.length || 0}`)
          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={pathname?.startsWith(item.url) ? "bg-violet-100 text-violet-900 hover:bg-violet-200" : ""}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu key={`${item.title}-submenu`}>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          className={pathname === subItem.url ? "bg-violet-100 text-violet-900 hover:bg-violet-200" : ""}
                        >
                          <Link href={subItem.url}>
                            {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                            <span className="text-sm">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {subItem.badge && (
                          <SidebarMenuBadge>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${subItem.badge === 'Active'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}>
                              {subItem.badge}
                            </span>
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}