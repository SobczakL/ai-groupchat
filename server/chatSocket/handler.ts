interface Client {
    roomId: number,
}

interface Hub {
    rooms: number[],
    broadcast: ArrayBuffer,
    register: Client,
    unregister: Client
}

export const websocketHandlers = {
    open(ws: WebSocket) {
        console.log("WebSocket connection opened")
        ws.send("Welcome to the WebSocket server")
    },
    message(ws: WebSocket, message: string | ArrayBuffer) {
        console.log(`Received message: ${message}`)
        ws.send(`Server received: ${message}`)
    },
    close(ws: WebSocket) {
        console.log("WebSocket connection closed")
    },
    error(ws: WebSocket, error: Error) {
        console.error("WebSocket error:", error)
    }
}
