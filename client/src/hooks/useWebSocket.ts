import { useEffect, useState, useCallback, useRef } from "react";
import type { MessageData } from "@/lib/types";

export default function useWebSocket({ userDetails }) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [allReceivedMessages, setAllReceivedMessages] = useState<(MessageData | null)[]>([]);

    //NOTE:
    //weRef will prevent double firing setting incoming messages due to
    //strict mode.
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        //FIX:
        //race condition with userdetails
        //
        if (!userDetails || !userDetails.userId || !userDetails.roomId || !userDetails.username) {
            console.log("userDetails is not ready:", userDetails)
            return
        }
        if (wsRef.current) return
        console.log("userdetails inside socket", userDetails)

        console.log("WebSocket hook initializing");
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const params = new URLSearchParams({
            userId: userDetails.userId,
            roomId: userDetails.roomId,
            username: userDetails.username
        })
        const wsUrl = `${wsProtocol}//localhost:3000/ws?${params}`;

        try {
            const newWs = new WebSocket(wsUrl)
            wsRef.current = newWs

            newWs.onopen = () => {
                console.log(`WebSocket connected`);
                setWs(newWs)
            };

            newWs.onclose = () => {
                console.log(`WebSocket closed`);
                wsRef.current = null
                setWs(null)
            };

            newWs.onerror = (error) => {
                console.log(`WebSocket Error:`, error);
            };

            newWs.onmessage = (event: MessageEvent) => {
                try {
                    const message: MessageData = JSON.parse(event.data)
                    if (message.type === "chat" || message.type === "server_chat") {
                        setAllReceivedMessages(prev => [...prev, message])
                    }
                }
                catch (error) {
                    console.log("Error receiving message", error)
                }
            };

            return () => {
                console.log("WebSocket cleanup: closing connection")
                if (newWs.readyState === WebSocket.OPEN) {
                    newWs.close();
                }
                wsRef.current = null
                setWs(null)
            };
        } catch (error) {
            console.error("Error setting up WebSocket:", error);
            wsRef.current = null
            setWs(null)
        }
    }, [userDetails]);

    const sendMessage = useCallback((data: MessageData) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection not open');
        }
    }, []);

    return {
        // receivedMessages: handleReceivedMessages,
        allReceivedMessages,
        ws,
        sendMessage
    };
}
