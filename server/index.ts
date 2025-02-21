import { websocketHandlers } from "./chatSocket/handler"
import { llmChatExchange } from "./llm/llm"


async function start() {
    const message = "say this is a test"
    const response = await llmChatExchange(message)
    if (response) {
        console.log(response)
    }
    else {
        console.log("error no response")
    }
}
start()
const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url)
        if (url.pathname === "/ws") {
            if (server.upgrade(req)) {
                return
            }
            return new Response("Upgrade failed:", { status: 500 })
        }
        return new Response("hello from server")
    },
    websocket: websocketHandlers,
})

console.log(`server listening on ${server.port}`)
