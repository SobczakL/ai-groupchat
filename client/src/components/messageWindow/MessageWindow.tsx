import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { User, MessageData } from "@/lib/types";

interface MessageWindowProps {
    userDetails: User

}
export default function MessageWindow({ userDetails }: MessageWindowProps) {

    const { receivedMessages, allReceivedMessages, ws, sendMessage } = useWebSocket(userDetails);

    const userInputMessageRef = useRef<HTMLTextAreaElement>(null);
    const llmInputMessageRef = useRef<HTMLTextAreaElement>(null)

    const [messages, setMessages] = useState<MessageData[]>([]);
    const [processedMessages, setProcessedMessages] = useState(0)

    useEffect(() => {
        const newMessages = allReceivedMessages.slice(processedMessages)
        setMessages(prev => [...prev, ...newMessages])
        setProcessedMessages(allReceivedMessages.length)
    }, [allReceivedMessages]);


    const handleUserMessage = (inputRef: React.RefObject<HTMLTextAreaElement | null>,
        messageType: "chat" | "llm"
    ): void => {
        if (inputRef.current && inputRef.current.value.trim()) {
            const newMessage = inputRef.current.value;
            const userMessage: MessageData = {
                type: messageType,
                payload: {
                    id: Date.now() + Math.random(),
                    room: userDetails.roomId,
                    username: userDetails.username,
                    message: newMessage,
                    timestamp: Date.now()
                }
            }
            sendMessage(userMessage);
            inputRef.current.value = '';
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent, context: 'chat' | 'llm') => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (context === 'chat') {
                handleUserMessage(userInputMessageRef, context);
            }
            else if (context === 'llm') {
                handleUserMessage(llmInputMessageRef, context);
            }

        }
    };
    return (
        <div>
            <div>
                {messages &&
                    messages.map((message: MessageData, index: number) => (
                        <div key={index}>
                            <p key={index}>{message.payload.message}</p>
                            <p>{message.payload.displayTime.time}</p>
                        </div>
                    ))}
            </div>
            <div>
                <Textarea
                    ref={userInputMessageRef}
                    placeholder="Type your message here..."
                    onKeyDown={(e) => handleKeyDown(e, 'chat')}
                />
                <Button onClick={() => handleUserMessage(userInputMessageRef, 'chat')}>Send</Button>
            </div>
            <div>
                <Textarea
                    ref={llmInputMessageRef}
                    placeholder="Ask AI"
                    onKeyDown={(e) => handleKeyDown(e, 'llm')}
                />
            </div>
            <Button onClick={() => handleUserMessage(llmInputMessageRef, 'llm')}>Ask AI</Button>
        </div>
    )
}
