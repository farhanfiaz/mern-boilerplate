import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { VolumeX, Bell, Volume2, Link } from "lucide-react";
import { getInitials } from "@/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNotificationAudio } from "@/hooks/useNotificationAudio";

export function NotificationBell() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { playNotificationSound, setEnabled, isEnabled } = useNotificationAudio(
        {
            audioPath: "/audio/notification.mp3",
            volume: 0.5,
            enabled: true,
        }
    );

    useEffect(() => {
        if (!user) return;

        // Fetch initial notifications
        // fetch("/api/notifications")
        //     .then((res) => {
        //         if (!res.ok) {
        //             throw new Error(`HTTP error! status: ${res.status}`);
        //         }
        //         return res.json();
        //     })
        //     .then((data) => {
        //         if (Array.isArray(data)) {
        //             setNotifications(data);
        //             setUnreadCount(data.filter((n: any) => !n.read).length);
        //         } else {
        //             console.error("Received non-array data for notifications:", data);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("Error fetching notifications:", error);
        //     });

        // Setup WebSocket connection
        // const host =
        //     import.meta.env.MODE === "production"
        //         ? window.location.host
        //         : `localhost:${import.meta.env.VITE_PORT}`;
        // const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        // const ws = new WebSocket(`${protocol}://${host}/ws?userId=${user?.user?.userId}`);
        // window.tracker?.trackWebSocket(ws);

        // ws.onmessage = (event) => {
        //     try {
        //         const notification = JSON.parse(event.data);
        //         if (notification.type === "notification") {
        //             setNotifications((prev) => [notification, ...prev]);
        //             setUnreadCount((prev) => prev + 1);
        //             // Play notification sound when new notification arrives
        //             playNotificationSound();
        //         }
        //         if (notification.type === "security") {
        //             // toast({
        //             //   title: "Security Notification",
        //             //   description: notification.message,
        //             //   variant: "destructive",
        //             // });
        //             // playNotificationSound();
        //         }
        //         if (notification.type === "user-menu-updated") {
        //             toast({
        //                 title: "Menu Updated",
        //                 description: notification.message,
        //                 variant: "success",
        //                 className: "bg-green-500 text-white",
        //             });
        //             playNotificationSound();
        //             //queryClient.refetchQueries({ queryKey: ['/api/auth/get-user-menus'] });
        //             window.dispatchEvent(new CustomEvent("assets-notification", { detail: notification }));
        //         }

        //     } catch (error) {
        //         console.error("Error parsing WebSocket message:", error);
        //     }
        // };

        // ws.onerror = (error) => {
        //     console.error("WebSocket error:", error);
        // };

        // return () => {
        //     ws.close();
        // };
    }, [user]);

    const handleOpenChange = (open: boolean) => {
        if (open && unreadCount > 0) {
            const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
            // fetch("/api/notifications/mark-as-read", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ notificationIds: unreadIds }),
            // })
            //     .then((res) => {
            //         if (!res.ok) {
            //             throw new Error(`HTTP error! status: ${res.status}`);
            //         }
            //         return res.json();
            //     })
            //     .then(() => {
            //         setUnreadCount(0);
            //         setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            //     })
            //     .catch((error) => {
            //         console.error("Error marking notifications as read:", error);
            //     });
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 relative h-96 overflow-y-auto">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium leading-none">Notifications</h4>
                            <div className="flex items-center space-x-2">
                                {isEnabled ? (
                                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                                )}
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={setEnabled}
                                    className="scale-75"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You have {unreadCount} unread messages.
                        </p>
                    </div>
                    <div className="grid gap-2 ">
                        {notifications.map((notification) => {
                            const senderUserId = notification.senderId ?? notification.sender_id;
                            const firstName = notification.senderFirstName ?? notification.sender_first_name ?? "";
                            const lastName = notification.senderLastName ?? notification.sender_last_name ?? "";
                            const initials =
                                firstName || lastName
                                    ? getInitials(firstName, lastName)
                                    : null;
                            //: getInitialsFromMessage(notification.message);
                            return (
                                <div
                                    key={notification.id}
                                    className="flex items-center gap-2 mt-[-10px] "
                                >
                                    <Avatar className="h-10 w-10 shrink-0 rounded-full ring-2 ring-violet-300/50 ring-offset-2 ring-offset-background overflow-hidden">
                                        <AvatarImage
                                            loading="lazy"
                                            src={
                                                senderUserId
                                                    ? `/api/users/${senderUserId}/photo`
                                                    : undefined
                                            }
                                            alt=""
                                            className="h-full w-full"
                                        />
                                        <AvatarFallback className="shadow-lg text-primary text-xs">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Link href={notification.url} className="flex-1">
                                        <div className="grid gap-1">
                                            <p className="text-[13px] leading-[1.2] mt-[18px] font-medium">
                                                {notification.message}
                                            </p>
                                            <p className="text-[12px] leading-[1.2] text-muted-foreground">
                                                {/* {moment(notification.createdAt)
                                                    .tz(config.TIME_ZONE)
                                                    .fromNow()} */}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}