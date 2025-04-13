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

// type Room = {
//     id: number;
//     users: string[]
// }
// export type Rooms = Room[]
//
export type User = {
    userId: number;
    roomId: number;
    username: string;
    message?: string;
}
//
// export type WebSocketMessage = {
//     type: string;
//     payload: User | any;
// }
