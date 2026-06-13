import { appChannel } from "@/lib/broadcastChannel";
import { AppEvent } from "@/types/appEvents";

export const publishEvent = (event: AppEvent) => {
    appChannel.postMessage(event);
};