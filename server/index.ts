import { websocketHandlers } from "./chatSocket/handler"
import type { WebSocketMessage } from "./lib/types";
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";
import dbInstance, {
    getUserRooms,
    createRoom,
    addUserToRoom,
    washAllTables,
    saveMessage,
} from "./db/db";

const server = Bun.serve<{
    senderId: string | null,
    roomId: string | null,
    username: string | null,
    payload: Record<string, any> | null
}>({
    port: 3000,
    async fetch(req, server) {
        const url = new URL(req.url);
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };
        //FIX:
        //clean up the pathname logic

        if (url.pathname === "/user" && req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers })
        }


        if (url.pathname === "/ws") {
            const senderId = url.searchParams.get('senderId')
            const roomId = url.searchParams.get('roomId')
            const username = url.searchParams.get('username')

            const userParamsForUpgrade = {
                senderId: senderId,
                roomId: roomId,
                username: username
            };
            const success = server.upgrade<typeof userParamsForUpgrade>(req, { data: userParamsForUpgrade })

            return success
                ? undefined
                : new Response("WebSocket upgrade failed", { status: 400 })
        }
        //NOTE:
        //is this needed?
        if (url.pathname === '/user' && req.method === "GET") {
            try {
                const rooms = await getUserRooms()

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

        if (url.pathname === '/user/login' && req.method === "POST") {

            const postheaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
            }
            try {
                const data = await req.json()
                console.log(data)

                if (data.username === undefined || data.password === undefined || data.username === undefined) {
                    return new Response(JSON.stringify({ error: "Missing required information" }), {
                        status: 400,
                        headers: postheaders,
                    })
                }
                await createRoom(data.roomId, data.roomName)
                const userCheck = await addUserToRoom(data.senderId, data.roomId, data.username)
                console.log(userCheck)

                if (userCheck === undefined) {
                    return new Response(JSON.stringify({ error: "Failed to add user to users table" }), {
                        status: 500,
                        headers: postheaders
                    })
                }

                return new Response(JSON.stringify({ data: userCheck, message: "User added" }), {
                    status: 201,
                    headers: postheaders,
                })
            }
            catch (error) {
                console.log(error)
            }
        }
    },
    websocket: {
        open(ws) {
            console.log("WebSocket connection opened at open ws", ws.data)
            const roomId = ws.data.roomId
            console.log(typeof roomId)

            //FIX:
            //broadcast to roomName not ID, need function to fetch
            //corresponding roomName to roomID

            ws.subscribe(roomId)
            const data = {
                type: "chat",
                payload: {
                    messageId: crypto.randomUUID(),
                    roomId: roomId,
                    senderId: "system",
                    username: "server",
                    role: "system",
                    content: "hello",
                    timestamp: Date.now()
                }
            }
            const newData = JSON.stringify(data)
            server.publish(roomId, newData)
        },
        async message(ws: ServerWebSocket<{
            senderId: string,
            roomId: string,
            username: string | null
        }>,
            message: string | Buffer
        ): Promise<void> {
            //NOTE: ensure message is a string before parsing.
            const messageString = typeof message === "string" ? message : message.toString('utf8')

            const incomingMessage = JSON.parse(messageString)
            console.log(typeof incomingMessage.payload.roomId)
            saveMessage(incomingMessage.payload)
            console.log(incomingMessage)
            if (incomingMessage.type === "llm") {
                const response = await llmChatExchange(incomingMessage.payload.roomId, incomingMessage.payload.content)
                try {
                    if (response) {
                        console.log(response)
                        //FIX: need chat history cached data
                        const data = {
                            type: "chat",
                            payload: {
                                messageId: crypto.randomUUID(),
                                roomId: incomingMessage.payload.roomId,
                                senderId: crypto.randomUUID(),
                                username: "LLM",
                                role: "assistant",
                                content: response,
                                timestamp: Date.now()
                            }
                        }
                        const newData = JSON.stringify(data)
                        server.publish(ws.data.roomId, newData)
                    }
                    else {
                        console.log("error no response")
                    }
                }
                catch (error) {
                    console.error(`Error in function llmChatExchange: ${error}`)
                }
            }
            if (incomingMessage.type === "chat") {
                server.publish(ws.data.roomId.toString(), message)
            }
        },
        close(ws) {
            console.log("WebSocket connection closed in server")
        },
        error(ws, error) {
            console.error("WebSocket error:", error)
        },
        drain(ws) {
            console.log("WebSocket ready to send more data")
        }
    },
});

// The below function deletes data from DB on server shut down.
//
async function shutDownProcedure(signal: string): Promise<void> {
    console.log(`\nSignal received: ${signal}. Starting shutdown.`)

    if (server && server.stop) {
        server.stop()
        console.log("Sever closed")
    }
    washAllTables()
    console.log("Process exiting")
    process.exit(0)
}

process.on("SIGTERM", () => shutDownProcedure("SIGTERM"))
process.on("SIGINT", () => shutDownProcedure("SIGINT"))

console.log(`server listening on ${server.port}`)
