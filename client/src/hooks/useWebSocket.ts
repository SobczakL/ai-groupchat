import { useEffect, useState, useCallback, useRef } from "react";
import type { MessageData } from "@/lib/types";

export default function useWebSocket() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [allReceivedMessages, setAllReceivedMessages] = useState<(MessageData | null)[]>([]);

    //NOTE:
    //weRef will prevent double firing setting incoming messages due to
    //strict mode.
    const wsRef = useRef<WebSocket | null>(null)

    const handleReceivedMessages = useCallback((message: MessageData | null) => {
        if (message !== null) {
            setAllReceivedMessages(prev => [...prev, message])
        }
    }, [])

    useEffect(() => {
        if (wsRef.current) return

        console.log("WebSocket hook initializing");
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//localhost:3000/ws`;

        try {
            const newWs = new WebSocket(wsUrl);
            wsRef.current = newWs

            newWs.onopen = () => {
                console.log(`WebSocket connected`);
            };

            newWs.onclose = () => {
                console.log(`WebSocket closed`);
                wsRef.current = null
            };

            newWs.onerror = (error) => {
                console.log(`WebSocket Error:`, error);
            };

            newWs.onmessage = (event: MessageEvent) => {
                try {
                    const message: MessageData = JSON.parse(event.data)

                    if (message.type === "chat" || message.type === "server_chat") {
                        const parsedMessage = JSON.parse(event.data) as MessageData
                        handleReceivedMessages(parsedMessage)
                    }
                }
                catch (error) {
                    console.log("Error receiving message", error)
                }
            };

            setWs(newWs);

            return () => {
                newWs.close();
                wsRef.current = null
            };
        } catch (error) {
            console.error("Error setting up WebSocket:", error);
            return;
        }
    }, []);

    const sendMessage = useCallback((data: MessageData) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection not open');
        }
    }, [ws]);

    return {
        receivedMessages: handleReceivedMessages,
        allReceivedMessages,
        ws,
        sendMessage
    };
}
