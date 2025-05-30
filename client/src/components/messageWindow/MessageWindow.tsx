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

    useEffect(() => {
        //FIX:
        // console.log(receivedMessages)
        // console.log(allReceivedMessages)
        setMessages(allReceivedMessages.map(msg => {
            try {
                const parsedMessage = JSON.parse(msg);
                if (parsedMessage.type === "chat") {
                    const userData = parsedMessage.data;
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


    const handleUserMessage = () => {
        console.log("user details in message window", userDetails)
        if (textareaRef.current && textareaRef.current.value.trim()) {
            const newMessage = textareaRef.current.value;
            console.log("newMessage sent", newMessage)

            const messageData: MessageData = {
                type: "chat",
                data: {
                    username: userDetails.username,
                    room: userDetails.roomId,
                    message: newMessage
                }
            }
            sendMessage(messageData);
            setMessages(prev => [...prev, messageData]);
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
