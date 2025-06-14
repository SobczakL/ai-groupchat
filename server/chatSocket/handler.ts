import type { WebSocketHandlers, ServerWebSocket } from "../lib/types";

interface Client {
    userName: string;
    roomId: number;
}

interface Hub {
    rooms: number[];
    register: Client;
    unregister: Client;
}

export function handleWebSocket() {
    const roomId = UR

}

export const websocketHandlers: WebSocketHandlers = {
    open(ws) {
        console.log("WebSocket connection opened at open ws", ws)
        console.log(ws.data)
        const room = toString(ws.data.roomId)
        ws.subscribe(room)
        ws.send("Welcome to the WebSocket server")
    },
    message(ws, message) {
        console.log(`Received message: ${message}`)
        ws.send(`Server received: ${message}`)
    },
    close(ws) {
        console.log("WebSocket connection closed")
    },
    error(ws, error) {
        console.error("WebSocket error:", error)
    },
    drain(ws) {
        console.log("WebSocket ready to send more data")
    }
}
