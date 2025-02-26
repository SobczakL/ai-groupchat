import { useEffect, useState } from 'react';
import './App.css';
import { Button } from "@/components/ui/button";
import useWebSocket from './lib/websocket';

function App() {
    const [userMessage, setUserMessage] = useState('');
    const { message, receivedMessages, ws, sendMessage } = useWebSocket('');

    const handleUserMessage = (e: React.FormEvent<HTMLFormElement>, message: string) => {
        e.preventDefault();
        setUserMessage(message);
        sendMessage(message)
        console.log("clicked")
    };

    useEffect(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            sendMessage(userMessage);
        } else {
            console.log("WebSocket not open yet, message will be sent on open");
        }
    }, [userMessage, ws, sendMessage]); // Depend on userMessage, ws, and sendMessage
    return (
        <div className='h-[100vh]'>
            <p className='mx-16 text-black'>hello!</p>
            <Button>button</Button>
            <form onSubmit={(e) => handleUserMessage(e, userMessage)}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                />
                <Button type="submit">send</Button>
            </form>
            {receivedMessages &&
                receivedMessages.map((message: string, index: number) => (
                    <p key={index}>{message}</p>
                ))}
        </div>
    );
}

export default App;
