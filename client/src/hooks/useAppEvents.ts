import { useEffect, useRef } from "react";
import { appChannel } from "@/lib/broadcastChannel";
import type { AppEvent } from "@/types/appEvents";

export function useAppEvents(onEvent: (event: AppEvent) => void) {
    const onEventRef = useRef(onEvent);

    useEffect(() => {
        onEventRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        const handler = (event: MessageEvent<AppEvent>) => {
            onEventRef.current(event.data);
        };

        appChannel.addEventListener("message", handler);

        return () => {
            appChannel.removeEventListener("message", handler);
        };
    }, []);
}