import { websocketHandlers } from "./chatSocket/handler"
import type { WebSocketMessage } from "./lib/types";
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";
import {
    currentRooms,
    washTable,
    initDatabase,
    addUser,
} from './db/db'

initDatabase()
// washTable()


const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const headers = {
            "Access-Control-Allow-Origin": "*",
        };
        if (url.pathname === "/ws") {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("Upgrade failed:", { status: 500, headers });
        }
        if (url.pathname === '/rooms') {
            try {
                const rooms = await currentRooms()

                return new Response(JSON.stringify(rooms), {
                    headers,
                    status: 200,
                });
            } catch (error) {
                console.error("Error fetching rooms:", error);
                return new Response(
                    JSON.stringify({ error: "Failed to fetch rooms" }),
                    {
                        status: 500,
                        headers,
                    }
                );
            }

        }
        return new Response("hello from server", { headers });
    },
    websocket: {
        ...websocketHandlers,
        message: async (ws: ServerWebSocket, data: string) => {
            const messageData = JSON.parse(data)
            console.log("message on server:", messageData)

            switch (messageData.type) {
                case ("create"):
                    addUser(messageData.payload.username, messageData.payload.roomId)
                    break;
                case ("chat"):
                    console.log(messageData.payload.message)
                    ws.send(JSON.stringify({
                        type: "chat",
                        data: {
                            username: "server",
                            roomId: messageData.payload.roomId,
                            message: "hi from server"
                        }
                    }))
                    // const response = await llmChatExchange(messageData.payload.message)
                    // try {
                    //     if (response) {
                    //         ws.send(JSON.stringify({
                    //             type: "CHAT",
                    //             response: response
                    //         }))
                    //     }
                    //     else {
                    //         console.log("error no response")
                    //     }
                    // }
                    // catch (error) {
                    //     console.error(`Error in function llmChatExchange: ${error}`)
                    //     return `Error: ${error}`
                    //
                    // }
                    break;
            }
        },
    },
});

console.log(`server listening on ${server.port}`)
