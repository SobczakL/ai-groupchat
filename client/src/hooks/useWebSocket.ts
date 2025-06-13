import { useEffect, useState, useCallback, useRef } from "react";
import type { MessageData } from "@/lib/types";

interface UserDetailsProps {
    userId: number;
    roomId: number;
    username: string;
}

export default function useWebSocket(userDetails: UserDetailsProps | null) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [allReceivedMessages, setAllReceivedMessages] = useState<(MessageData | null)[]>([]);

    //NOTE:
    //weRef will prevent double firing setting incoming messages due to
    //strict mode.
    const wsRef = useRef<WebSocket | null>(null)

    // const handleReceivedMessages = useCallback((message: MessageData | null) => {
    //     if (message !== null) {
    //         setAllReceivedMessages(prev => [...prev, message])
    //     }
    // }, [])

    useEffect(() => {
        //FIX:
        //race condition with userdetails
        console.group("WebSocket useEffect Cycle");
        console.log("Current userDetails in useWebSocket:", userDetails);
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
                newWs.close();
                wsRef.current = null
                setWs(null)
            };
        } catch (error) {
            console.error("Error setting up WebSocket:", error);
            wsRef.current = null
            setWs(null)
            return;
        }
    }, [userDetails]);

    const sendMessage = useCallback((data: MessageData) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection not open');
        }
    }, [userDetails]);

    return {
        // receivedMessages: handleReceivedMessages,
        allReceivedMessages,
        ws,
        sendMessage
    };
}
