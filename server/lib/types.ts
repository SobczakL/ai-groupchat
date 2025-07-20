//WebSocket Types
import type { ServerWebSocket as _ServerWebSocket } from "bun";
export type ServerWebSocket = _ServerWebSocket

export interface WebSocketHandlers {
    open?(ws: ServerWebSocket): void;
    message(ws: ServerWebSocket, message: string | ArrayBuffer | Uint8Array): void;
    close?(ws: ServerWebSocket, code: number, reason: string): void;
    error?(ws: ServerWebSocket, error: Error): void;
    drain?(ws: ServerWebSocket): void;
}

export interface RoomUsers {
    roomId: number;
    usernames: string[];
}

export type User = {
    senderId: number;
    roomId: number;
    username: string;
    message?: string;
}
