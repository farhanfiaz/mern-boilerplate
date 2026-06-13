declare global {
    interface Window {
        tracker: {
            track: (event: string, data?: any) => void;
            trackWebSocket: (socket: WebSocket) => void;
        };
    }
}

export { };

export interface LogEntry {
    type: string;
    timestamp: string;
    payload: any;
}
export interface EventTargetWithUrl extends EventTarget {
    url: string;
}