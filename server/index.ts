import { websocketHandlers } from "./chatSocket/handler"
import type { WebSocketMessage } from "./lib/types";
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";
import {
    tableHelper,
    washTable,
    initDatabase,
    addUser,
    checkRooms
} from './db/db'

initDatabase()
washTable()

async function start(message: string) {
    const response = await llmChatExchange(message)
    try {
        if (response) {
            console.log(response)
            return response
        }
        else {
            console.log("error no response")
        }
    }
    catch (error) {
        console.error(`Error in function start: ${error}`)
        return `Error: ${error}`

    }
}

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
        return new Response("hello from server", { headers });
    },
    websocket: {
        ...websocketHandlers,
        message: async (ws: ServerWebSocket, data: string) => {
            const messageData = JSON.parse(data)

            switch (messageData.type) {
                case ("CHECK"):
                    // washTable()
                    tableHelper()
                    const response = addUser(messageData.payload.username, messageData.payload.roomId)
                    ws.send(JSON.stringify({
                        type: "SERVER",
                        response: response
                    }))

            }
            // const llmResponse = await start(something)
            // ws.send(llmResponse)
        },
    },
});

console.log(`server listening on ${server.port}`)
