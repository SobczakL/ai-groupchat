import { useEffect, useState, useCallback, useRef } from "react";
import type { MessageData } from "@/lib/types";
import { convertDateString } from "@/lib/utils";

interface UserDetailsProps {
    roomId: string;
    senderId: string;
    username: string;
}

export default function useWebSocket(userDetails: UserDetailsProps | null) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [allReceivedMessages, setAllReceivedMessages] = useState<(MessageData | null)[]>([]);

    //NOTE:
    //weRef will prevent double firing setting incoming messages due to
    //strict mode.
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        //FIX:
        //race condition with userdetails
        console.group("WebSocket useEffect Cycle");
        console.log("Current userDetails in useWebSocket:", userDetails);
        if (!userDetails || !userDetails.senderId || !userDetails.roomId || !userDetails.username) {
            console.log("userDetails is not ready:", userDetails)
            return
        }
        if (wsRef.current) return
        console.log("userdetails inside socket", userDetails)
        console.log("WebSocket hook initializing");
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const params = new URLSearchParams({
            roomId: userDetails.roomId,
            senderId: userDetails.senderId,
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
                wsRef.current = null
                setWs(null)
            };

            newWs.onerror = (error) => {
                console.log(`WebSocket Error:`, error);
            };

            newWs.onmessage = (event: MessageEvent) => {
                try {
                    const message: MessageData = JSON.parse(event.data)
                    console.log("message in socket", message)
                    if (message.type === "chat" || message.type === "llm") {

                        const formattedTime = convertDateString(message.payload.timestamp)
                        const formattedMessage = {
                            ...message,
                            payload: {
                                ...message.payload,
                                displayTime: formattedTime
                            }
                        }
                        console.log(formattedMessage)
                        setAllReceivedMessages(prev => [...prev, formattedMessage])
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
    }, [ws]);

    return {
        // receivedMessages: handleReceivedMessages,
        allReceivedMessages,
        ws,
        sendMessage
    };
}
