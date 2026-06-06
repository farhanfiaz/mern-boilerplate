import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/utils";
import { LogOut, Menu, X } from "lucide-react";
import { ComponentType, useEffect, useState } from "react";
import { Link, Redirect } from "wouter";
import { useDesktopSidebarOptional } from "./desktop-sidebar-context";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

export function Sidebar() {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const desktopSidebar = useDesktopSidebarOptional();

    if (!user) {
        return <Redirect to="/login" />;
    }

    // Close mobile menu when location changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isDesktopCollapsed = desktopSidebar?.isDesktopCollapsed ?? false;
    const menusData = [
        {
            id: 1,
            name: "Dashboard",
            parentId: null,
            groupLabel: "Main",
            icon: "LayoutDashboard",
            url: "/dashboard",
            order: 1,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 2,
            name: "Users",
            parentId: null,
            groupLabel: "Management",
            icon: "Users",
            url: "/users",
            order: 2,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 3,
            name: "User List",
            parentId: 2,
            groupLabel: "Management",
            icon: "List",
            url: "/users/list",
            order: 1,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 4,
            name: "Create User",
            parentId: 2,
            groupLabel: "Management",
            icon: "UserPlus",
            url: "/users/create",
            order: 2,
            createdAt: new Date(),
            isActive: true,
            isAction: true,
        },
        {
            id: 5,
            name: "Roles",
            parentId: null,
            groupLabel: "Management",
            icon: "Shield",
            url: "/roles",
            order: 3,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 6,
            name: "Settings",
            parentId: null,
            groupLabel: "System",
            icon: "Settings",
            url: "/settings",
            order: 4,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 7,
            name: "Profile",
            parentId: 6,
            groupLabel: "System",
            icon: "User",
            url: "/settings/profile",
            order: 1,
            createdAt: new Date(),
            isActive: true,
            isAction: false,
        },
        {
            id: 8,
            name: "Permissions",
            parentId: 5,
            groupLabel: "Management",
            icon: "Key",
            url: "/roles/permissions",
            order: 1,
            createdAt: new Date(),
            isActive: true,
            isAction: true,
        },
    ];

    const menus: any[] = Array.isArray(menusData)
        ? menusData
        : (menusData as any)?.data || [];
    const menuGroupLabels = Array.from(
        new Set(
            menus
                ?.filter((item: any) => item.isAction === false)
                ?.sort((a: any, b: any) => a.order - b.order)
                .map((item: any) => item.groupLabel)
        )
    );

    const getBadgeValue = (item: any) => {
        const path = item.url ?? item.href ?? "";

        switch (path) {
            //   case "/approvals":
            //     return pendingApplicationStats?.pendingApprovals > 0
            //       ? pendingApplicationStats?.pendingApprovals.toString()
            //       : undefined;
            //   case "/work-from-home":
            //     return pendingApplicationStats?.workFromHome > 0
            //       ? pendingApplicationStats.workFromHome.toString()
            //       : undefined;
            //   case "/policy-acknowledgments":
            //     return pendingPolicyCount > 0
            //       ? pendingPolicyCount.toString()
            //       : undefined;
            //   case "/evaluations":
            //     return pendingEvaluationCount > 0
            //       ? pendingEvaluationCount.toString()
            //       : undefined;
            //   case "/training":
            //     return pendingTrainingCount > 0
            //       ? pendingTrainingCount.toString()
            //       : undefined;
            default:
                return item.badge;
        }
    };

    const renderSidebarContent = (compact: boolean) => (
        <>
            {/* Logo */}
            <div
                className={cn(
                    "flex items-center justify-center max-w-full shrink-0",
                    compact && "px-1 py-3"
                )}
            >
                {/* <CompanyLogo
          className={cn(
            !compact && "!w-full max-w-full",
            compact && "w-8 h-10 !max-h-10 object-contain"
          )}
          size={compact ? "sm" : "md"}
        /> */}
            </div>

            {/* User Info */}
            <div className="border-b border-sidebar-border">
                {/* <div className="flex items-center gap-[6px]">
          <Avatar className="h-10 w-10 rounded-full ring-2 sm:ring-3 ring-violet-300/50 ring-offset-2 ring-offset-white shadow-lg relative z-10 group-hover:ring-violet-400/70 transition-all duration-300">
            <AvatarImage
              loading="lazy"
              src={
                user?.id
                  ? `/api/users/${user.id}/photo${photoTimestamp > 0 ? `?t=${photoTimestamp}` : ''}`
                  : user?.employee?.id
                    ? `/api/employees/${user.employee.id}/photo${photoTimestamp > 0 ? `?t=${photoTimestamp}` : ''}`
                    : undefined
              }
              alt={
                `${user?.employee?.firstName || ""} ${user?.employee?.middleName || ""} ${user?.employee?.lastName || ""
                  }`.trim() || "Profile"
              }
            />
            <AvatarFallback className="text-primary">
              {getInitials(user?.employee?.firstName, user?.employee?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-[5px]">
            <div className="text-sm font-medium text-sidebar-foreground">
              {user?.employee?.firstName && user?.employee?.lastName
                ? `${user.employee.firstName}${user.employee.middleName ? ` ${user.employee.middleName}` : ""} ${user.employee.lastName}`
                : user?.email || "User"}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {getRoleTypeLabel(selectedRole || "")}
            </div>
          </div>
        </div> */}
            </div>

            {/* Navigation */}
            <nav
                className={cn(
                    "py-3 flex-1 overflow-y-auto min-h-0",
                    compact ? "px-1" : "px-3"
                )}
            >
                <div className={cn("space-y-2")}>
                    {menuGroupLabels?.map((group) => (
                        <div key={group}>
                            {!compact && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-semibold text-black uppercase tracking-wider">
                                        {group}
                                    </h3>
                                </div>
                            )}

                            <div className={cn(!compact && "!mt-2")}>
                                {menus
                                    ?.filter(
                                        (item: any) =>
                                            item.groupLabel === group && item.isAction === false
                                    )
                                    .map((item: any) => {
                                        if (!item.url) return null;

                                        const path = item.url || item.href || "";
                                        const isActive = location === path;

                                        const Icon = (Icons[item.icon as keyof typeof Icons] || Icons.Circle
                                        ) as ComponentType<Icons.LucideProps>;

                                        const badgeText = getBadgeValue(item);

                                        const row = (
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "nav-item w-full transition-colors relative mb-0.5",
                                                    compact
                                                        ? "h-auto min-h-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 whitespace-normal"
                                                        : "justify-start px-1",
                                                    isActive
                                                        ? "active font-semibold rounded-lg"
                                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4 shrink-0",
                                                        isActive && "text-blue-600"
                                                    )}
                                                />

                                                {compact && (
                                                    <span
                                                        className={cn(
                                                            "w-full min-w-0 max-w-full whitespace-normal text-center text-[10px] leading-snug [overflow-wrap:anywhere] break-words",
                                                            isActive ? "text-blue-600" : "text-sidebar-foreground"
                                                        )}
                                                    >
                                                        {item.name}
                                                    </span>
                                                )}

                                                {!compact && (
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <span className="flex-1 text-left">{item.name}</span>

                                                        {badgeText && (
                                                            <Badge className="h-5 min-w-5 shrink-0 rounded-full border-0 px-1.5 text-xs font-medium animate-bounce bg-green-500 text-white">
                                                                {badgeText}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                {compact && badgeText && (
                                                    <span
                                                        className="absolute right-0.5 top-0.5 h-2 min-w-2 rounded-full bg-green-600"
                                                        aria-hidden
                                                    />
                                                )}
                                            </Button>
                                        );

                                        return (
                                            <Link
                                                key={item.url}
                                                href={item.url}
                                                className="block w-full"
                                                title={item.name}
                                            >
                                                {row}
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-sidebar-border">
                    {compact ? (
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={logout}
                            title="Logout"
                            className="h-auto w-full min-h-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 whitespace-normal text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span className="w-full min-w-0 max-w-full whitespace-normal text-center text-[10px] leading-snug [overflow-wrap:anywhere] break-words">
                                Logout
                            </span>
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                        </Button>
                    )}
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden lg:flex fixed inset-y-0 left-0 z-50 bg-sidebar-background shadow-lg border-r border-sidebar-border flex-col transition-all duration-200 ease-out overflow-hidden",
                    isDesktopCollapsed ? "w-20" : "w-64"
                )}
            >
                {renderSidebarContent(isDesktopCollapsed)}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Mobile Sidebar */}
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background shadow-lg border-r border-sidebar-border flex flex-col bg-white">
                        {renderSidebarContent(false)}
                    </div>
                </div>
            )}
        </>
    );
}