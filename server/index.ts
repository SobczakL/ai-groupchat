import { websocketHandlers } from "./chatSocket/handler"
import type { WebSocketMessage } from "./lib/types";
import { llmChatExchange } from "./llm/llm"
import type { ServerWebSocket } from "bun";
import dbInstance from "./db/db";
import {
    washTable,
    initDatabase,
} from './db/db'
import { currentRoomUsers, addNewUser } from "./routes/user"

// washTable()

const server = Bun.serve<{
    userId: number | null,
    roomId: number | null,
    username: string | null
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
            const parsedUserId = parseInt(url.searchParams.get('userId') || '', 10);
            const parsedRoomId = parseInt(url.searchParams.get('roomId') || '', 10);
            console.log(parsedUserId, parsedRoomId)
            const userParamsForUpgrade = {
                userId: isNaN(parsedUserId) ? null : parsedUserId,
                roomId: isNaN(parsedRoomId) ? null : parsedRoomId,
                username: url.searchParams.get('username')
            };
            const success = server.upgrade<typeof userParamsForUpgrade>(req, { data: userParamsForUpgrade })
            return success
                ? undefined
                : new Response("WebSocket upgrade failed", { status: 400 })
        }
        if (url.pathname === '/user' && req.method === "GET") {
            try {
                const rooms = await currentRoomUsers()

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

        if (url.pathname === '/user' && req.method === "POST") {

            const postheaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type",
            }
            try {
                const data = await req.json()

                if (data.userId === undefined || data.roomId === undefined || data.username === undefined) {
                    return new Response(JSON.stringify({ error: "Missing required information" }), {
                        status: 400,
                        headers: postheaders,
                    })
                }
                await addNewUser(data.userId, data.roomId, data.username)

                return new Response(JSON.stringify({ message: "User added" }), {
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
            console.log("WebSocket connection opened at open ws", ws)
            const room = ws.data.roomId.toString()
            ws.subscribe(room)
            server.publish(room, 'hello')
        },
        async message(ws: ServerWebSocket<{
            userId: number | null,
            roomId: number | null,
            username: string | null
        }>,
            message: string | Buffer
        ): Promise<void> {
            //NOTE: ensure message is a string before parsing.
            const messageString = typeof message === "string" ? message : message.toString('utf8')

            //FIX: rework this.
            //
            const incomingMessage = JSON.parse(messageString)
            console.log(incomingMessage)
            if (incomingMessage.type === "llm") {
                const response = await llmChatExchange(incomingMessage.payload.message)
                try {
                    if (response) {
                        console.log(response)
                        //FIX: must send back as payload data
                        server.publish(ws.data.roomId.toString(), response)
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
        // message: async (ws: ServerWebSocket, data: string) => {
        //     const messageData = JSON.parse(data)
        //     ws.send(JSON.stringify({
        //         type: "chat",
        //         payload: {
        //             username: "LLM",
        //             roomId: messageData.payload.roomId,
        //             message: "hi from server",
        //             timestamp: Date.now()
        //         }
        //     }
        // ))
        //FIX:
    },
});

console.log(`server listening on ${server.port}`)
