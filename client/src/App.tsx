import { useEffect, useState } from 'react';
import './App.css';
import { Button } from "@/components/ui/button";
import useWebSocket from './lib/websocket';

function App() {
    const [userMessage, setUserMessage] = useState('');
    const { receivedMessages, ws, sendMessage } = useWebSocket('');


    const handleUserMessage = (e: React.FormEvent<HTMLFormElement>, message: string) => {
        e.preventDefault();
        sendMessage(message)
        setUserMessage('')
    };

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
