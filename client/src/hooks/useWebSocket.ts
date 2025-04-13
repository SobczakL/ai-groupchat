import { useEffect, useState, useCallback } from "react";
import type { WebSocketMessage } from "@/lib/types";

export default function useWebSocket() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [allReceivedMessages, setAllReceivedMessages] = useState<string[]>([]);

    const handleReceivedMessages = useCallback((message: string) => {
        setAllReceivedMessages(prev => [...prev, message])
    }, [])

    useEffect(() => {
        console.log("WebSocket hook initializing");
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//localhost:3000/ws`;

        try {
            const newWs = new WebSocket(wsUrl);

            newWs.onopen = () => {
                console.log(`WebSocket connected`);
            };

            newWs.onclose = () => {
                console.log(`WebSocket closed`);
            };

            newWs.onerror = (error) => {
                console.log(`WebSocket Error:`, error);
            };

            newWs.onmessage = (event: MessageEvent) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data)

                    if (message.type === "CHAT") {
                        handleReceivedMessages(event.data)
                    }
                }
                catch (error) {
                    console.log("Error receiving message", error)
                }
            };

            setWs(newWs);

            return () => {
                newWs.close();
            };
        } catch (error) {
            console.error("Error setting up WebSocket:", error);
            return;
        }
    }, [handleReceivedMessages]);

    const sendMessage = useCallback((data: WebSocketMessage) => {
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
