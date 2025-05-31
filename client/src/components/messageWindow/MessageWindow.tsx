import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { User, MessageData } from "@/lib/types";
import { timeStamp } from "console";

interface MessageWindowProps {
    userDetails: User;
    receivedMessages: (message: string) => void
    allReceivedMessages: string[];
    sendMessage: (message: MessageData) => void;
}

// interface Message {
//     id: number;
//     user: User;
//     message: string;
//     timestamp: number;
// }

export default function MessageWindow({
    userDetails,
    receivedMessages,
    allReceivedMessages,
    sendMessage
}: MessageWindowProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [processedMessages, setProcessedMessages] = useState(0)

    useEffect(() => {
        console.log(allReceivedMessages)
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
            setMessages(prev => {
                return [...prev, userMessage];
            });
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
                    messages.map((message: Message, index: number) => (
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
