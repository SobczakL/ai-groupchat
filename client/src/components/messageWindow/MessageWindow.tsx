import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { User, MessageData } from "@/lib/types";

interface MessageWindowProps {
    userDetails: User | null

}
export default function MessageWindow({ userDetails }: MessageWindowProps) {

    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket(userDetails);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [processedMessages, setProcessedMessages] = useState(0)

    useEffect(() => {
        const newMessages = allReceivedMessages.slice(processedMessages)
        setMessages(prev => [...prev, ...newMessages])
        setProcessedMessages(allReceivedMessages.length)
    }, [allReceivedMessages]);


    const handleUserMessage = () => {
        if (textareaRef.current && textareaRef.current.value.trim()) {
            const newMessage = textareaRef.current.value;
            const userMessage: MessageData = {
                type: "chat",
                payload: {
                    id: Date.now() + Math.random(),
                    room: userDetails.roomId,
                    username: userDetails.username,
                    message: newMessage,
                    timestamp: Date.now()
                }
            }
            sendMessage(userMessage);
            textareaRef.current.value = '';
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    };
    return (
        <div>
            <div>
                {messages &&
                    messages.map((message: MessageData, index: number) => (
                        <p key={index}>{message.payload.message}</p>
                    ))}
            </div>
            <div>
                <Textarea
                    ref={textareaRef}
                    placeholder="Type your message here..."
                    onKeyDown={handleKeyDown}
                />
                <Button onClick={handleUserMessage}>Send</Button>
            </div>
        </div>
    )
}
