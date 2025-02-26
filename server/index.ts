import { websocketHandlers } from "./chatSocket/handler"
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";


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
        ...websocketHandlers, // Spread existing handlers
        message: async (ws: ServerWebSocket, message: string | ArrayBuffer | Uint8Array) => {
            console.log(`Received message: ${message}`);
            const messageText = String(message); // Convert to string
            const llmResponse = await start(messageText); // Call start with the message
            ws.send(llmResponse); // Send the LLM response back to the client
        },
    },
});

console.log(`server listening on ${server.port}`)
