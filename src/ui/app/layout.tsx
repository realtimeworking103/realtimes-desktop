import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <div>
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
