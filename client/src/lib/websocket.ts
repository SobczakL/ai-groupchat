import { useEffect, useState, useCallback } from "react";

export default function useWebSocket() {
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

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

            newWs.onmessage = (e) => {
                setReceivedMessages((prev) => {
                    const safeArray = Array.isArray(prev) ? prev : [];
                    const updated = [...safeArray, e.data];
                    return updated;
                });
            };

            setWs(newWs);

            return () => {
                newWs.close();
            };
        } catch (error) {
            console.error("Error setting up WebSocket:", error);
            return;
        }
    }, []);

    const sendMessage = useCallback((message: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        } else {
            console.error('WebSocket connection not open');
        }
    }, [ws]);

    return {
        receivedMessages,
        ws,
        sendMessage
    };
}
