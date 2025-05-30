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

interface Message {
    id: number;
    user: User;
    message: string;
    timestamp: number;
}

export default function MessageWindow({
    userDetails,
    receivedMessages,
    allReceivedMessages,
    sendMessage
}: MessageWindowProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [processedMessages, setProcessedMessages] = useState(0)

    useEffect(() => {
        //FIX:
        // console.log(receivedMessages)
        console.log(allReceivedMessages)
        const newMessages = allReceivedMessages
            .slice(processedMessages)
            .map(msg => {
                try {
                    const parsedMessage = JSON.parse(msg);
                    if (parsedMessage.type === "chat") {
                        const userData = parsedMessage.payload
                        console.log(userData)
                        //FIX:
                        //alter to handle llm messaging and user messages
                        return {
                            id: Date.now() + Math.random(),
                            user: userData,
                            message: userData.message,
                        };
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
                return null;

            }).filter(msg => msg !== null) as Message[]
        if (newMessages.length > 0) {
            setMessages(prev => [...prev, ...newMessages])
            setProcessedMessages(allReceivedMessages.length)
        }
    }, [allReceivedMessages]);


    const handleUserMessage = () => {
        console.log("user details in message window", userDetails)
        if (textareaRef.current && textareaRef.current.value.trim()) {
            const newMessage = textareaRef.current.value;
            console.log("newMessage sent", newMessage)

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
            console.log("userMessage", userMessage)
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
                        <p key={index}>{message.message}</p>
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
