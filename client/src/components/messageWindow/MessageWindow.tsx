import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface MessageWindowProps {
    receievedMessages: string[];
    sendMessage: (message: string) => void;
}

interface Message {
    id: number;
    user: string;
    message: string;
}

export default function MessageWindow({ receivedMessages, sendMessage }: MessageWindowProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [messages, setMessages] = useState<Message[]>([])

    const lastProcessedIndex = useRef(-1)

    const handleUserMessage = () => {
        if (textareaRef.current) {
            const newMessage = textareaRef.current.value
            setMessages(prevMessages => [...prevMessages, { id: Math.random(), user: "user", message: newMessage }])
            sendMessage(textareaRef.current.value)
            textareaRef.current.value = ''
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    };

    useEffect(() => {
        if (receivedMessages.length > lastProcessedIndex.current) {
            const lastMessage = receivedMessages[receivedMessages.length - 1]

            setMessages(prevMessages => [...prevMessages, { id: Math.random(), user: "llm", message: lastMessage }]);
            lastProcessedIndex.current = receivedMessages.length
        }
    }, [receivedMessages]);

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
