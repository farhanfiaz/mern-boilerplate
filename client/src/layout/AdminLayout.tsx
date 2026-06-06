import { cn } from "@/utils/utils";
import { DesktopSidebarProvider, useDesktopSidebarOptional } from "./desktop-sidebar-context";
import { Sidebar } from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopSidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </DesktopSidebarProvider>
  );
  function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
    const desktopSidebar = useDesktopSidebarOptional();
    const collapsed = desktopSidebar?.isDesktopCollapsed ?? false;

    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div
          className={cn(
            "flex-1 w-[80%] transition-[margin] duration-200 ease-out",
            collapsed ? "lg:ml-20" : "lg:ml-64"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}