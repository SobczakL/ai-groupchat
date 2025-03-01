import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { User, WebSocketMessage } from "@/lib/types";

interface MessageWindowProps {
    userDetails: User;
    receievedMessages: (message: string) => void;
    sendMessage: (message: WebSocketMessage) => void;
}

interface Message {
    id: number;
    user: User;
    message: string;
}

export default function MessageWindow({
    userDetails,
    receievedMessages,
    sendMessage
}: MessageWindowProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [messages, setMessages] = useState<Message[]>([])

    const lastProcessedIndex = useRef(-1)


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    };

    useEffect(() => {
        for (let i = lastProcessedIndex.current + 1; i < receievedMessages.length; i++) {
            try {
                const parsedMessage = JSON.parse(receievedMessages[i])
                if (parsedMessage.type === "BROADCAST") {
                    const userData = parsedMessage.payload
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        user: userData.username,
                        message: userData.message
                    }])
                }
            }
            catch (error) {
                console.error("Error parsing message:", error)
            }
            lastProcessedIndex.current = i
        }
    }, [receievedMessages]);

    const handleUserMessage = () => {
        if (textareaRef.current && textareaRef.current.value.trim()) {
            const newMessage = textareaRef.current.value
            setMessages(prev => [...prev, {
                id: Date.now(),
                user: userDetails,
                message: newMessage
            }])
            const data: WebSocketMessage = {
                "type": "BROADCAST",
                "payload": { ...userDetails, message: newMessage }
            }
            sendMessage(data)
            textareaRef.current.value = ''
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
