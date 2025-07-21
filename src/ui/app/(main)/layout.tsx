import { AppSidebar } from "@/ui/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/ui/components/ui/sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
