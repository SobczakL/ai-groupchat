import { useState } from 'react';
import './App.css';
import { Button } from "@/components/ui/button";
import useWebSocket from './lib/websocket';
import MessageWindow from './components/messageWindow/MessageWindow';

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
            <MessageWindow
                receivedMessages={receivedMessages}
                sendMessage={sendMessage}
            />
        </div>
    );
}

export default App;
