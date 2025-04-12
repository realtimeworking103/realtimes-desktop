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
import { routes } from "../routes";
import { NavLink } from "react-router";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "จัดการไลน์",
      url: "#",
      items: [
        {
          title: "สมัครไลน์",
          url: routes.lineManagement,
        },
      ],
    },
    {
      title: "LDPlayer",
      url: "#",
      items: [
        {
          title: "จัดการ LDPlayer",
          url: "/ldplayer-management",
        },
        {
          title: "สร้าง LDPlayer",
          url: "#",
        },
      ],
    },
    {
      title: "Manage Flex",
      url: "#",
      items: [
        {
          title: "เพิ่มบัญชีไลน์",
          url: "#",
        },
      ],
    },
    {
      title: "Setting",
      url: "#",
      items: [
        {
          title: "ทั่วไป",
          url: "#",
        },
        {
          title: "ชื่อและรูปภาพ",
          url: "#",
        },
        {
          title: "Proxy",
          url: "#",
        },
        {
          title: "Dataเบอร์",
          url: "#",
        },
        {
          title: "ไลน์ไก่",
          url: "#",
        },
        {
          title: "กำหนดสถานะ",
          url: "#",
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
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <NavLink to={item.url}>{item.title}</NavLink>
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
