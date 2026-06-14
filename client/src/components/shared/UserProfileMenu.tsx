import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { LogOut, User, Lock, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logger from '@/utils/logger';
import { getInitials } from '@/utils/utils';
import { ChangePasswordForm } from './ChangePasswordForm';

export function UserProfileMenu() {
    const { user, logout } = useAuth();
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-0 p-0">
                        <div className="hidden sm:block text-right">
                            {/* <p className="text-sm font-medium text-gray-900">
                {getDisplayName()}
              </p> */}
                            {/* <p className="text-xs text-gray-500 capitalize">{getRoleTypeLabel(selectedRole || "")}</p> */}
                            {/* <p className="text-xs text-gray-500 capitalize">{user.role[0]?.roleName || ""}</p> */}
                        </div>
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 sm:ring-3 ring-violet-300/50 ring-offset-2 ring-offset-white shadow-lg relative z-10 group-hover:violet-pink-400/70 transition-all duration-300">
                            <AvatarImage
                                loading="lazy"
                                src={
                                    user?.user?.userId
                                        ? `/api/users/${user.user.userId}/photo`
                                        : undefined
                                }
                                alt={`${user?.user?.firstName} ${user?.user?.lastName}`.trim() || "Profile"}
                            />
                            <AvatarFallback className="bg-violet-700 text-white text-sm">
                                {getInitials(user?.user?.firstName || '', user?.user?.lastName || '')}
                            </AvatarFallback>
                        </Avatar>
                        {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {`${user?.user?.firstName} ${user?.user?.lastName}`}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.user?.email}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                <span className="text-xs leading-none text-muted-foreground">
                                    {user?.user?.userId}
                                </span>
                                {user?.user?.role.at(0)?.name ? (
                                    <span className="text-xs leading-none text-muted-foreground">
                                        {" "}
                                        - {user?.user?.role.at(0)?.name}
                                    </span>
                                ) : null}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                        onClick={() => setIsPasswordOpen(true)}
                        className="cursor-pointer"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <DialogContent className="p-3 sm:max-w-[425px] password-dialog" style={{ zIndex: 100 }}>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Update your password to keep your account secure.
                        </DialogDescription>
                    </DialogHeader>
                    <ChangePasswordForm onClose={() => setIsPasswordOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}