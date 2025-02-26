import { websocketHandlers } from "./chatSocket/handler"
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";


async function start() {
    const message = "say this is a test"
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
start()
const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url)
        const headers = {
            "Access-Control-Allow-Origin": "*",
        }
        if (url.pathname === "/ws") {
            if (server.upgrade(req)) {
                return
            }
            return new Response("Upgrade failed:", { status: 500 })
        }
        else if (url.pathname === '/') {
            const result = await start()
            return new Response(result, { headers })
        }
        return new Response("hello from server")
    },
    websocket: websocketHandlers,
})

console.log(`server listening on ${server.port}`)
