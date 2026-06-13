// hooks/useAppEvents.ts
import { useEffect } from "react";
import { appChannel } from "@/lib/broadcastChannel";
import type { AppEvent } from "@/types/appEvents";

export function useAppEvents(onEvent: (event: AppEvent) => void) {
    useEffect(() => {
        const handler = (event: MessageEvent<AppEvent>) => {
            onEvent(event.data);
        };

        appChannel.addEventListener("message", handler);

        return () => {
            appChannel.removeEventListener("message", handler);
        };
    }, [onEvent]);
}