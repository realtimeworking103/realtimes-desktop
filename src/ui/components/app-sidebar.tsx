import * as React from "react";

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

import { NavLink } from "react-router-dom";
import {
  Gauge,
  Image,
  List,
  Monitor,
  Plus,
  Settings,
  ChartPie,
  Send,
  SquareUser,
  Folder,
} from "lucide-react";

// This is sample data.
const data = {
  versions: [
    "LUCKY",
    "PHAROAH",
    "4x4",
    "NEKO",
    "FRORIDA",
    "TAIPEI",
    "KOH889",
    "BOSTON",
    "ANDAMAN",
    "NAGOYA",
    "GENEVA",
    "GALICIA",
    "SYDNEY",
    "OSLO",
    "MADDIX",
    "4M",
    "BARCA",
    "YORU",
    "LUCKY GO",
    "GPS",
    "999M",
    "PABLO",
    "LUCIANA",
    "ANGEL",
    "MIRACLE",
  ],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "DASHBOARD",
          url: "/dashboard",
          icon: Gauge,
        },
        {
          title: "LDPLAYER",
          url: "/ldplayer",
          icon: Monitor,
        },
        {
          title: "CREATE LDPLAYER",
          url: "/create-ldplayer",
          icon: Plus,
        },
      ],
    },
    {
      title: "Setting",
      url: "#",
      items: [
        {
          title: "ตั้งค่าทั่วไป",
          url: "/setting",
          icon: Settings,
        },
        {
          title: "ตั้งค่าไลน์ไก่",
          url: "/account",
          icon: SquareUser,
        },
        {
          title: "ตั้งค่าไฟล์ดาต้า",
          url: "/file",
          icon: Folder,
        },
        {
          title: "ตั้งค่าชื่อกลุ่ม",
          url: "/name-manager",
          icon: List,
        },
        {
          title: "ตั้งค่ารูปภาพกลุ่ม",
          url: "/profile",
          icon: Image,
        },
        {
          title: "ตั้งค่าข้อความ",
          url: "/message",
          icon: Send,
        },
        {
          title: "ตั้งค่าสถานะ",
          url: "/status",
          icon: ChartPie,
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
                        className="hover:bg-accent/20 flex items-center gap-2 rounded px-2 py-1"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
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
