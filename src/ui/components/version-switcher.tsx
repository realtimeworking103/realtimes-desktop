import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/components/ui/sidebar";
import { VersionData } from "@/ui/types/types";

export function VersionSwitcher() {
  const [versionData, setVersionData] = React.useState<VersionData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadVersionData = async () => {
      try {
        const data = await window.electron.getVersionData();
        setVersionData(data);
      } catch (error) {
        console.error('Error loading version data:', error);
        // Fallback to default data
        setVersionData({
          currentVersion: 'LUCKY',
          availableVersions: [
            'LUCKY',
            'PHAROAH',
            '4x4',
            'NEKO',
            'FRORIDA',
            'TAIPEI',
            'KOH889',
            'BOSTON',
            'ANDAMAN',
            'NAGOYA',
            'GENEVA',
            'GALICIA',
            'SYDNEY',
            'OSLO',
            'MADDIX',
            '4M',
            'BARCA',
            'YORU',
            'LUCKY GO',
            'GPS',
            '999M',
            'PABLO',
            'LUCIANA',
            'ANGEL',
            'MIRACLE'
          ],
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    loadVersionData();
  }, []);

  const handleVersionChange = async (version: string) => {
    try {
      const success = await window.electron.updateCurrentVersion(version);
      if (success && versionData) {
        setVersionData({
          ...versionData,
          currentVersion: version,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating version:', error);
    }
  };

  if (loading || !versionData) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Realtimes Desktop</span>
              <span className="font-medium text-blue-500">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Realtimes Desktop</span>
                <span className="font-medium text-blue-500">
                  {versionData.currentVersion}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versionData.availableVersions.map((version: string) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => handleVersionChange(version)}
              >
                {version}
                {version === versionData.currentVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
