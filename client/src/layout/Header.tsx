import { Button } from "@/components/ui/Button";
import { useDesktopSidebarOptional } from "./desktop-sidebar-context";
import { Menu } from "lucide-react";

export interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({
    onMenuClick,
}: HeaderProps) {
    const desktopSidebar = useDesktopSidebarOptional();

    return (
        <header className="sticky top-0 z-40 w-full shrink-0 bg-white border-b border-gray-200 px-3 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {onMenuClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuClick}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    {desktopSidebar && (
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => desktopSidebar.toggleDesktopSidebar()}
                            className="hidden lg:inline-flex shrink-0"
                            aria-label={
                                desktopSidebar.isDesktopCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    {/* <Companies /> */}
                </div>

                <div className="flex items-center gap-2">
                    {/* <NotificationBell />
                    <UserProfileMenu /> */}
                </div>
            </div>
        </header>
    );
}
