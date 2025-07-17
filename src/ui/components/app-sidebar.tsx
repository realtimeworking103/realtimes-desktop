import * as React from "react";

import { SearchForm } from "@/ui/components/search-form";
import { VersionSwitcher } from "@/ui/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/ui/components/ui/sidebar";

import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavLink } from "react-router";

// This is sample data.
const data = {
  versions: ["1.0.0", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "DASHBOARD",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "LDPLAYER",
          url: "/ldplayer",
          icon: IconListDetails,
        },
        {
          title: "CREATE LDPLAYER",
          url: "/create-ldplayer",
          icon: IconChartBar,
        },
        {
          title: "MANAGER FILE",
          url: "/file",
          icon: IconFolder,
        },
        {
          title: "PROFILE",
          url: "/profile",
          icon: IconUsers,
        },
        {
          title: "SETTING",
          url: "/setting",
          icon: IconSettings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={url}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/20"
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

