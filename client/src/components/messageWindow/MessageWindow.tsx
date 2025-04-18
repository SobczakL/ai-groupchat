import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { User, MessageData } from "@/lib/types";

interface MessageWindowProps {
    userDetails: User;
    receivedMessages: (message: string) => void
    allReceivedMessages: string[];
    sendMessage: (message: MessageData) => void;
}

interface Message {
    id: number;
    user: User;
    message: string;
}

export default function MessageWindow({
    userDetails,
    receivedMessages,
    allReceivedMessages,
    sendMessage
}: MessageWindowProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setMessages(allReceivedMessages.map(msg => {
            try {
                const parsedMessage = JSON.parse(msg);
                console.log(parsedMessage)
                if (parsedMessage.type === "chat") {
                    const userData = parsedMessage.payload;
                    console.log(userData)
                    //FIX:
                    //alter to handle llm messaging and user messages
                    return {
                        id: Date.now(),
                        user: userData,
                        message: userData.message,
                    };
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
            return null;

        }).filter(msg => msg !== null) as Message[]);
    }, [allReceivedMessages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    };

    const handleUserMessage = () => {
        if (textareaRef.current && textareaRef.current.value.trim()) {
            const newMessage = textareaRef.current.value;
            const messageObject: Message = {
                id: Date.now(),
                user: userDetails,
                message: newMessage
            }

            setMessages(prev => [...prev, messageObject]);
            const data: WebSocketMessage = {
                "type": "chat",
                "payload": { ...userDetails, message: newMessage }
            }
            sendMessage(data);
            textareaRef.current.value = '';
        }
    }

    return (
        <div>
            <div>
                {messages &&
                    messages.map((message: Message) => (
                        <p key={message.id}>{message.message}</p>
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
